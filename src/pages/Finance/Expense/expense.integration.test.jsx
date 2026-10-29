import React from 'react';
import ReactDOM from 'react-dom';
import { act, findRenderedComponentWithType } from 'react-dom/test-utils';
import axios from 'axios';
import moment from 'moment';
import ExpensePage from './index';
import { ExpenseForm } from './ExpenseForm';
import ExpenseService from '@services/ExpenseService';

const httpTest = process.env.EXPENSE_SIM_URL ? test : test.skip;
const base = process.env.EXPENSE_SIM_URL;
let container, page, oldRoot, oldBase;
const waitFor = async predicate => {
  for (let n = 0; n < 100; n++) {
    if (predicate()) return;
    await act(async () => { await new Promise(resolve => setTimeout(resolve, 20)); });
  }
  throw new Error('Expense UI did not reach the expected state.');
};

beforeEach(async () => {
  if (!base) return;
  await axios.post(`${base}/_test/reset`);
  oldRoot = ExpenseService.root; oldBase = ExpenseService.baseUrl;
  ExpenseService.root = base; ExpenseService.baseUrl = `${base}/finance/expenses`;
  localStorage.setItem('ACCESS_TOKEN', JSON.stringify({ accessToken: 'fixture-token' }));
  container = document.createElement('div'); document.body.appendChild(container);
  await act(async () => { ReactDOM.render(<ExpensePage ref={value => { page = value; }} />, container); });
  await waitFor(() => !page.state.loading);
  act(() => page.setState({ month: moment('2026-10-01') }));
});
afterEach(() => {
  if (!base) return;
  act(() => ReactDOM.unmountComponentAtNode(container)); container.remove();
  ExpenseService.root = oldRoot; ExpenseService.baseUrl = oldBase;
  localStorage.clear();
});

httpTest('real authenticated list filters income, period and recurring records without claiming paid totals', async () => {
  expect(container.textContent).toContain('Fixture rent');
  expect(container.textContent).not.toContain('Fixture income');
  expect(container.textContent).not.toContain('Fixture fuel');
  expect(container.textContent).toContain('$450.00');
  expect(container.textContent).toContain('USD · US Dollar');
  expect(container.querySelector('tbody').textContent).toContain('Fixture branch');
  expect(container.querySelector('tbody').textContent).not.toContain('BR01');
  act(() => page.setState({ tab: 'all' }));
  expect(container.textContent).toContain('Fixture fuel');
  act(() => page.setState({ month: moment('2026-11-01') }));
  expect(container.textContent).toContain('No expense records match');
  const { data } = await axios.get(`${base}/_test/state`);
  expect(data.calls.find(call => call.path === '/finance/expenses').authenticated).toBe(true);
});

httpTest('form validates positive money and required fields before a real create and refresh', async () => {
  act(() => page.setState({ editor: {}, saveError: '' }));
  let form;
  await waitFor(() => { form = findRenderedComponentWithType(page, ExpenseForm); return !form.state.loading; });
  act(() => form.submit());
  await new Promise(resolve => setTimeout(resolve, 40));
  expect((await axios.get(`${base}/_test/state`)).data.calls.filter(call => call.method === 'POST')).toHaveLength(0);
  act(() => form.props.form.setFieldsValue({ name: 'New electricity', categoryName: 'Office Rent', locationId: 'branch-1', currencyId: 'usd', amount: 25, registerDate: moment('2026-10-20') }));
  await act(async () => { form.submit(); });
  await waitFor(() => !page.state.editor && !page.state.loading);
  const { data } = await axios.get(`${base}/_test/state`);
  const call = data.calls.find(call => call.method === 'POST');
  expect(call.body).toMatchObject({ name: 'New electricity', amount: 25, type: 0, isRecurring: 0, registerDate: '2026-10-20' });
  expect(call.body).not.toHaveProperty('paymentStatus');
  act(() => page.setState({ tab: 'all' }));
  expect(container.textContent).toContain('New electricity');
});

httpTest('duplicate conflict writes nothing until explicit selection and override retains record identity', async () => {
  act(() => page.setState({ editor: {} }));
  const payload = { name: 'Fixture rent', amount: 450, locationId: 'branch-1', currencyId: 'usd', registerDate: '2026-10-01', isRecurring: 1 };
  await act(async () => { await page.save(payload); });
  expect(page.state.duplicate.duplicates[0].id).toBe('fixture-rent');
  expect((await axios.get(`${base}/_test/state`)).data.rows).toHaveLength(3);
  await act(async () => { await page.save(page.state.duplicate.payload, { duplicateAction: 'override', duplicateExpenseId: 'fixture-rent' }); });
  await waitFor(() => !page.state.loading);
  expect((await axios.get(`${base}/_test/state`)).data.rows).toHaveLength(3);
  expect(page.state.duplicate).toBeNull();
});

httpTest('save and list errors remain visible and never claim success or a confirmed zero', async () => {
  act(() => page.setState({ editor: {} }));
  await act(async () => { await page.save({ name: 'Fail save', amount: 1, locationId: 'branch-1', currencyId: 'usd', registerDate: '2026-10-01' }); });
  expect(page.state.editor).not.toBeNull();
  expect(page.state.saveError).toContain('Unable to save');
  ExpenseService.baseUrl = `${base}/failure/finance/expenses`;
  await act(async () => { await page.load(); });
  expect(page.state.records).toHaveLength(0);
  expect(container.querySelector('[role="alert"]').textContent).toContain('temporarily unavailable');
  expect(container.textContent).not.toContain('Showing 0');
});

httpTest('loads expense records without calling a permission endpoint', async () => {
  const { data } = await axios.get(`${base}/_test/state`);
  expect(data.calls.some(call => call.path.includes('/privilege/'))).toBe(false);
  expect(data.calls.some(call => call.path === '/finance/expenses')).toBe(true);
});

httpTest('detail and editing use the stored branch, currency and recurrence without recording a payment', async () => {
  await act(async () => { await page.openDetail({ id: 'fixture-rent' }); });
  expect(page.state.detail.currencyId).toBe('usd');
  expect(document.body.textContent).toContain('This record does not confirm a payment');
  act(() => page.setState({ editor: page.state.detail, detail: null }));
  await act(async () => { await page.save({ name: 'Updated rent', amount: 470, currencyId: 'usd', locationId: 'branch-1', isRecurring: 1, recurringType: 3, recurringDate: '2026-11-01', registerDate: '2026-10-01' }); });
  await waitFor(() => !page.state.loading);
  const { data } = await axios.get(`${base}/_test/state`);
  expect(data.rows.find(row => row.id === 'fixture-rent').amount).toBe(470);
  expect(data.calls.find(call => call.method === 'PUT').body).not.toHaveProperty('paid');
});
