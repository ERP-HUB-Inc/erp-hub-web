import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import ItemTypePage from './index';
import ItemTypeService from '@services/ItemTypeService';
import PrivilegeService from '../../../../app/modules/pos/services/settings/PrivilegeService';

const httpTest = process.env.ITEM_TYPES_SIM_URL ? test : test.skip;
const origin = process.env.ITEM_TYPES_SIM_URL;
const originalCatalog = ItemTypeService.baseUrl;
const originalPrivilege = PrivilegeService.baseUrl;
let container, page;
const draft = { name: 'Custom & Physical', description: '', enableInventoryTracking: false, isSellable: true, productOption: 0, serialType: 1, sortOrder: 4, status: 1 };

async function settle(predicate) {
  for (let i = 0; i < 150; i++) {
    if (predicate()) return;
    await act(async () => { await new Promise(resolve => setTimeout(resolve, 20)); });
  }
  throw new Error('Timed out waiting for Item Type UI');
}
async function mount() {
  await act(async () => { ReactDOM.render(<MemoryRouter><ItemTypePage ref={value => { page = value; }} /></MemoryRouter>, container); });
  await settle(() => page.state.access !== 'loading' && !page.state.loading);
}

beforeEach(async () => {
  if (!origin) return;
  await axios.post(`${origin}/_test/reset`);
  ItemTypeService.baseUrl = `${origin}/item-types`;
  PrivilegeService.baseUrl = `${origin}/privilege`;
  localStorage.setItem('ACCESS_TOKEN', JSON.stringify({ accessToken: 'synthetic-fixture-token', clientId: 'fixture-client' }));
  container = document.createElement('div'); document.body.appendChild(container);
});
afterEach(() => {
  if (container) { act(() => { ReactDOM.unmountComponentAtNode(container); }); container.remove(); container = null; }
  ItemTypeService.baseUrl = originalCatalog; PrivilegeService.baseUrl = originalPrivilege;
  localStorage.removeItem('ACCESS_TOKEN');
});

httpTest('mounted page creates, loads UUID detail, updates with PUT, then permanently deletes', async () => {
  await mount();
  expect(container.textContent).toContain('Physical Product');
  await act(async () => { await page.openEditor(); });
  await act(async () => { await page.save(draft); });
  const row = page.state.records.find(record => record.name === draft.name);
  expect(row.id).toMatch(/^[0-9a-f-]{36}$/);
  await act(async () => { await page.openEditor(row); });
  expect(page.state.editor.id).toBe(row.id);
  await act(async () => { await page.save({ ...draft, name: 'Updated custom item', status: 0 }); });
  expect(page.state.records.find(record => record.id === row.id).status).toBe(0);
  act(() => page.setState({ deleteRecord: row }));
  await act(async () => { await page.remove(); });
  expect(page.state.records.some(record => record.id === row.id)).toBe(false);
  const { data } = await axios.get(`${origin}/_test/state`);
  const create = data.calls.find(call => call.method === 'POST' && call.path === '/item-types');
  expect(create.body.clientId).toBe('fixture-client');
  expect(create.body.isSystem).toBe(false);
  expect(create.body).not.toHaveProperty('code');
  expect(create.body.enableInventoryTracking).toBe(false);
  const update = data.calls.find(call => call.method === 'PUT');
  expect(update.path).toBe(`/item-types/${row.id}`);
  expect(update.body).not.toHaveProperty('id');
  expect(update.body).not.toHaveProperty('clientId');
  expect(data.calls.filter(call => call.path.startsWith('/item-types')).every(call => call.hasAuthorization)).toBe(true);
});

httpTest('search text stays encoded as one parameter and page changes preserve search/sort', async () => {
  await mount();
  await act(async () => { await page.openEditor(); });
  await act(async () => { await page.save(draft); });
  act(() => page.handleSearch({ target: { value: 'Custom & Physical' } }));
  await settle(() => page.state.records.length === 1 && page.state.records[0].name === draft.name && !page.state.loading);
  act(() => page.handleTableChange({ current: 2, pageSize: 20 }, {}, { field: 'name', order: 'descend' }));
  await settle(() => !page.state.loading);
  const { data } = await axios.get(`${origin}/_test/state`);
  const last = data.calls.filter(call => call.path === '/item-types' && call.method === 'GET').pop();
  expect(last.query).toMatchObject({ search: 'Custom & Physical', offset: '20', limit: '20', sortField: 'name', sortOrder: 'DESC' });
});

httpTest('permission denial prevents list fetching even with a direct URL', async () => {
  PrivilegeService.baseUrl = `${origin}/denied/privilege`;
  await mount();
  expect(page.state.access).toBe('denied');
  const { data } = await axios.get(`${origin}/_test/state`);
  expect(data.calls.some(call => call.path === '/item-types')).toBe(false);
});

httpTest('HTTP errors preserve edits, missing update data is not success, and retry recovers the list', async () => {
  await mount();
  await act(async () => { await page.openEditor(page.state.records[0]); });
  ItemTypeService.baseUrl = `${origin}/failure/item-types`;
  await act(async () => { await page.save(draft); });
  expect(page.state.editor).not.toBeNull();
  expect(page.state.saveError).toBe('Item types temporarily unavailable.');
  ItemTypeService.baseUrl = `${origin}/missing/item-types`;
  await act(async () => { await page.save(draft); });
  expect(page.state.editor).not.toBeNull();
  expect(page.state.saveError).toContain('Refresh the list');
  ItemTypeService.baseUrl = `${origin}/failure/item-types`;
  await act(async () => { await page.load(); });
  expect(page.state.loadError).toBe('Item types temporarily unavailable.');
  ItemTypeService.baseUrl = `${origin}/item-types`;
  await act(async () => { await page.load(); });
  expect(page.state.loadError).toBe('');
  expect(page.state.records.length).toBeGreaterThan(0);
});

httpTest('defaults are explicitly requested and zero affected deletes retain confirmation', async () => {
  await mount();
  await act(async () => { await page.initialize(); });
  act(() => page.setState({ deleteRecord: { id: 'missing-uuid', name: 'Missing', isSystem: false } }));
  await act(async () => { await page.remove(); });
  expect(page.state.deleteRecord.id).toBe('missing-uuid');
  expect(page.state.deleteError).toContain('No item type was deleted');
  const { data } = await axios.get(`${origin}/_test/state`);
  expect(data.calls.filter(call => call.path === '/item-types/defaults/all')).toHaveLength(1);
});
