export default async function handler(req, res) {
  res.setHeader('content-type', 'application/json');
  res.setHeader('access-control-allow-origin', '*');
  return res.status(200).send(JSON.stringify({ ok: true, service: 'jup-proxy' }));
}
