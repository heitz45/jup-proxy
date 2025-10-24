export default async function handler(req, res) {
  try {
    // Parse path/query from the incoming request
    const incoming = new URL(req.url, 'http://localhost');
    const pathOnly = incoming.pathname.replace(/^\/api\/jup/, '') || '/';
    const query = incoming.search || '';

    // Health check: GET /api/jup
    if (pathOnly === '/' && (req.method === 'GET' || req.method === 'HEAD')) {
      return res.status(200).json({ ok: true, service: 'jup-proxy' });
    }

    // Upstream
    const upstream = 'https://quote-api.jup.ag' + pathOnly + query;

    const init = {
      method: req.method,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0',
        'Accept-Language': 'en-US,en;q=0.9',
        'Origin': 'https://jup.ag',
        'Referer': 'https://jup.ag/'
      }
    };

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      const body = await new Promise((resolve) => {
        let data = '';
        req.on('data', chunk => (data += chunk));
        req.on('end', () => resolve(data));
      });
      init.headers['content-type'] = req.headers['content-type'] || 'application/json';
      init.body = body;
    }

    const r = await fetch(upstream, init);
    const text = await r.text();

    res.status(r.status);
    res.setHeader('content-type', r.headers.get('content-type') || 'application/json');
    res.setHeader('access-control-allow-origin', '*');
    res.send(text);
  } catch (e) {
    res.status(502).json({ error: String(e) });
  }
}
