import { randomUUID } from 'node:crypto';
import { getDb } from './_lib/mongodb.js';
import { applyCors } from './_lib/cors.js';

// Handles both GET and POST /api/status, replacing the two FastAPI routes:
//   - POST /api/status -> create_status_check
//   - GET  /api/status -> get_status_checks
//
// NOTE on routing: Vercel maps both `api/status.js` and `api/status/index.js`
// to the same URL (`/api/status`), so they cannot coexist. The standard
// Vercel/Node serverless pattern is to dispatch on `req.method` inside a
// single handler, which is what we do here.
export default async function handler(req, res) {
  if (applyCors(req, res)) return;

  try {
    if (req.method === 'POST') {
      return await createStatusCheck(req, res);
    }
    if (req.method === 'GET') {
      return await getStatusChecks(req, res);
    }

    res.setHeader('Allow', 'GET, POST, OPTIONS');
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  } catch (err) {
    console.error('status handler error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function createStatusCheck(req, res) {
  const body = await readJsonBody(req);
  const clientName = body?.client_name;
  if (typeof clientName !== 'string' || clientName.length === 0) {
    res.status(422).json({
      detail: [
        {
          loc: ['body', 'client_name'],
          msg: 'field required',
          type: 'value_error.missing',
        },
      ],
    });
    return;
  }

  const doc = {
    id: randomUUID(),
    client_name: clientName,
    timestamp: new Date().toISOString(),
  };

  const db = await getDb();
  await db.collection('status_checks').insertOne({ ...doc });

  // Match the original FastAPI response shape (id, client_name, timestamp).
  res.status(200).json(doc);
}

async function getStatusChecks(_req, res) {
  const db = await getDb();
  const docs = await db
    .collection('status_checks')
    .find({}, { projection: { _id: 0 } })
    .limit(1000)
    .toArray();

  res.status(200).json(docs);
}

// Vercel's Node runtime parses JSON for us when Content-Type is
// application/json, but we read it defensively so callers that send the body
// as a stream still work.
async function readJsonBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return null;
    }
  }

  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  if (chunks.length === 0) return null;
  const raw = Buffer.concat(chunks).toString('utf8');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
