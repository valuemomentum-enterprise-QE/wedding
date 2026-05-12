import { MongoClient } from 'mongodb';

// Reuse the MongoClient across serverless invocations. Vercel keeps a warm
// Node.js process around between requests, so caching the connection on the
// module's global scope avoids re-establishing the TCP/TLS handshake on every
// invocation. See https://vercel.com/guides/connection-pooling-with-mongodb.
let cachedClient = globalThis.__mongoClient;
let cachedClientPromise = globalThis.__mongoClientPromise;

export function getMongoClientPromise() {
  if (cachedClientPromise) return cachedClientPromise;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('Missing MONGODB_URI environment variable');
  }

  cachedClient = new MongoClient(uri, {
    maxPoolSize: 10,
  });
  cachedClientPromise = cachedClient.connect();

  globalThis.__mongoClient = cachedClient;
  globalThis.__mongoClientPromise = cachedClientPromise;

  return cachedClientPromise;
}

export async function getDb() {
  const dbName = process.env.DB_NAME;
  if (!dbName) {
    throw new Error('Missing DB_NAME environment variable');
  }
  const client = await getMongoClientPromise();
  return client.db(dbName);
}
