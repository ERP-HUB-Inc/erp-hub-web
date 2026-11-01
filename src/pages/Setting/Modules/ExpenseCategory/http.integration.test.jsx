import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import ExpenseCategoryPage from './index';
import ExpenseCategoryService from '@services/ExpenseCategoryService';
import { ExpenseCategoryForm } from './ExpenseCategoryForm';
import { findRenderedComponentWithType } from 'react-dom/test-utils';

const origin = process.env.EXPENSE_CATEGORIES_SIM_URL;
const httpTest = origin ? test : test.skip;
const originalBase = ExpenseCategoryService.baseUrl;
let container, page, root;
async function settle(predicate) {
  for (let i = 0; i < 100; i++) {
    if (predicate()) return;
    await act(async () => { await new Promise(resolve => setTimeout(resolve, 20)); });
  }
  throw new Error('Timed out waiting for expense categories.');
}
async function mount() {
  await act(async () => { root = ReactDOM.render(<MemoryRouter><ExpenseCategoryPage ref={value => { page = value; }} /></MemoryRouter>, container); });
  await settle(() => !page.state.loading);
}
beforeEach(async () => {
  if (!origin) return;
  await axios.post(`${origin}/_test/reset`);
  ExpenseCategoryService.baseUrl = `${origin}/expense/categories`;
  localStorage.setItem('ACCESS_TOKEN', JSON.stringify({ accessToken: 'synthetic-fixture-token' }));
  container = document.createElement('div'); document.body.appendChild(container);
  jest.spyOn(window, 'scrollTo').mockImplementation(() => {});
});
afterEach(() => {
  if (container) { act(() => { ReactDOM.unmountComponentAtNode(container); }); container.remove(); container = null; }
  ExpenseCategoryService.baseUrl = originalBase; localStorage.removeItem('ACCESS_TOKEN'); jest.restoreAllMocks();
});
async function submit(values) {
  const form = findRenderedComponentWithType(root, ExpenseCategoryForm);
  act(() => { form.props.form.setFieldsValue(values); form.submit(); });
  await settle(() => !page.state.saving);
  await settle(() => !page.state.loading);
}

httpTest('renders the list, creates through the form, loads detail and updates only name fields', async () => {
  await mount(); expect(container.textContent).toContain('Admin Fee');
  act(() => page.openEditor());
  await submit({ name: '  Office & Supplies  ', namekh: '  សម្ភារៈ  ' });
  const row = page.state.records.find(record => record.name === 'Office & Supplies');
  expect(row).toBeDefined();
  await act(async () => page.openEditor(row));
  expect(page.state.editor.namekh).toBe('សម្ភារៈ');
  await submit({ name: 'Updated supplies', namekh: '' });
  expect(page.state.records.find(record => record.id === row.id).namekh).toBe('');
  const { data } = await axios.get(`${origin}/_test/state`);
  expect(data.calls.find(call => call.method === 'POST').body).toEqual({ name: 'Office & Supplies', namekh: 'សម្ភារៈ' });
  expect(data.calls.find(call => call.method === 'PUT')).toMatchObject({ path: `/expense/categories/${row.id}`, body: { name: 'Updated supplies', namekh: '' } });
  expect(data.calls.every(call => call.hasAuthorization)).toBe(true);
});

httpTest('search and pagination preserve the encoded search parameter', async () => {
  await mount();
  act(() => page.search({ target: { value: 'Admin & Fee' } }));
  await settle(() => page.state.records.length === 0 && !page.state.loading);
  expect(container.textContent).toContain('No expense categories found');
  act(() => page.changePage({ current: 2, pageSize: 20 }));
  await settle(() => !page.state.loading);
  const { data } = await axios.get(`${origin}/_test/state`);
  expect(data.calls.filter(call => call.method === 'GET').pop().query).toEqual({ search: 'Admin & Fee', limit: '20', offset: '20' });
});

httpTest('duplicate conflict preserves entered values and failed loading offers retry', async () => {
  await mount(); act(() => page.openEditor());
  await submit({ name: 'Admin Fee', namekh: 'ថ្លៃរដ្ឋបាល' });
  expect(page.state.editor).not.toBeNull();
  expect(document.body.textContent).toContain('An expense category with this name already exists.');
  expect(findRenderedComponentWithType(root, ExpenseCategoryForm).props.form.getFieldValue('namekh')).toBe('ថ្លៃរដ្ឋបាល');
  act(() => page.closeEditor());
  ExpenseCategoryService.baseUrl = `${origin}/failure/expense/categories`;
  await act(async () => page.load());
  expect(container.textContent).toContain('Expense categories temporarily unavailable.');
  expect(page.state.records).toEqual([]);
  ExpenseCategoryService.baseUrl = `${origin}/expense/categories`;
  await act(async () => page.load());
  expect(container.textContent).toContain('Admin Fee');
});

httpTest('delete requires confirmation, keeps the record on error and refreshes after success', async () => {
  await mount();
  const row = page.state.records[0];
  act(() => page.openDelete(row));
  expect(document.body.textContent).toContain('Delete Expense Category?');
  let result = await axios.get(`${origin}/_test/state`);
  expect(result.data.calls.some(call => call.method === 'DELETE')).toBe(false);
  act(() => page.closeDelete());
  expect(page.state.records).toHaveLength(1);
  act(() => page.openDelete(row));
  ExpenseCategoryService.baseUrl = `${origin}/failure/expense/categories`;
  await act(async () => page.remove());
  expect(page.state.deleteRecord.id).toBe(row.id);
  expect(page.state.records).toHaveLength(1);
  expect(document.body.textContent).toContain('Expense categories temporarily unavailable.');
  ExpenseCategoryService.baseUrl = `${origin}/expense/categories`;
  await act(async () => page.remove());
  expect(page.state.deleteRecord).toBeNull();
  expect(page.state.records).toHaveLength(0);
  result = await axios.get(`${origin}/_test/state`);
  expect(result.data.calls.find(call => call.method === 'DELETE' && call.path === `/expense/categories/${row.id}`)).toMatchObject({ hasAuthorization: true });
});
