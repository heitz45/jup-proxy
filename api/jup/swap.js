export default async function handler(req, res) {
  try {
    if (req.method === 'OPTIONS') {
      res.setHeader('access-control-allow-origin', '*');
      res.setHeader('access-control-allow-methods', 'POST, OPTIONS');
      res.setHeader('access-control-allow-headers', 'content-type');
      return res.status(204).send('');
    }

    const body = await new Promise((resolve) => {
      let data = '';
      req.on('data', (chunk) => (data += chunk));
      req.on('end', () => resolve(data));
    });

    const r = await fetch('https://quote-api.jup.ag/v6/swap', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0',
        'Accept-Language': 'en-US,en;q=0.9',
        'Origin': 'https://jup.ag',
        'Referer': 'https://jup.ag/',
        'content-type': req.headers['content-type'] || 'application/json'
      },
      body,
      cache: 'no-store'
    });

    const text = await r.text();
    res.setHeader('access-control-allow-origin', '*');
    res.setHeader('content-type', r.headers.get('content-type') || 'application/json');
    return res.status(r.status).send(text);
  } catch (e) {
    res.setHeader('access-control-allow-origin', '*');
    res.setHeader('content-type', 'application/json');
    return res.status(502).send(JSON.stringify({ error: String(e) }));
  }
}
