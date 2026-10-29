import React from 'react';
import ReactDOM from 'react-dom';
import { act, Simulate } from 'react-dom/test-utils';
import moment from 'moment';
import ExpensePage from './index';

// Presentation only. HTTP behavior is exercised separately by the simulation suite.
let container, page;
beforeEach(() => {
  jest.spyOn(ExpensePage.prototype, 'componentDidMount').mockImplementation(() => {});
  container = document.createElement('div'); document.body.appendChild(container);
  act(() => { ReactDOM.render(<ExpensePage ref={value => { page = value; }} />, container); });
});
afterEach(() => { act(() => { ReactDOM.unmountComponentAtNode(container); }); container.remove(); jest.restoreAllMocks(); });

test('expense content and creation actions are available without a permission check', () => {
  expect(container.textContent).toContain('Record Expense');
  expect(container.textContent).toContain('Add Recurring Bill');
  expect(container.querySelector('.expense-tabs')).not.toBeNull();
  expect(container.textContent).not.toContain('You need permission');
  const record = Array.from(container.querySelectorAll('button')).find(button => button.textContent.includes('Record Expense'));
  expect(record.disabled).toBe(false);
});

test('main content contains five views, four equal-grid cards and seven table columns', () => {
  act(() => page.setState({ month: moment('2026-10-01'), records: [{ id: 'rent', name: 'Shop rent', type: 0, amount: '120.00', date: '2026-10-01', isRecurring: 1 }] }));
  expect(container.querySelectorAll('.expense-tabs button')).toHaveLength(5);
  expect(container.querySelectorAll('.expense-metric')).toHaveLength(4);
  expect(container.querySelectorAll('thead th')).toHaveLength(7);
  expect(container.textContent).toContain('Shop rent');
  expect(container.textContent).toContain('120.00');
  expect(container.textContent).toContain('Currency not supplied');
  expect(container.textContent).not.toMatch(/Paid Oct|Active Engine|10% WHT|BRANCHES ONLINE/);
  expect(container.textContent).toContain('Reconciled bill count unavailable');
  expect(container.querySelector('.expense-wht').textContent).toContain('Not calculated');
  expect(container.querySelector('.expense-timeline').textContent).toContain('Total Next 30D: Unavailable');
});

test('expense amount uses backend currency metadata and distinguishes currencies sharing a symbol', () => {
  const record = { type: 0, amount: '450.00', date: '2026-10-01', isRecurring: 1 };
  act(() => page.setState({ month: moment('2026-10-01'), records: [
    { ...record, id: 'usd-rent', name: 'US rent', currencyId: 'usd', currency: { id: 'usd', code: 'USD', name: 'Dollar USD', symbol: '$' } },
    { ...record, id: 'cad-rent', name: 'Canadian rent', currencyId: 'cad', currency: { id: 'cad', code: 'CAD', name: 'Canadian Dollar', symbol: '$' } }
  ] }));
  const amounts = Array.from(container.querySelectorAll('tbody tr')).map(row => row.querySelectorAll('td')[3].textContent);
  expect(amounts).toEqual(['$450.00USD · Dollar USD', '$450.00CAD · Canadian Dollar']);
  expect(container.querySelector('tbody').textContent).not.toContain('Currency not supplied');
});

test('shows branch names without codes, and branch changes filter rows and reset pagination', () => {
  const record = { type: 0, amount: '450.00', date: '2026-10-01', isRecurring: 1 };
  act(() => page.setState({ month: moment('2026-10-01'), records: [
    { ...record, id: 'rent-1', name: 'First rent', locationId: 'branch-1', location: { id: 'branch-1', name: 'Branch name', code: 'BR01' } },
    { ...record, id: 'rent-2', name: 'Second rent', locationId: 'branch-2', location: { id: 'branch-2', name: 'Other shop', code: 'BR02' } }
  ] }));
  const branches = Array.from(container.querySelectorAll('tbody tr')).map(row => row.querySelectorAll('td')[2].textContent);
  expect(branches).toEqual(['Branch name', 'Other shop']);
  expect(container.textContent).not.toContain('BR01');
  expect(container.textContent).not.toContain('BR02');
  expect(container.textContent).toContain('All returned branches (2)');
  act(() => page.setState({ current: 3 }));
  act(() => { page.changeLocation('branch-1'); });
  expect(page.state.current).toBe(1);
  expect(container.querySelectorAll('tbody tr')).toHaveLength(1);
  expect(container.querySelector('tbody').textContent).toContain('First rent');
  expect(container.querySelector('tbody').textContent).not.toContain('Second rent');
  act(() => { page.changeLocation(''); });
  expect(container.querySelectorAll('tbody tr')).toHaveLength(2);
});

test('unavailable locations remain visible without assigning a branch', () => {
  act(() => page.setState({ month: moment('2026-10-01'), records: [
    { id: 'unknown', name: 'Unlinked expense', type: 0, amount: '10.00', date: '2026-10-01', isRecurring: 1, locationId: 'deleted', location: null }
  ] }));
  expect(container.querySelector('tbody').textContent).toContain('Location unavailable');
  expect(container.querySelector('tbody').textContent).toContain('Unlinked expense');
});

test('period navigation changes the reporting month and resets pagination', () => {
  act(() => page.setState({ month: moment('2026-10-01'), current: 3 }));
  const next = Array.from(container.querySelectorAll('button')).find(button => button.textContent.includes('Next Cycle'));
  act(() => Simulate.click(next));
  expect(page.state.month.format('YYYY-MM')).toBe('2026-11');
  expect(page.state.current).toBe(1);
  expect(container.textContent).toContain('Records entered in November 2026');
});

test('load failures expose retry and never claim an empty confirmed result', () => {
  act(() => page.setState({ loadError: 'Expenses are temporarily unavailable.' }));
  expect(container.querySelector('[role="alert"]').textContent).toContain('Expenses are temporarily unavailable.');
  expect(container.textContent).toContain('Retry');
  expect(container.textContent).not.toContain('Showing 0');
  expect(container.querySelector('[aria-label="Export filtered expense records as CSV"]').disabled).toBe(true);
});

test('unsupported views explain unavailable records without inventing counts', () => {
  const approvals = Array.from(container.querySelectorAll('.expense-tabs button')).find(button => button.textContent.includes('Needs Approval'));
  act(() => Simulate.click(approvals));
  expect(container.textContent).toContain('Expense approval records are not available yet.');
  expect(container.querySelector('table')).toBeNull();
});
