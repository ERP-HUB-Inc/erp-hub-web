import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';
import SalesTargetPage from './index';
import Service from '@services/SalesTargetService';
import LocationService from '@services/LocationService';

// Local UI state tests; no real API writes.
jest.mock('@services/SalesTargetService', () => ({ list: jest.fn(), getById: jest.fn(), save: jest.fn(), disable: jest.fn() }));
jest.mock('@services/LocationService', () => ({ get: jest.fn() }));
const record = { id: 123, locationId: '1', targetType: 'MONTHLY', year: 2026, month: 10, quarter: 4, targetRevenue: 15000, status: 'ACTIVE' };
const list = (data, total = data.length) => ({ data: { data, pagination: { total } } });
let container, page;
beforeEach(async () => {
  jest.resetAllMocks();
  Service.list.mockResolvedValue(list([record]));
  LocationService.get.mockResolvedValue(list([{ id: '1', name: 'Main branch' }]));
  container = document.createElement('div'); document.body.appendChild(container);
  await act(async () => { ReactDOM.render(<MemoryRouter><SalesTargetPage ref={value => { page = value; }} /></MemoryRouter>, container); });
});
afterEach(() => { act(() => { ReactDOM.unmountComponentAtNode(container); }); container.remove(); });

test('renders branch, target type and period by default', () => {
  expect(container.textContent).toContain('Main branch');
  expect(container.textContent).toContain('October 2026');
  expect(Service.list).toHaveBeenCalledWith({ limit: 20, offset: 0 });
});

test('filters reset pagination, and later pages preserve all filters', async () => {
  await act(async () => { page.filter('locationId', '1'); });
  await act(async () => { page.filter('targetType', 'QUARTERLY'); });
  await act(async () => { page.filter('year', 2026); });
  await act(async () => { page.filter('status', 'INACTIVE'); });
  await act(async () => { page.changePage({ current: 2, pageSize: 20 }); });
  expect(Service.list).toHaveBeenLastCalledWith({ locationId: '1', targetType: 'QUARTERLY', year: 2026, status: 'INACTIVE', limit: 20, offset: 20 });
  await act(async () => { page.changePage({ current: 2, pageSize: 50 }); });
  expect(Service.list.mock.calls[Service.list.mock.calls.length - 1][0].offset).toBe(0);
  await act(async () => { page.filter('year', ''); });
  expect(Service.list.mock.calls[Service.list.mock.calls.length - 1][0].year).toBeUndefined();
});

test('new target saves and detail is loaded before editing a numeric ID', async () => {
  await act(async () => { await page.openEditor(); });
  Service.save.mockResolvedValue({ data: { data: record } });
  await act(async () => { await page.save(record); });
  expect(page.state.editor).toBeNull();
  Service.getById.mockResolvedValue({ data: { data: { ...record, status: 'INACTIVE' } } });
  await act(async () => { await page.openEditor(record); });
  expect(Service.getById).toHaveBeenCalledWith(123);
  expect(page.state.editor.status).toBe('INACTIVE');
  await act(async () => { await page.save({ ...record, status: 'INACTIVE' }); });
  expect(Service.save).toHaveBeenLastCalledWith({ ...record, status: 'INACTIVE' }, 123);
});

test('detail and save failures remain visible and keep the form open', async () => {
  Service.getById.mockRejectedValue(new Error('Target not found.'));
  await act(async () => { await page.openEditor(record); });
  expect(page.state.editor).toBeNull(); expect(container.textContent).toContain('Target not found.');
  await act(async () => { await page.openEditor(); });
  Service.save.mockRejectedValue(new Error('Save failed.'));
  await act(async () => { await page.save(record); });
  expect(page.state.editor).toEqual({}); expect(document.body.textContent).toContain('Save failed.');
});

test('bulk disable requires confirmation and retains records as inactive', async () => {
  act(() => page.openDisable([123, 124]));
  expect(Service.disable).not.toHaveBeenCalled();
  expect(document.body.textContent).toContain('records will be retained as inactive');
  Service.disable.mockResolvedValue({ data: { success: true } });
  Service.list.mockResolvedValue(list([{ ...record, status: 'INACTIVE' }]));
  await act(async () => { await page.disable(); });
  expect(Service.disable).toHaveBeenCalledWith([123, 124]);
  expect(page.state.disableIds).toEqual([]);
  expect(page.state.records[0].status).toBe('INACTIVE');
});

test('failed disable keeps confirmation and records available for review', async () => {
  act(() => page.openDisable([123]));
  Service.disable.mockResolvedValue({ data: { success: false } });
  await act(async () => { await page.disable(); });
  expect(page.state.disableIds).toEqual([123]);
  expect(page.state.records).toHaveLength(1);
  expect(document.body.textContent).toContain('Disabling the sales targets could not be confirmed');
});

test('branch loading errors can retry and prevent opening a form', async () => {
  LocationService.get.mockRejectedValueOnce(new Error('Branches unavailable.'));
  await act(async () => { await page.loadLocations(); });
  await act(async () => { await page.openEditor(); });
  expect(page.state.editor).toBeNull(); expect(container.textContent).toContain('Branches unavailable.');
  await act(async () => { await page.loadLocations(); });
  await act(async () => { await page.openEditor(); });
  expect(page.state.editor).toEqual({});
});

test('paginated branch choices are loaded completely', async () => {
  LocationService.get.mockResolvedValueOnce(list([{ id: '1', name: 'Main' }], 2)).mockResolvedValueOnce(list([{ id: '2', name: 'Second' }], 2));
  await act(async () => { await page.loadLocations(); });
  expect(page.state.locations).toHaveLength(2);
  expect(LocationService.get).toHaveBeenLastCalledWith({ limit: 100, offset: 1 });
});

test('target lists can load without branch filtering, including before branches are available', async () => {
  Service.list.mockClear();
  await act(async () => { page.filter('locationId', 'foreign'); });
  expect(Service.list).toHaveBeenCalledWith({ locationId: 'foreign', limit: 20, offset: 0 });
  LocationService.get.mockResolvedValueOnce(list([]));
  await act(async () => { await page.loadLocations(); });
  expect(Service.list).toHaveBeenCalledTimes(1);
  expect(page.state.loading).toBe(false);
});

test('closing a detail request prevents its late response from reopening the form', async () => {
  let finish;
  Service.getById.mockImplementationOnce(() => new Promise(resolve => { finish = resolve; }));
  act(() => { page.openEditor(record); });
  act(() => page.closeEditor());
  await act(async () => { finish({ data: { data: record } }); });
  expect(page.state.editor).toBeNull();
});
