const http = require('http');
// Local contract: agent-handoff/2026-10-27-001-item-type-api-review.md and adjacent pos-api source.
// Failure prefixes are synthetic resilience fixtures. This mock is not an auth/tenant security test.
const seed = [{ id: '11111111-1111-4111-8111-111111111111', clientId: 'fixture-client', name: 'Physical Product', code: 'PHYSICAL_PRODUCT', description: '', image: '', enableInventoryTracking: true, isSellable: true, productOption: 0, serialType: 2, sortOrder: 0, status: 1, isSystem: true }];
const get = () => pm.state.get('item-types.store') || { records: seed, sequence: 1, calls: [] };
const save = state => pm.state.set('item-types.store', state);
const send = (res, status, body) => { res.writeHead(status, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(body)); };
async function bodyOf(req) {
  if (req.body !== undefined) return typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body;
  const chunks = []; for await (const chunk of req) chunks.push(chunk);
  return JSON.parse(Buffer.concat(chunks).toString() || '{}');
}
http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'content-type,authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  if (req.method === 'OPTIONS') return send(res, 204, {});
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname === '/_test/reset' && req.method === 'POST') { save({ records: seed, sequence: 1, calls: [] }); return send(res, 200, {}); }
  const state = get();
  if (url.pathname === '/_test/state') return send(res, 200, state);
  const body = await bodyOf(req);
  state.calls.push({ method: req.method, path: url.pathname, query: Object.fromEntries(url.searchParams), body, hasAuthorization: Boolean(req.headers.authorization) }); save(state);
  if (url.pathname.endsWith('/privilege/check/permission')) return send(res, 200, !url.pathname.startsWith('/denied/'));
  if (url.pathname.startsWith('/failure/')) return send(res, 500, { error: { code: 500, message: 'Item types temporarily unavailable.' } });
  const path = url.pathname.replace(/^\/(?:empty|missing|slow)\//, '/');
  if (path === '/item-types/defaults/all' && req.method === 'GET') return send(res, 200, { data: state.records.filter(r => r.status === 1), pagination: { total: state.records.length, offset: 0, limit: 0 } });
  if (path === '/item-types' && req.method === 'GET') {
    const search = (url.searchParams.get('search') || '').toLowerCase();
    let rows = state.records.filter(r => r.status !== 3 && (!search || r.name.toLowerCase().includes(search) || (r.code || '').toLowerCase().includes(search)));
    const field = url.searchParams.get('sortField') || 'sortOrder';
    const direction = url.searchParams.get('sortOrder') === 'DESC' ? -1 : 1;
    rows.sort((a, b) => (a[field] < b[field] ? -1 : a[field] > b[field] ? 1 : 0) * direction);
    if (url.pathname.startsWith('/empty/')) rows = [];
    const total = rows.length, limit = Number(url.searchParams.get('limit') || 15), offset = Number(url.searchParams.get('offset') || 0);
    const reply = () => send(res, 200, { data: rows.slice(offset, offset + limit), pagination: { total, limit, offset } });
    return url.pathname.startsWith('/slow/') ? setTimeout(reply, 120) : reply();
  }
  if (path === '/item-types' && req.method === 'POST') {
    if (!body.clientId || body.isSystem !== false || typeof body.enableInventoryTracking !== 'boolean' || typeof body.isSellable !== 'boolean' || !body.name) return send(res, 500, { error: { code: 500, message: 'Invalid create payload for current contract.' } });
    const row = { ...body, id: `22222222-2222-4222-8222-${String(++state.sequence).padStart(12, '0')}` };
    state.records.push(row); save(state); return send(res, 200, { data: row });
  }
  const match = path.match(/^\/item-types\/([^/]+)$/);
  if (!match) return send(res, 501, { error: { code: 501, message: 'Endpoint not modeled.' } });
  const id = decodeURIComponent(match[1]), row = state.records.find(r => r.id === id);
  if (req.method === 'GET') return send(res, 200, row && !url.pathname.startsWith('/missing/') ? { data: row } : {});
  if (req.method === 'PUT') {
    if (!row || url.pathname.startsWith('/missing/')) return send(res, 200, {});
    Object.assign(row, body); save(state); return send(res, 200, { data: row });
  }
  if (req.method === 'DELETE') {
    state.records = state.records.filter(r => r.id !== id); save(state);
    return send(res, 200, { raw: {}, affected: row ? 1 : 0 });
  }
  return send(res, 501, { error: { code: 501, message: 'Endpoint not modeled.' } });
}).listen(process.env.PORT);
