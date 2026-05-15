// Shared CORS helper for Vercel serverless functions. Mirrors the behaviour of
// the previous FastAPI `CORSMiddleware` configuration which read the
// `CORS_ORIGINS` env var (comma-separated) and defaulted to `*`.
export function applyCors(req, res) {
  const originsEnv = process.env.CORS_ORIGINS || '*';
  const allowedOrigins = originsEnv.split(',').map((o) => o.trim()).filter(Boolean);

  const requestOrigin = req.headers.origin;
  let allowOrigin = '*';
  if (!allowedOrigins.includes('*')) {
    allowOrigin = allowedOrigins.includes(requestOrigin) ? requestOrigin : allowedOrigins[0] || '';
  }

  res.setHeader('Access-Control-Allow-Origin', allowOrigin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    req.headers['access-control-request-headers'] || 'Content-Type,Authorization',
  );

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return true;
  }
  return false;
}
