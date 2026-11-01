import moment from 'moment';

export const frequencies = { 1: 'Daily', 2: 'Weekly', 3: 'Monthly' };
export const commitmentFrequencies = { daily: 'Daily', weekly: 'Weekly', monthly: 'Monthly', yearly: 'Yearly' };
export const EXPENSE_TIME_ZONE = 'Asia/Phnom_Penh';

function datePartsInBusinessTimeZone(date) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: EXPENSE_TIME_ZONE,
    year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(date).reduce((values, part) => ({ ...values, [part.type]: part.value }), {});
}

export function businessToday(now = new Date()) {
  const parts = datePartsInBusinessTimeZone(now);
  return moment(`${parts.year}-${parts.month}-${parts.day}`, 'YYYY-MM-DD', true);
}

export function expenseDateKey(value) {
  if (typeof value !== 'string') return '';
  const dateOnly = value.match(/^(\d{4}-\d{2}-\d{2})$/);
  if (dateOnly) return moment(dateOnly[1], 'YYYY-MM-DD', true).isValid() ? dateOnly[1].slice(0, 7) : '';
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return '';
  const parts = datePartsInBusinessTimeZone(date);
  return `${parts.year}-${parts.month}`;
}

export function expenseLocation(row) {
  const location = row.location || {};
  const id = row.locationId == null ? location.id : row.locationId;
  const text = value => typeof value === 'string' ? value.trim() : '';
  return { id: id == null ? '' : String(id), name: text(location.name), code: text(location.code) };
}

export function expenseLocations(records) {
  const locations = new Map();
  records.filter(row => row.type === 0 || row.type === '0').forEach(row => {
    const location = expenseLocation(row);
    if (location.id && (location.name || location.code)) locations.set(location.id, location);
  });
  return Array.from(locations.values()).sort((a, b) => (a.name || a.code).localeCompare(b.name || b.code));
}

export function expenseMoney(row) {
  const text = value => typeof value === 'string' ? value.trim() : '';
  const currency = row.currency || {};
  const code = text(currency.code), name = text(currency.name), symbol = text(currency.symbol);
  const label = [code, name].filter(Boolean).join(' · ') || (symbol ? `Currency symbol: ${symbol}` : 'Currency not supplied');
  const valid = (typeof row.amount === 'number' || typeof row.amount === 'string' && row.amount.trim() !== '') && Number.isFinite(Number(row.amount));
  if (!valid) return { amount: 'Amount unavailable', label, code, name, symbol };
  const value = Number(row.amount);
  const amount = Math.abs(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return { amount: `${value < 0 ? '-' : ''}${symbol || (code ? `${code} ` : '')}${amount}`, label, code, name, symbol };
}

export function errorText(error, fallback) {
  const body = error && error.response && error.response.data;
  const text = body && body.error && body.error.message || body && body.message || error && error.message;
  return typeof text === 'string' ? text : fallback;
}

export function entity(response) {
  const body = response && response.data;
  const record = body && body.data && !Array.isArray(body.data) ? body.data : body;
  if (!record || typeof record.id !== 'string') throw new Error('The saved expense could not be confirmed. Refresh before retrying.');
  return record;
}

// This API does not implement date/recurrence filters. Never filter one server
// page and present it as the whole period. Refuse oversized/inconsistent snapshots.
export async function loadSnapshot(getPage, isCurrent = () => true) {
  const records = [], ids = new Set();
  let expected;
  while (isCurrent()) {
    const response = await getPage({ limit: 100, offset: records.length });
    if (!isCurrent()) return null;
    const body = response && response.data;
    const total = body && body.pagination && body.pagination.total;
    if (!body || !Array.isArray(body.data) || !Number.isSafeInteger(total) || total < 0) throw new Error('The list response could not be read. Please retry.');
    if (total > 2000) throw new Error('This account needs server-side expense filtering before this view can load more than 2,000 records.');
    if (expected !== undefined && total !== expected) throw new Error('Expenses changed while loading. Please refresh.');
    expected = total;
    for (const record of body.data) {
      if (!record || typeof record.id !== 'string' || ids.has(record.id)) throw new Error('The expense list changed while loading. Please refresh.');
      ids.add(record.id); records.push(record);
    }
    if (records.length === expected) return records;
    if (!body.data.length || records.length > expected) throw new Error('The expense list is incomplete. Please retry.');
  }
  return null;
}

export function periodRows(records, month, tab, search, locationId = '') {
  const key = month.format('YYYY-MM');
  const query = search.trim().toLocaleLowerCase();
  return records.filter(row => row.type === 0 || row.type === '0')
    .filter(row => expenseDateKey(row.date) === key)
    .filter(row => tab !== 'recurring' || Number(row.isRecurring) === 1)
    .filter(row => !locationId || expenseLocation(row).id === String(locationId))
    .filter(row => !query || `${row.name || ''} ${row.category || ''} ${row.payeeName || ''} ${row.reference || ''}`.toLocaleLowerCase().includes(query));
}

export function commitmentRows(commitments, month, search, locationId = '', locations = [], currencies = []) {
  const start = month.clone().startOf('month').format('YYYY-MM-DD');
  const end = month.clone().endOf('month').format('YYYY-MM-DD');
  const query = search.trim().toLocaleLowerCase();
  const locationById = new Map(locations.map(row => [String(row.id), row]));
  const currencyById = new Map(currencies.map(row => [String(row.id), row]));
  return commitments
    .filter(row => typeof row.startsOn === 'string' && row.startsOn <= end && (!row.endsOn || row.endsOn >= start))
    .filter(row => !locationId || String(row.locationId || '') === String(locationId))
    .filter(row => !query || `${row.name || ''} ${row.categoryName || ''} ${row.payeeName || ''}`.toLocaleLowerCase().includes(query))
    .map(row => ({
      ...row,
      accountingCommitment: true,
      type: 0,
      isRecurring: 1,
      date: row.startsOn,
      category: row.categoryName,
      location: row.locationId == null ? null : locationById.get(String(row.locationId)) || null,
      currency: currencyById.get(String(row.currencyId)) || null
    }));
}

export function duplicateDetails(error) {
  const value = error && error.response && error.response.data && error.response.data.error;
  if (!value || !['DUPLICATE_EXPENSE', 'EXPENSE_DUPLICATE_CHANGED'].includes(value.code)) return null;
  const details = value.details;
  return details && Array.isArray(details.duplicates) && Array.isArray(details.allowedActions) ? details : null;
}

export function validAttachment(file) {
  if (!file || !/\.(pdf|jpe?g|png|gif|webp)$/i.test(file.name)) return 'Choose a PDF, JPG, PNG, GIF or WebP document.';
  if (file.size > 10 * 1024 * 1024) return 'Documents must be 10 MB or smaller.';
  return '';
}
