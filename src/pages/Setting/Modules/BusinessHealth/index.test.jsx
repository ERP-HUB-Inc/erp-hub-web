import React from 'react';
import ReactDOM from 'react-dom';
import { act, findRenderedComponentWithType, Simulate } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';
import DecoratedPage, { BusinessHealthPage } from './index';
import Service from '@services/BusinessHealthPolicyService';
import { readPolicy, validThresholds } from './model';

// Local UI and policy state tests; transport is not exercised here.
jest.mock('@services/BusinessHealthPolicyService', () => ({ get: jest.fn(), add: jest.fn(), update: jest.fn(), disable: jest.fn() }));
let container, page;
const policy = (overrides = {}) => ({ version: '1', healthyCoveragePercent: 100, criticalBelowCoveragePercent: 50, enabled: true, ...overrides });
const response = value => ({ data: { data: value } });
const failure = (status, code, message) => ({ response: { status, data: { error: { code, message } } } });
beforeEach(() => {
  jest.resetAllMocks();
  jest.spyOn(window, 'scrollTo').mockImplementation(() => {});
  localStorage.setItem('ACCESS_TOKEN', JSON.stringify({ currentUser: { isFullAccess: 1 } }));
  container = document.createElement('div'); document.body.appendChild(container);
});
afterEach(() => {
  act(() => { ReactDOM.unmountComponentAtNode(container); }); container.remove();
  localStorage.removeItem('ACCESS_TOKEN'); jest.restoreAllMocks();
});
async function mount(value = policy()) {
  Service.get.mockResolvedValueOnce(response(value));
  let root;
  await act(async () => { root = ReactDOM.render(<MemoryRouter><DecoratedPage /></MemoryRouter>, container); });
  page = findRenderedComponentWithType(root, BusinessHealthPage);
}
async function submit(values) {
  await act(async () => { if (values) page.props.form.setFieldsValue(values); page.submit(); });
}

test('empty policy creates with only numeric thresholds and stores the new version for subsequent updates', async () => {
  await mount(null);
  expect(container.textContent).toContain('Not configured');
  Service.add.mockResolvedValue(response(policy({ version: 'new-create' })));
  await submit();
  expect(Service.add).toHaveBeenCalledWith({ healthyCoveragePercent: 100, criticalBelowCoveragePercent: 50 });
  expect(page.state.policy.version).toBe('new-create');
  Service.update.mockResolvedValue(response(policy({ version: 'new-update', healthyCoveragePercent: 110, criticalBelowCoveragePercent: 60 })));
  await submit({ healthyCoveragePercent: 110, criticalBelowCoveragePercent: 60 });
  expect(Service.update).toHaveBeenCalledWith({ healthyCoveragePercent: 110, criticalBelowCoveragePercent: 60, expectedVersion: 'new-create' });
  expect(page.state.policy.version).toBe('new-update');
});

test.each([
  [99, 50], [100, -1], [100, 100], [100, 101], [Infinity, 50], [100, Infinity], [null, 50], [100, null]
])('invalid thresholds prevent a write: %p, %p', async (healthyCoveragePercent, criticalBelowCoveragePercent) => {
  await mount();
  await submit({ healthyCoveragePercent, criticalBelowCoveragePercent });
  expect(Service.add).not.toHaveBeenCalled();
  expect(Service.update).not.toHaveBeenCalled();
});

test('zero critical coverage is valid and numeric strings are not accepted by the model', () => {
  expect(validThresholds(100, 0)).toBe(true);
  expect(validThresholds('100', 50)).toBe(false);
  expect(validThresholds(100, '50')).toBe(false);
  expect(() => readPolicy(response({ ...policy(), version: '' }))).toThrow();
  expect(() => readPolicy(response(null), false)).toThrow();
});

test('read-only users can load thresholds but cannot create, update or disable', async () => {
  localStorage.setItem('ACCESS_TOKEN', JSON.stringify({ currentUser: { isFullAccess: 0 } }));
  await mount();
  expect(page.props.form.getFieldValue('healthyCoveragePercent')).toBe(100);
  expect(container.querySelector('[type="submit"]')).toBeNull();
  await submit();
  await act(async () => { await page.disable(); });
  expect(Service.update).not.toHaveBeenCalled(); expect(Service.disable).not.toHaveBeenCalled();
});

