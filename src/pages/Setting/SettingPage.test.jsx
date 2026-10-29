import React from 'react';
import ReactDOM from 'react-dom';
import { act, Simulate } from 'react-dom/test-utils';
import { MemoryRouter, Route } from 'react-router-dom';
import SettingPage from './SettingPage';

jest.mock('./SystemLogs', () => () => <div>Audit content</div>);
jest.mock('./ModuleSettings', () => props => <div data-module-content>{props.search}<button onClick={props.onClearSearch}>Clear module search</button></div>);

let container;
let currentLocation;
beforeEach(() => { container = document.createElement('div'); document.body.appendChild(container); });
afterEach(() => { act(() => { ReactDOM.unmountComponentAtNode(container); }); container.remove(); });
const renderPage = entry => act(() => {
  ReactDOM.render(<MemoryRouter initialEntries={[entry]}><Route render={props => {
    currentLocation = props.location;
    return <SettingPage {...props} />;
  }} /></MemoryRouter>, container);
});

test('renders the seven available tabs in order and honors the modules URL state', () => {
  renderPage('/settings?tab=modules');
  const tabs = Array.from(container.querySelectorAll('[role="tab"]'));
  expect(tabs.map(tab => tab.textContent)).toEqual([
    'General', 'Modules', 'Integration & APIs', 'Backup & Security',
    'Workflows & Automation', 'Reports & Exports', 'System Logs & Audit'
  ]);
  expect(tabs[1].getAttribute('aria-selected')).toBe('true');
  expect(container.querySelector('[data-module-content]')).not.toBeNull();
});

test('search opens Modules without discarding other URL parameters and can be cleared', () => {
  renderPage('/settings?tab=general&logTab=activities');
  const input = container.querySelector('[aria-label="Filter settings or toggles"]');
  act(() => { Simulate.change(input, { target: { value: 'barcode' } }); });
  expect(new URLSearchParams(currentLocation.search).get('tab')).toBe('modules');
  expect(new URLSearchParams(currentLocation.search).get('logTab')).toBe('activities');
  expect(container.querySelector('[data-module-content]').textContent).toContain('barcode');
  act(() => { Simulate.click(container.querySelector('[data-module-content] button')); });
  expect(input.value).toBe('');
});

test('the advertised keyboard shortcut focuses search', () => {
  renderPage('/settings?tab=modules');
  const event = new KeyboardEvent('keydown', { key: '/', ctrlKey: true, bubbles: true, cancelable: true });
  act(() => { window.dispatchEvent(event); });
  expect(document.activeElement).toBe(container.querySelector('[aria-label="Filter settings or toggles"]'));
  expect(event.defaultPrevented).toBe(true);
});
