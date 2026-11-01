const http = require('http');
// Contract: adjacent pos-api ExpenseCategoryController, DTO and service.
// Synthetic data only. This mock does not establish tenant isolation or authorization.
const seed = () => [{ id: 'category-1', name: 'Admin Fee', namekh: 'ថ្លៃរដ្ឋបាល' }];
const send = (res, status, body) => { res.writeHead(status, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(body)); };
http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname === '/_test/reset') { pm.state.set('expense-categories.store', { rows: seed(), calls: [], sequence: 1 }); return send(res, 200, {}); }
  const state = pm.state.get('expense-categories.store') || { rows: seed(), calls: [], sequence: 1 };
  if (url.pathname === '/_test/state') return send(res, 200, state);
  let body = req.body;
  if (body === undefined) { const chunks = []; for await (const chunk of req) chunks.push(chunk); body = Buffer.concat(chunks).toString(); }
  body = typeof body === 'string' ? JSON.parse(body || '{}') : body || {};
  state.calls.push({ method: req.method, path: url.pathname, query: Object.fromEntries(url.searchParams), body, hasAuthorization: Boolean(req.headers.authorization) });
  pm.state.set('expense-categories.store', state);
  if (url.pathname.startsWith('/failure/')) return send(res, 500, { error: { message: 'Expense categories temporarily unavailable.' } });
  if (url.pathname === '/expense/categories' && req.method === 'GET') {
    const search = (url.searchParams.get('search') || '').toLowerCase();
    const rows = state.rows.filter(row => `${row.name} ${row.namekh}`.toLowerCase().includes(search)).sort((a, b) => a.name.localeCompare(b.name));
    const limit = Number(url.searchParams.get('limit') || 20), offset = Number(url.searchParams.get('offset') || 0);
    return send(res, 200, { data: rows.slice(offset, offset + limit), pagination: { total: rows.length, limit, offset } });
  }
  const match = url.pathname.match(/^\/expense\/categories\/([^/]+)$/);
  const record = match && state.rows.find(row => row.id === decodeURIComponent(match[1]));
  if (match && req.method === 'GET') return send(res, record ? 200 : 404, record || { error: { message: 'Expense category not found.' } });
  if (match && req.method === 'DELETE') {
    if (!record) return send(res, 404, { error: { message: 'Expense category not found.' } });
    state.rows = state.rows.filter(row => row.id !== record.id);
    pm.state.set('expense-categories.store', state);
    return send(res, 200, { affected: 1 });
  }
  if (req.method === 'POST' && url.pathname === '/expense/categories' || req.method === 'PUT' && match) {
    if (req.method === 'PUT' && !record) return send(res, 404, { error: { message: 'Expense category not found.' } });
    if (typeof body.name !== 'string' || !body.name.trim() || body.name.length > 255 || typeof body.namekh !== 'string' || body.namekh.length > 255 || Object.keys(body).some(key => !['name', 'namekh'].includes(key))) return send(res, 400, { error: { message: 'Invalid category fields.' } });
    if (state.rows.some(row => row.id !== (record && record.id) && row.name.toLowerCase() === body.name.trim().toLowerCase())) return send(res, 409, { error: { code: 'EXPENSE_CATEGORY_NAME_EXISTS', message: 'An expense category with this name already exists.' } });
    const saved = { id: record ? record.id : `category-${++state.sequence}`, name: body.name.trim(), namekh: body.namekh.trim() };
    if (record) Object.assign(record, saved); else state.rows.push(saved);
    pm.state.set('expense-categories.store', state);
    return send(res, 200, saved);
  }
  return send(res, 501, { error: { message: 'Endpoint not modeled.' } });
}).listen(process.env.PORT);