test('disable requires confirmation, retains returned thresholds and re-enables with the new version', async () => {
  await mount();
  const disable = Array.from(container.querySelectorAll('button')).find(button => button.textContent === 'Disable Policy');
  act(() => { Simulate.click(disable); });
  expect(document.body.textContent).toContain('Disable Business Health Policy?');
  expect(Service.disable).not.toHaveBeenCalled();
  Service.disable.mockResolvedValue(response(policy({ enabled: false, version: 'disabled-v2' })));
  await act(async () => { await page.disable(); });
  expect(Service.disable).toHaveBeenCalledWith('1');
  expect(page.state.policy.enabled).toBe(false);
  expect(page.props.form.getFieldValue('criticalBelowCoveragePercent')).toBe(50);
  Service.update.mockResolvedValue(response(policy({ version: 'enabled-v3' })));
  await submit();
  expect(Service.update).toHaveBeenCalledWith({ healthyCoveragePercent: 100, criticalBelowCoveragePercent: 50, expectedVersion: 'disabled-v2' });
  expect(page.state.policy.version).toBe('enabled-v3');
});

test.each(['POLICY_VERSION_CONFLICT', 'POLICY_ALREADY_EXISTS'])('%s reloads latest policy and requires review before another write', async code => {
  await mount(code === 'POLICY_ALREADY_EXISTS' ? null : policy());
  const write = code === 'POLICY_ALREADY_EXISTS' ? Service.add : Service.update;
  write.mockRejectedValueOnce(failure(409, code, 'Policy changed.'));
  Service.get.mockResolvedValueOnce(response(policy({ version: 'latest', healthyCoveragePercent: 120 })));
  await submit({ healthyCoveragePercent: 110 });
  expect(write).toHaveBeenCalledTimes(1);
  expect(page.state.policy.version).toBe('latest');
  expect(page.props.form.getFieldValue('healthyCoveragePercent')).toBe(120);
  expect(container.textContent).toContain('Review the loaded thresholds');
  Service.update.mockResolvedValueOnce(response(policy({ version: 'after-review', healthyCoveragePercent: 120 })));
  await submit();
  expect(Service.update).toHaveBeenLastCalledWith({ healthyCoveragePercent: 120, criticalBelowCoveragePercent: 50, expectedVersion: 'latest' });
});

test('conflict reload failure blocks saving until a successful reload', async () => {
  await mount();
  Service.update.mockRejectedValueOnce(failure(409, 'POLICY_VERSION_CONFLICT', 'Changed.'));
  Service.get.mockRejectedValueOnce(new Error('Reload failed.'));
  await submit();
  expect(page.state.loaded).toBe(false);
  await submit(); expect(Service.update).toHaveBeenCalledTimes(1);
  Service.get.mockResolvedValueOnce(response(policy({ version: 'reloaded' })));
  await act(async () => { await page.load(); });
  expect(page.state.loaded).toBe(true); expect(page.state.policy.version).toBe('reloaded');
});

test('server 403 removes write access without discarding the entered thresholds', async () => {
  await mount();
  Service.update.mockRejectedValueOnce(failure(403, 'FORBIDDEN', 'Full business access required.'));
  await submit({ healthyCoveragePercent: 130 });
  expect(container.textContent).toContain('Full business access required.');
  expect(page.canWrite()).toBe(false);
  expect(page.props.form.getFieldValue('healthyCoveragePercent')).toBe(130);
  await submit(); expect(Service.update).toHaveBeenCalledTimes(1);
});

test('400 preserves draft input and shows the API message', async () => {
  await mount();
  Service.update.mockRejectedValueOnce(failure(400, 'INVALID', 'Threshold rejected.'));
  await submit({ healthyCoveragePercent: 105 });
  expect(container.textContent).toContain('Threshold rejected.');
  expect(page.props.form.getFieldValue('healthyCoveragePercent')).toBe(105);
  expect(page.state.policy.version).toBe('1');
});

test('failed initial reads do not permit writes', async () => {
  Service.get.mockRejectedValueOnce(failure(403, 'FORBIDDEN', 'Business access denied.'));
  await mount();
  expect(container.textContent).toContain('Business access denied.');
  await submit(); expect(Service.update).not.toHaveBeenCalled(); expect(Service.add).not.toHaveBeenCalled();
});

test('a disable conflict reloads the latest version and never repeats deletion automatically', async () => {
  await mount();
  Service.disable.mockRejectedValueOnce(failure(409, 'POLICY_VERSION_CONFLICT', 'Policy changed.'));
  Service.get.mockResolvedValueOnce(response(policy({ version: 'latest-disable', healthyCoveragePercent: 140 })));
  act(() => page.setState({ disableOpen: true }));
  await act(async () => { await page.disable(); });
  expect(Service.disable).toHaveBeenCalledTimes(1);
  expect(page.state.disableOpen).toBe(false);
  expect(page.state.policy.version).toBe('latest-disable');
  expect(page.props.form.getFieldValue('healthyCoveragePercent')).toBe(140);
  expect(container.textContent).toContain('Review the loaded thresholds');
});
