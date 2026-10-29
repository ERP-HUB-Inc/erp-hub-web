import moment from 'moment';
import { duplicateDetails, entity, expenseLocation, expenseLocations, expenseMoney, loadSnapshot, periodRows, validAttachment } from './model';

const page = (data, total) => ({ data: { data, pagination: { total } } });

test('branch choices use returned locations, deduplicate IDs and exclude income-only branches', () => {
  const rows = [
    { type: 0, locationId: 'branch-1', location: { id: 'branch-1', name: 'Branch name', code: 'BR01' } },
    { type: 0, locationId: 'branch-1', location: { id: 'branch-1', name: 'Branch name', code: 'BR01' } },
    { type: 0, location: { id: 2, name: 'Second branch', code: 'BR02' } },
    { type: 1, location: { id: 'income-only', name: 'Income branch', code: 'INC' } },
    { type: 0, locationId: 'deleted', location: null }
  ];
  expect(expenseLocations(rows)).toEqual([
    { id: 'branch-1', name: 'Branch name', code: 'BR01' },
    { id: '2', name: 'Second branch', code: 'BR02' }
  ]);
  expect(expenseLocation({ locationId: 'deleted', location: null })).toEqual({ id: 'deleted', name: '', code: '' });
});

test('branch filtering combines with month, recurrence and search using stored or nested IDs', () => {
  const rows = [
    { id: 'first', type: 0, date: '2026-10-01', name: 'Rent', isRecurring: 1, locationId: 'branch-1', location: { id: 'branch-1' } },
    { id: 'second', type: 0, date: '2026-10-02', name: 'Rent', isRecurring: 1, location: { id: 2 } },
    { id: 'one-off', type: 0, date: '2026-10-02', name: 'Fuel', isRecurring: 0, locationId: 'branch-1' }
  ];
  expect(periodRows(rows, moment('2026-10-01'), 'recurring', 'rent', 'branch-1').map(row => row.id)).toEqual(['first']);
  expect(periodRows(rows, moment('2026-10-01'), 'all', '', '2').map(row => row.id)).toEqual(['second']);
  expect(periodRows(rows, moment('2026-11-01'), 'all', '', 'branch-1')).toHaveLength(0);
  expect(periodRows(rows, moment('2026-10-01'), 'all', '', '')).toHaveLength(3);
});

test('formats the returned currency symbol and keeps its code and name visible', () => {
  expect(expenseMoney({ amount: '1234.50', currency: { id: 'usd', code: 'USD', name: 'Dollar USD', symbol: '$' } })).toEqual({
    amount: '$1,234.50', label: 'USD · Dollar USD', code: 'USD', name: 'Dollar USD', symbol: '$'
  });
  expect(expenseMoney({ amount: -12, currency: { code: 'USD', symbol: '$' } }).amount).toBe('-$12.00');
  expect(expenseMoney({ amount: 120, currency: { code: 'KHR', symbol: '៛' } }).amount).toBe('៛120.00');
});

test('missing currency metadata never implies USD and a code works without a symbol', () => {
  expect(expenseMoney({ amount: '450.00', currency: null })).toMatchObject({ amount: '450.00', label: 'Currency not supplied', code: '', symbol: '' });
  expect(expenseMoney({ amount: '450.00', currency: { code: 'EUR', symbol: null } })).toMatchObject({ amount: 'EUR 450.00', label: 'EUR' });
  expect(expenseMoney({ amount: 1, currency: { symbol: '$' } }).label).toBe('Currency symbol: $');
});

test('missing and invalid amounts are not presented as zero or nonfinite numbers', () => {
  [null, undefined, '', ' ', 'invalid', Infinity, true].forEach(amount => {
    expect(expenseMoney({ amount, currency: { code: 'USD', symbol: '$' } }).amount).toBe('Amount unavailable');
  });
  expect(expenseMoney({ amount: 0, currency: { code: 'USD', symbol: '$' } }).amount).toBe('$0.00');
});

test('filters expense type, selected entry month, recurrence and search together', () => {
  const rows = [
    { id: 'rent', type: 0, date: '2026-10-01', isRecurring: 1, name: 'Shop Rent' },
    { id: 'fuel', type: 0, date: '2026-10-02', isRecurring: 0, name: 'Fuel' },
    { id: 'income', type: 1, date: '2026-10-02', isRecurring: 1, name: 'Income' },
    { id: 'other', type: 0, date: '2026-11-01', isRecurring: 1, name: 'Rent' },
    { id: 'unknown', date: '2026-10-01', name: 'Unknown type' },
    { id: 'bad-date', type: 0, date: '2026-10-40', isRecurring: 1 }
  ];
  expect(periodRows(rows, moment('2026-10-01'), 'recurring', ' RENT ').map(row => row.id)).toEqual(['rent']);
  expect(periodRows(rows, moment('2026-10-01'), 'all', '').map(row => row.id)).toEqual(['rent', 'fuel']);
  expect(periodRows(rows, moment('2026-11-01'), 'recurring', '').map(row => row.id)).toEqual(['other']);
});

test('loads every page before exposing a complete snapshot', async () => {
  const requested = [];
  const rows = await loadSnapshot(async options => {
    requested.push(options);
    return options.offset ? page([{ id: 'b' }], 2) : page([{ id: 'a' }], 2);
  });
  expect(rows.map(row => row.id)).toEqual(['a', 'b']);
  expect(requested).toEqual([{ limit: 100, offset: 0 }, { limit: 100, offset: 1 }]);
});

test('refuses incomplete, changing, malformed or oversized lists', async () => {
  await expect(loadSnapshot(async () => page([], 2))).rejects.toThrow('incomplete');
  await expect(loadSnapshot(async () => page([], 2001))).rejects.toThrow('2,000');
  await expect(loadSnapshot(async () => ({ data: {} }))).rejects.toThrow('could not be read');
  await expect(loadSnapshot(async ({ offset }) => page([{ id: 'a' }], offset ? 3 : 2))).rejects.toThrow('changed');
  await expect(loadSnapshot(async () => page([{ id: 'a' }], 2))).rejects.toThrow('changed');
});

test('stale loads never return a previous scope snapshot', async () => {
  let active = true;
  expect(await loadSnapshot(async () => { active = false; return page([{ id: 'a' }], 1); }, () => active)).toBeNull();
});

test('only documented duplicate conflicts request confirmation', () => {
  const details = { duplicates: [{ id: 'existing' }], allowedActions: ['create', 'override'] };
  expect(duplicateDetails({ response: { data: { error: { code: 'DUPLICATE_EXPENSE', details } } } })).toBe(details);
  expect(duplicateDetails({ response: { data: { error: { code: 'EXPENSE_DUPLICATE_CHANGED', details } } } })).toBe(details);
  expect(duplicateDetails({ response: { data: { error: { code: 500, details } } } })).toBeNull();
  expect(() => entity({ data: {} })).toThrow('could not be confirmed');
});

test('attachment rules match supported formats and size', () => {
  expect(validAttachment({ name: 'invoice.PDF', size: 1024 })).toBe('');
  expect(validAttachment({ name: 'invoice.exe', size: 1024 })).toContain('Choose a PDF');
  expect(validAttachment({ name: 'scan.png', size: 10 * 1024 * 1024 + 1 })).toContain('10 MB');
});
