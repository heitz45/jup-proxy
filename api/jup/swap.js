export const config = { runtime: 'edge' };

export default async function handler(req) {
  try {
    // Handle CORS preflight from some environments
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'access-control-allow-origin': '*',
          'access-control-allow-methods': 'POST, OPTIONS',
          'access-control-allow-headers': 'content-type'
        }
      });
    }

    const body = await req.text(); // pass-through body exactly as received

    const r = await fetch('https://quote-api.jup.ag/v6/swap', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0',
        'Accept-Language': 'en-US,en;q=0.9',
        'Origin': 'https://jup.ag',
        'Referer': 'https://jup.ag/',
        'content-type': 'application/json'
      },
      body
    });

    const text = await r.text();

    const h = new Headers(r.headers);
    if (!h.get('content-type')) h.set('content-type', 'application/json');
    h.set('access-control-allow-origin', '*');

    return new Response(text, { status: r.status, headers: h });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 502,
      headers: { 'content-type': 'application/json', 'access-control-allow-origin': '*' }
    });
  }
}
