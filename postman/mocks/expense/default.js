const http = require('http');
// Contract: local ExpenseController/ExpenseService and duplicate-confirmation doc.
// Synthetic branches, currencies and records only; no backend isolation guarantees.
const seed = [
  { id: 'fixture-rent', name: 'Fixture rent', amount: 450, type: 0, registerDate: '2026-10-01', isRecurring: 1, recurringType: 3, recurringDate: '2026-11-01', locationId: 'branch-1', currencyId: 'usd', categoryName: 'Office Rent' },
  { id: 'fixture-fuel', name: 'Fixture fuel', amount: 12, type: 0, registerDate: '2026-10-02', isRecurring: 0, locationId: 'branch-1', currencyId: 'usd' },
  { id: 'fixture-income', name: 'Fixture income', amount: 20, type: 1, registerDate: '2026-10-02', isRecurring: 0 }
];
const commitmentSeed = [
  { id: 'commitment-rent', businessId: 'business-1', name: 'Fixture rent', payeeName: 'Fixture landlord', amount: '450.0000', currencyId: 'usd', locationId: 'branch-1', categoryName: 'Office Rent', frequency: 'monthly', intervalCount: 1, dueDay: 1, startsOn: '2026-09-01', endsOn: null, status: 'active', autoGenerate: false, draftLeadDays: 0 }
];
const billSeed = [
  { id: 'bill-fixture-rent', businessId: 'business-1', commitmentId: 'commitment-rent', name: 'Fixture rent', payeeName: 'Fixture landlord', locationId: 'branch-1', periodStart: '2026-10-01', periodEnd: '2026-10-31', dueDate: new Date().toISOString().slice(0, 10), amount: '450.0000', outstandingAmount: '450.0000', currencyId: 'usd', status: 'approved' },
  { id: 'bill-fixture-draft', businessId: 'business-1', commitmentId: 'commitment-rent', name: 'Fixture rent draft', payeeName: 'Fixture landlord', locationId: 'branch-1', periodStart: '2026-11-01', periodEnd: '2026-11-30', dueDate: '2026-11-01', amount: '450.0000', outstandingAmount: '450.0000', currencyId: 'usd', status: 'draft' }
];
const send = (res, status, body) => { res.writeHead(status, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(body)); };
http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'content-type,authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  if (req.method === 'OPTIONS') return send(res, 204, {});
  const url = new URL(req.url, 'http://localhost');
  let state = pm.state.get('expense.store') || { rows: seed, commitments: commitmentSeed, bills: billSeed, payments: [], generationSettings: [], calls: [], sequence: 0 };
  if (!Array.isArray(state.commitments)) state.commitments = commitmentSeed;
  if (!Array.isArray(state.bills)) state.bills = billSeed;
  if (!Array.isArray(state.payments)) state.payments = [];
  if (!Array.isArray(state.generationSettings)) state.generationSettings = [];
  const save = () => pm.state.set('expense.store', state);
  if (url.pathname === '/_test/reset') { state = { rows: seed, commitments: commitmentSeed, bills: billSeed, payments: [], generationSettings: [], calls: [], sequence: 0 }; save(); return send(res, 200, {}); }
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
  if (path === '/currencies') return paged([{ id: 'usd', code: 'USD', name: 'US Dollar', symbol: '$' }]);
  if (path === '/finance/expenses/summary' && req.method === 'GET') {
    const month = url.searchParams.get('month');
    const locationId = url.searchParams.get('locationId') || null;
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month || '')) return send(res, 400, { error: { message: 'month must use YYYY-MM format.' } });
    if (locationId && locationId !== 'branch-1') return send(res, 404, { error: { message: 'Location not found.' } });
    const expenses = state.rows.filter(row => Number(row.type) === 0 && String(row.registerDate || '').slice(0, 7) === month && (!locationId || row.locationId === locationId));
    const byCurrency = new Map();
    expenses.forEach(row => {
      const currencyId = row.currencyId || null;
      const summary = byCurrency.get(currencyId) || { currencyId, expenseCount: 0, recordedAmount: 0 };
      summary.expenseCount++;
      summary.recordedAmount += Number(row.amount) || 0;
      byCurrency.set(currencyId, summary);
    });
    const currencySummaries = Array.from(byCurrency.values()).map(summary => ({
      ...summary,
      recordedAmount: summary.recordedAmount.toFixed(2),
      currency: summary.currencyId === 'usd' ? { id: 'usd', code: 'USD', name: 'US Dollar', symbol: '$' } : null
    }));
    const monthStart = `${month}-01`;
    const monthEnd = new Date(Date.UTC(Number(month.slice(0, 4)), Number(month.slice(5, 7)), 0)).toISOString().slice(0, 10);
    const fixedByCurrency = new Map();
    state.commitments.filter(row => row.status === 'active' && row.startsOn <= monthEnd && (!row.endsOn || row.endsOn >= monthStart) && (!locationId || row.locationId === locationId)).forEach(row => {
      const interval = Math.max(1, Number(row.intervalCount) || 1);
      const amount = Number(row.amount) || 0;
      const monthly = row.frequency === 'daily' ? amount * 365.25 / 12 / interval
        : row.frequency === 'weekly' ? amount * 52.1785714286 / 12 / interval
          : row.frequency === 'yearly' ? amount / 12 / interval : amount / interval;
      const currencyId = row.currencyId || null;
      const item = fixedByCurrency.get(currencyId) || { currencyId, amount: 0, activeCommitments: 0, categoryBreakdown: [], currency: currencyId === 'usd' ? { id: 'usd', code: 'USD', name: 'US Dollar', symbol: '$' } : null };
      item.amount += monthly; item.activeCommitments++;
      const category = item.categoryBreakdown.find(value => value.categoryName === (row.categoryName || 'Uncategorized')) || { categoryName: row.categoryName || 'Uncategorized', amount: 0, commitmentCount: 0 };
      category.amount += monthly; category.commitmentCount++;
      if (!item.categoryBreakdown.includes(category)) item.categoryBreakdown.push(category);
      fixedByCurrency.set(currencyId, item);
    });
    const fixedBillSummaries = Array.from(fixedByCurrency.values()).map(item => ({ ...item, amount: item.amount.toFixed(4), categoryBreakdown: item.categoryBreakdown.map(category => ({ ...category, amount: category.amount.toFixed(4) })) }));
    const dueByCurrency = new Map();
    state.bills.filter(row => ['approved', 'partially_paid'].includes(row.status) && Number(row.outstandingAmount) > 0 && (!locationId || row.locationId === locationId)).forEach(row => {
      const item = dueByCurrency.get(row.currencyId) || { currencyId: row.currencyId, amount: 0, billCount: 0, currency: row.currencyId === 'usd' ? { id: 'usd', code: 'USD', name: 'US Dollar', symbol: '$' } : null };
      item.amount += Number(row.outstandingAmount); item.billCount++;
      dueByCurrency.set(row.currencyId, item);
    });
    const dueSoonSummaries = Array.from(dueByCurrency.values()).map(item => ({ ...item, amount: item.amount.toFixed(4) }));
    return send(res, 200, {
      period: { month, timezone: 'Asia/Phnom_Penh', locationId },
      currencySummaries,
      cards: {
        expenseRecords: { available: true, recordCount: expenses.length, meaning: 'expense-records-created-in-period' },
        fixedBills: { available: true, currencySummaries: fixedBillSummaries },
        dueSoon: { available: true, windowDays: 7, currencySummaries: dueSoonSummaries },
        paidThisMonth: { available: true, currencySummaries: [], progressBasis: 'fully-reconciled-bill-count' },
        autoGenerate: (() => {
          const setting = state.generationSettings.find(row => String(row.locationId || '') === String(locationId || '')) || state.generationSettings.find(row => row.locationId == null);
          return { available: Boolean(setting), reasonCode: setting ? null : 'SCHEDULER_CONFIG_UNAVAILABLE', configured: Boolean(setting), active: setting ? Boolean(setting.enabled) : null, nextRunAt: setting && setting.nextRunAt || null, draftLeadDays: setting ? setting.draftLeadDays : null, timezone: setting && setting.timezone || null };
        })()
      }
    });
  }
  if (path === '/finance/expenses/accounting/generation-settings' && req.method === 'GET') return send(res, 200, state.generationSettings);
  if (path === '/finance/expenses/accounting/generation-settings' && req.method === 'PUT') {
    const locationId = body.locationId == null || body.locationId === '' ? null : body.locationId;
    const draftLeadDays = Number(body.draftLeadDays);
    if (typeof body.enabled !== 'boolean' || !Number.isInteger(draftLeadDays) || draftLeadDays < 0 || draftLeadDays > 365) return send(res, 400, { error: { message: 'Invalid generation settings.' } });
    const existing = state.generationSettings.find(row => String(row.locationId || '') === String(locationId || ''));
    const setting = existing || { id: `generation-setting-${++state.sequence}`, businessId: 'business-1', locationId, nextRunAt: null, lastRunAt: null };
    Object.assign(setting, { enabled: body.enabled, draftLeadDays, timezone: body.timezone || null, updatedAt: new Date().toISOString() });
    if (!existing) state.generationSettings.push(setting);
    save(); return send(res, 200, setting);
  }
  if (path === '/finance/expenses/categories') return send(res, 200, [{ name: 'Office Rent', namekh: 'ការិយាល័យជួល' }]);
  if (path === '/finance/expenses/accounting/commitments' && req.method === 'GET') {
    const locationId = url.searchParams.get('locationId');
    const rows = state.commitments.filter(row => !locationId || String(row.locationId || '') === locationId);
    return send(res, 200, rows);
  }
  if (path === '/finance/expenses/accounting/bills' && req.method === 'GET') {
    const status = url.searchParams.get('status');
    const locationId = url.searchParams.get('locationId');
    const rows = state.bills.filter(bill => (!status || bill.status === status) && (!locationId || String(bill.locationId || '') === locationId)).map(bill => {
      const commitment = state.commitments.find(row => row.id === bill.commitmentId) || {};
      return {
        ...bill, name: bill.name || commitment.name || 'Recurring bill', categoryId: commitment.categoryId || null,
        categoryName: commitment.categoryName || null, payeeName: bill.payeeName || commitment.payeeName || null,
        location: bill.locationId === 'branch-1' ? { id: 'branch-1', name: 'Fixture branch', code: 'BR01' } : null,
        currency: bill.currencyId === 'usd' ? { id: 'usd', code: 'USD', name: 'US Dollar', symbol: '$' } : null
      };
    });
    return send(res, 200, rows);
  }
  const billStatusMatch = path.match(/^\/finance\/expenses\/accounting\/bills\/([^/]+)\/status$/);
  if (billStatusMatch && req.method === 'PUT') {
    const bill = state.bills.find(row => row.id === decodeURIComponent(billStatusMatch[1]));
    if (!bill) return send(res, 404, { error: { message: 'Expense bill not found.' } });
    if (!['approved', 'void'].includes(body.status) || bill.status !== 'draft') return send(res, 400, { error: { message: 'Only draft bills can be approved or voided.' } });
    bill.status = body.status; save(); return send(res, 200, bill);
  }
  if (path === '/finance/expenses/accounting/commitments' && req.method === 'POST') {
    if (!body.name || !Number.isFinite(Number(body.amount)) || !body.currencyId || !body.startsOn || !body.frequency) return send(res, 400, { error: { message: 'Invalid commitment payload.' } });
    const row = { ...body, id: `commitment-${++state.sequence}`, businessId: 'business-1', amount: Number(body.amount).toFixed(4), status: 'active' };
    state.commitments.push(row); save(); return send(res, 200, row);
  }
  if (path === '/finance/expenses/accounting/payments/allocations' && req.method === 'GET') {
    const month = url.searchParams.get('month');
    const locationId = url.searchParams.get('locationId');
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month || '')) return send(res, 400, { error: { message: 'month must use YYYY-MM format.' } });
    const rows = state.payments.flatMap(payment => (payment.allocations || []).filter(allocation => payment.status === 'posted' && allocation.reconciledAt && Number(allocation.reconciledAmount) > 0)
      .map(allocation => {
        const bill = state.bills.find(row => row.id === allocation.billId) || {};
        const commitment = state.commitments.find(row => row.id === bill.commitmentId) || {};
        const date = allocation.reconciledAt.slice(0, 10);
        return {
          id: `payment-allocation-${allocation.id}`, allocationId: allocation.id, paymentId: payment.id,
          billId: bill.id || allocation.billId, commitmentId: bill.commitmentId || null,
          name: bill.name || commitment.name || 'Bill payment', category: commitment.categoryName || null,
          payeeName: bill.payeeName || commitment.payeeName || null, locationId: bill.locationId || payment.locationId || null,
          location: (bill.locationId || payment.locationId) === 'branch-1' ? { id: 'branch-1', name: 'Fixture branch', code: 'BR01' } : null,
          currencyId: bill.currencyId || payment.currencyId || null,
          currency: (bill.currencyId || payment.currencyId) === 'usd' ? { id: 'usd', code: 'USD', name: 'US Dollar', symbol: '$' } : null,
          amount: allocation.reconciledAmount, type: 0, isRecurring: 0, accountingPayment: true,
          date, paidAt: payment.paidAt, reconciledAt: allocation.reconciledAt,
          paymentMethodId: payment.paymentMethodId || null, reference: payment.reference || null, paymentStatus: payment.status
        };
      }).filter(row => row.date.slice(0, 7) === month && (!locationId || String(row.locationId) === locationId)));
    rows.sort((a, b) => b.reconciledAt.localeCompare(a.reconciledAt));
    return paged(rows);
  }
  const commitmentMatch = path.match(/^\/finance\/expenses\/accounting\/commitments\/([^/]+)$/);
  if (commitmentMatch && req.method === 'PUT') {
    const row = state.commitments.find(item => item.id === decodeURIComponent(commitmentMatch[1]));
    if (!row) return send(res, 404, { error: { message: 'Expense commitment not found.' } });
    Object.assign(row, body); save(); return send(res, 200, row);
  }
  if (path === '/finance/expenses/accounting/bills/payable' && req.method === 'GET') {
    const locationId = url.searchParams.get('locationId');
    const bills = state.bills.filter(row => ['approved', 'partially_paid'].includes(row.status) && Number(row.outstandingAmount) > 0 && (!locationId || String(row.locationId || '') === locationId));
    return send(res, 200, { windowDays: 7, timezone: 'Asia/Phnom_Penh', today: new Date().toISOString().slice(0, 10), dueThrough: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10), data: bills });
  }
  if (path === '/finance/expenses/accounting/payments' && req.method === 'POST') {
    const payment = { id: `payment-${++state.sequence}`, ...body, status: 'pending', allocations: (body.allocations || []).map((allocation, index) => ({ id: `allocation-${state.sequence}-${index + 1}`, billId: allocation.billId, amount: String(allocation.amount), reconciledAmount: '0.0000' })) };
    state.payments.push(payment); save(); return send(res, 200, payment);
  }
  const reconcileMatch = path.match(/^\/finance\/expenses\/accounting\/payments\/([^/]+)\/reconcile$/);
  if (reconcileMatch && req.method === 'POST') {
    const payment = state.payments.find(row => row.id === decodeURIComponent(reconcileMatch[1]));
    if (!payment) return send(res, 404, { error: { message: 'Expense payment not found.' } });
    for (const request of body.allocations || []) {
      const allocation = payment.allocations.find(row => row.id === request.allocationId);
      if (!allocation) return send(res, 404, { error: { message: 'Payment allocation not found.' } });
      const amount = Number(request.reconciledAmount == null ? allocation.amount : request.reconciledAmount);
      allocation.reconciledAmount = amount.toFixed(4); allocation.reconciledAt = new Date().toISOString();
      const bill = state.bills.find(row => row.id === allocation.billId);
      if (bill) {
        bill.outstandingAmount = Math.max(0, Number(bill.outstandingAmount) - amount).toFixed(4);
        bill.status = Number(bill.outstandingAmount) === 0 ? 'paid' : 'partially_paid';
      }
    }
    payment.status = 'posted'; payment.reconciledAt = new Date().toISOString(); save(); return send(res, 200, payment);
  }
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
    if (req.method === 'DELETE') { const affected = Number(row.isSystem) === 1 ? 0 : 1; if (affected) state.rows = state.rows.filter(item => item.id !== row.id); save(); return send(res, 200, { raw: [], affected }); }
  }
  return send(res, 501, { error: { message: 'Endpoint not modeled.' } });
}).listen(process.env.PORT);
