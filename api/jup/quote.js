export const config = { runtime: 'edge' };

export default async function handler(req) {
  try {
    const url = new URL(req.url);
    const upstream = 'https://quote-api.jup.ag/v6/quote' + url.search;

    const r = await fetch(upstream, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0',
        'Accept-Language': 'en-US,en;q=0.9',
        'Origin': 'https://jup.ag',
        'Referer': 'https://jup.ag/'
      }
    });

    const h = new Headers(r.headers);
    if (!h.get('content-type')) h.set('content-type', 'application/json');
    h.set('access-control-allow-origin', '*');

    return new Response(r.body, { status: r.status, headers: h });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 502,
      headers: { 'content-type': 'application/json' }
    });
  }
}
