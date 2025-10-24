export const config = { runtime: 'edge' };

export default async function handler() {
  return new Response(
    JSON.stringify({ ok: true, service: 'jup-proxy' }),
    { status: 200, headers: { 'content-type': 'application/json' } }
  );
}
