const http = require('http');
// Contract: local ExpenseController/ExpenseService and duplicate-confirmation doc.
// Synthetic branches, currencies and records only; no backend isolation guarantees.
const seed = [
  { id: 'fixture-rent', name: 'Fixture rent', amount: 450, type: 0, registerDate: '2026-10-01', isRecurring: 1, recurringType: 3, recurringDate: '2026-11-01', locationId: 'branch-1', currencyId: 'usd', categoryName: 'Office Rent' },
  { id: 'fixture-fuel', name: 'Fixture fuel', amount: 12, type: 0, registerDate: '2026-10-02', isRecurring: 0, locationId: 'branch-1', currencyId: 'usd' },
  { id: 'fixture-income', name: 'Fixture income', amount: 20, type: 1, registerDate: '2026-10-02', isRecurring: 0 }
];
const send = (res, status, body) => { res.writeHead(status, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(body)); };
http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'content-type,authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,OPTIONS');
  if (req.method === 'OPTIONS') return send(res, 204, {});
  const url = new URL(req.url, 'http://localhost');
  let state = pm.state.get('expense.store') || { rows: seed, calls: [], sequence: 0 };
  const save = () => pm.state.set('expense.store', state);
  if (url.pathname === '/_test/reset') { state = { rows: seed, calls: [], sequence: 0 }; save(); return send(res, 200, {}); }
  if (url.pathname === '/_test/state') return send(res, 200, state);
  let body = req.body;
  if (body === undefined) { const chunks = []; for await (const chunk of req) chunks.push(chunk); body = Buffer.concat(chunks).toString(); }
  if (typeof body === 'string') body = body ? JSON.parse(body) : {};
  state.calls.push({ method: req.method, path: url.pathname, body, query: Object.fromEntries(url.searchParams), authenticated: Boolean(req.headers.authorization) }); save();
  if (url.pathname.startsWith('/failure/')) return send(res, 500, { error: { message: 'Expense service temporarily unavailable.' } });
  const path = url.pathname;
  const paged = rows => {
    const offset = Number(url.searchParams.get('offset') || 0), limit = Number(url.searchParams.get('limit') || 100);
    return send(res, 200, { data: rows.slice(offset, offset + limit), pagination: { total: rows.length, offset, limit } });
  };
  if (path === '/locations/useracess') return paged([{ id: 'branch-1', name: 'Fixture branch' }]);
  if (path === '/currencies') return paged([{ id: 'usd', code: 'USD', name: 'US Dollar' }]);
  if (path === '/finance/expenses/categories') return send(res, 200, [{ name: 'Office Rent', namekh: 'ការិយាល័យជួល' }]);
  if (path === '/finance/expenses' && req.method === 'GET') return paged(state.rows.map(row => ({ id: row.id, name: row.name, amount: row.amount, type: row.type, date: row.registerDate, isRecurring: row.isRecurring, category: null, locationId: row.locationId || null, location: row.locationId === 'branch-1' ? { id: 'branch-1', name: 'Fixture branch', code: 'BR01' } : null, currencyId: row.currencyId || null, currency: row.currencyId === 'usd' ? { id: 'usd', code: 'USD', name: 'US Dollar', symbol: '$' } : null })));
  if (path === '/finance/expenses' && req.method === 'POST') {
    if (!body.name || !Number.isFinite(body.amount) || !body.locationId || !body.currencyId) return send(res, 400, { error: { message: 'Invalid expense payload.' } });
    if (body.name === 'Fail save') return send(res, 500, { error: { message: 'Unable to save this expense.' } });
    const duplicate = state.rows.filter(row => row.name === body.name && row.amount === body.amount && row.registerDate === body.registerDate && row.locationId === body.locationId && row.currencyId === body.currencyId);
    if (duplicate.length && !body.duplicateAction) return send(res, 409, { error: { code: 'DUPLICATE_EXPENSE', message: 'A matching expense already exists.', details: { requiresConfirmation: true, duplicates: duplicate, allowedActions: ['create', 'override'] } } });
    if (body.duplicateAction === 'override') {
      const row = duplicate.find(row => row.id === body.duplicateExpenseId);
      if (!row) return send(res, 409, { error: { code: 'EXPENSE_DUPLICATE_CHANGED', message: 'Review matching expenses again.', details: { duplicates: duplicate, allowedActions: ['create', 'override'] } } });
      Object.assign(row, body); save(); return send(res, 200, row);
    }
    const row = { ...body, id: `created-${++state.sequence}` }; state.rows.push(row); save(); return send(res, 200, row);
  }
  const match = path.match(/^\/finance\/expenses\/([^/]+)$/);
  if (match) {
    const row = state.rows.find(row => row.id === decodeURIComponent(match[1]));
    if (!row) return send(res, 404, { error: { message: 'Expense not found.' } });
    if (req.method === 'GET') return send(res, 200, row);
    if (req.method === 'PUT') { Object.assign(row, body); save(); return send(res, 200, row); }
  }
  return send(res, 501, { error: { message: 'Endpoint not modeled.' } });
}).listen(process.env.PORT);
