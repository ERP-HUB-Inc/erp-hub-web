import React from 'react';
import ReactDOM from 'react-dom';
import { act, Simulate } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';
import { ModuleSettingsCards } from './ModuleSettings';

// Presentation tests inject resource states; no API requests run here.
jest.mock('@services/CategoryService', () => ({}));
jest.mock('@services/BrandService', () => ({}));
jest.mock('@services/LocationService', () => ({}));
jest.mock('@services/TaxService', () => ({}));
jest.mock('../../app/modules/pos/services/settings/PrivilegeService', () => ({}));
jest.mock('../Onboarding/OnboardingService', () => ({}));

let container;
const ready = data => ({ loading: false, data, error: false, retry: jest.fn() });
const resources = () => ({
  locations: ready(9), taxes: ready(2),
  workspace: ready({ costCalculation: 'AVERAGE', currency: { code: 'KHR' } }),
  catalogAccess: ready(true)
});
const renderCards = (values = resources(), props = {}) => {
  act(() => { ReactDOM.render(<MemoryRouter><ModuleSettingsCards search="" onClearSearch={jest.fn()} resources={values} {...props} /></MemoryRouter>, container); });
};
beforeEach(() => { container = document.createElement('div'); document.body.appendChild(container); });
afterEach(() => { act(() => { ReactDOM.unmountComponentAtNode(container); }); container.remove(); });

test('renders five cards and actual metadata without claiming activation or synchronization', () => {
  renderCards();
  expect(container.querySelectorAll('article')).toHaveLength(5);
  expect(container.querySelectorAll('.settings-module-entries li')).toHaveLength(26);
  ['9 locations', '2 tax rates', 'Average cost', 'KHR'].forEach(text => expect(container.textContent).toContain(text));
  expect(container.textContent).not.toMatch(/\b\d+ (categories|brands)\b/);
  expect(container.textContent).not.toContain('ERP Modules Configuration');
  expect(container.textContent).not.toContain('Synchronization status unavailable');
  expect(container.textContent).not.toContain('Unavailable');
  expect(container.textContent).not.toMatch(/9 Active|14 nodes|10% VAT|Min 20%|Auto-synced daily|Updated today/);
});

test('only enables verified configuration links for permitted users', () => {
  renderCards();
  const links = Array.from(container.querySelectorAll('a')).map(link => link.getAttribute('href'));
  expect(links).toEqual(['/settings/item-types', '/settings/categories', '/settings/brands', '/settings/units', '/settings/options', '/settings/categories', '/settings/locations', '/settings/locations']);
  expect(container.querySelectorAll('[role="switch"]')).toHaveLength(0);
  expect(container.textContent).not.toContain('Module switches are read only.');
});

test('uses read-only presentation when edit permission is denied or still loading', () => {
  const values = resources();
  values.catalogAccess = ready(false);
  renderCards(values);
  expect(container.querySelectorAll('a')).toHaveLength(0);
  values.catalogAccess = { ...ready(null), loading: true };
  renderCards(values);
  expect(container.querySelectorAll('a')).toHaveLength(0);
});

test('resource failures show a clear load message and expose a targeted retry', () => {
  const values = resources();
  values.taxes = { ...ready(null), error: true };
  renderCards(values);
  expect(container.textContent).not.toContain('2 tax rates');
  expect(container.querySelector('[role="alert"]').textContent).toContain('Unable to load tax count.');
  expect(container.textContent).not.toContain('Unavailable');
  act(() => { Simulate.click(container.querySelector('[aria-label="Retry tax count"]')); });
  expect(values.taxes.retry).toHaveBeenCalledTimes(1);
  expect(container.textContent).toContain('9 locations');
});

test('loading preserves all cards and uses skeletons instead of invented counts', () => {
  const values = resources();
  Object.keys(values).forEach(key => { values[key] = { ...ready(null), loading: true }; });
  renderCards(values);
  expect(container.querySelectorAll('article')).toHaveLength(5);
  expect(container.querySelectorAll('.ant-skeleton').length).toBeGreaterThan(0);
  expect(container.textContent).not.toMatch(/\b\d+ (categories|brands)\b/);
});

test('search keeps a matching entry in its card and offers a clear empty state', () => {
  const onClearSearch = jest.fn();
  renderCards(resources(), { search: 'brands' });
  expect(container.querySelectorAll('article')).toHaveLength(1);
  expect(container.querySelectorAll('.settings-module-entries li')).toHaveLength(1);
  expect(container.textContent).toContain('Items Management');
  renderCards(resources(), { search: 'no-matching-setting', onClearSearch });
  expect(container.querySelectorAll('article')).toHaveLength(0);
  expect(container.textContent).toContain('No settings found');
  act(() => { Simulate.click(container.querySelector('button')); });
  expect(onClearSearch).toHaveBeenCalledTimes(1);
});
