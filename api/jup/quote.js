export default async function handler(req, res) {
  try {
    const url = new URL(req.url, 'http://localhost');
    const upstream = 'https://quote-api.jup.ag/v6/quote' + url.search;

    const r = await fetch(upstream, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0',
        'Accept-Language': 'en-US,en;q=0.9',
        'Origin': 'https://jup.ag',
        'Referer': 'https://jup.ag/'
      },
      // avoid any caching weirdness
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
