import { applyCors } from './_lib/cors.js';

// GET /api/ — health/hello endpoint, matches the original FastAPI `root()`.
export default function handler(req, res) {
  if (applyCors(req, res)) return;

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET, OPTIONS');
    res.status(405).json({ error: `Method ${req.method} not allowed` });
    return;
  }

  res.status(200).json({ message: 'Hello World' });
}
