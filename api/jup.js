export default async function handler(req, res) {
  try {
    // req.url includes the path part that Vercel routed to us (e.g. "/api/jup/v6/quote?...")
    // Convert to a URL object to safely split pathname and query.
    const incoming = new URL(req.url, 'http://localhost');
    // Remove the "/api/jup" prefix, keep the rest (e.g. "/v6/quote")
    const pathOnly = incoming.pathname.replace(/^\/api\/jup/, '') || '/';
    const upstream = 'https://quote-api.jup.ag' + pathOnly + incoming.search;

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
        req.on('data', chunk => data += chunk);
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
