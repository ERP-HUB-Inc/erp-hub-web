import React from 'react';
import ReactDOM from 'react-dom';
import { act, Simulate } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';
import ExpenseCategoryPage from './index';
import ExpenseCategoryService from '@services/ExpenseCategoryService';

// Local presentation and state checks; HTTP behavior has separate simulation tests.
jest.mock('@services/ExpenseCategoryService', () => ({ get: jest.fn(), archive: jest.fn() }));
const record = { id: 'category-1', name: 'Admin Fee', namekh: 'ថ្លៃរដ្ឋបាល' };
let container, page;
beforeEach(async () => {
  jest.clearAllMocks();
  ExpenseCategoryService.get.mockResolvedValue({ data: { data: [record], pagination: { total: 1 } } });
  container = document.createElement('div'); document.body.appendChild(container);
  await act(async () => { ReactDOM.render(<MemoryRouter><ExpenseCategoryPage ref={value => { page = value; }} /></MemoryRouter>, container); });
});
afterEach(() => { act(() => { ReactDOM.unmountComponentAtNode(container); }); container.remove(); });

test('delete opens confirmation and cancelling makes no delete request', () => {
  act(() => { Simulate.click(container.querySelector('[aria-label="Delete Admin Fee"]')); });
  expect(document.body.textContent).toContain('Delete Expense Category?');
  expect(ExpenseCategoryService.archive).not.toHaveBeenCalled();
  act(() => page.closeDelete());
  expect(page.state.deleteRecord).toBeNull();
  expect(page.state.records).toEqual([record]);
});

test('confirmed delete sends the selected ID and refreshes the first page', async () => {
  ExpenseCategoryService.archive.mockResolvedValue({ data: { affected: 1 } });
  ExpenseCategoryService.get.mockResolvedValue({ data: { data: [], pagination: { total: 0 } } });
  act(() => page.openDelete(record));
  await act(async () => { await page.remove(); });
  expect(ExpenseCategoryService.archive).toHaveBeenCalledWith(record.id);
  expect(page.state.deleteRecord).toBeNull();
  expect(page.state.current).toBe(1);
  expect(page.state.records).toEqual([]);
});

test.each([
  [{ data: { affected: 0 } }, 'The expense category was not deleted. Refresh and try again.'],
  [null, 'This category is in use.']
])('failed deletion keeps confirmation and record available', async (response, message) => {
  if (response) ExpenseCategoryService.archive.mockResolvedValue(response);
  else ExpenseCategoryService.archive.mockRejectedValue({ response: { data: { error: { message } } } });
  act(() => page.openDelete(record));
  await act(async () => { await page.remove(); });
  expect(page.state.deleteRecord).toEqual(record);
  expect(page.state.records).toEqual([record]);
  expect(document.body.textContent).toContain(message);
  expect(page.state.deleting).toBe(false);
});
