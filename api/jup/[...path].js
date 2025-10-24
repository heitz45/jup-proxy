export const config = { runtime: 'edge' };

export default async function handler(req) {
  try {
    const url = new URL(req.url);
    // Vercel places the matched remainder after /api/jup/ in the pathname
    // Example: /api/jup/v6/quote -> remainder "v6/quote"
    const remainder = url.pathname.replace(/^\/api\/jup\/?/, ''); // e.g. "v6/quote"
    const query = url.search || '';

    const upstream = 'https://quote-api.jup.ag/' + remainder + query;

    const init = {
      method: req.method,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0',
        'Accept-Language': 'en-US,en;q=0.9',
        'Origin': 'https://jup.ag',
        'Referer': 'https://jup.ag/'
      },
      body: (req.method === 'GET' || req.method === 'HEAD') ? undefined : await req.text()
    };

    const r = await fetch(upstream, init);

    const h = new Headers(r.headers);
    if (!h.get('content-type')) h.set('content-type', 'application/json');
    h.set('access-control-allow-origin', '*');

    return new Response(r.body, { status: r.status, headers: h });
  } catch (e) {
    return new Response(
      JSON.stringify({ error: String(e) }),
      { status: 502, headers: { 'content-type': 'application/json' } }
    );
  }
}
