import React from 'react';
import ReactDOM from 'react-dom';
import { act, Simulate } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';
import ItemTypePage from './index';

// Presentation-only checks: lifecycle is disabled so these do not issue API calls.
let container;
let page;
beforeEach(() => {
  jest.spyOn(ItemTypePage.prototype, 'componentDidMount').mockImplementation(() => {});
  container = document.createElement('div'); document.body.appendChild(container);
  act(() => { ReactDOM.render(<MemoryRouter><ItemTypePage ref={value => { page = value; }} /></MemoryRouter>, container); });
});
afterEach(() => { act(() => { ReactDOM.unmountComponentAtNode(container); }); container.remove(); jest.restoreAllMocks(); });

test('denied access does not expose management controls or records', () => {
  act(() => page.setState({ access: 'denied', records: [{ id: 'private', name: 'Private type' }] }));
  expect(container.textContent).toContain('You need catalog editing access');
  expect(container.textContent).not.toContain('Private type');
  expect(container.textContent).not.toContain('New Item Type');
});

test('system and custom item types can open delete confirmation, and failures persist', () => {
  act(() => page.setState({ access: 'allowed', records: [
    { id: 'system-uuid', name: 'Physical', isSystem: true, status: 1 },
    { id: 'custom-uuid', name: 'Custom', isSystem: false, status: 0 }
  ], total: 2 }));
  expect(container.querySelector('.category-listing-actions').querySelectorAll('button')).toHaveLength(1);
  act(() => Simulate.click(container.querySelector('[aria-label="More actions for Physical"]')));
  expect(document.querySelector('[aria-label="Delete Physical"]').getAttribute('aria-disabled')).not.toBe('true');
  act(() => Simulate.click(document.querySelector('[aria-label="Delete Physical"]')));
  expect(page.state.deleteRecord.id).toBe('system-uuid');
  act(() => page.setState({ deleteRecord: null }));
  act(() => Simulate.click(container.querySelector('[aria-label="More actions for Custom"]')));
  act(() => Simulate.click(document.querySelector('[aria-label="Delete Custom"]')));
  expect(page.state.deleteRecord.id).toBe('custom-uuid');
  expect(document.body.textContent).toContain('cannot be undone');
  act(() => page.setState({ deleteError: 'This item type is in use.' }));
  expect(document.body.textContent).toContain('This item type is in use.');
});

test('delete menu items are disabled while deletion is in progress', () => {
  act(() => page.setState({ access: 'allowed', deleting: true, records: [
    { id: 'system-uuid', name: 'Physical', isSystem: true, status: 1 }
  ], total: 1 }));
  act(() => Simulate.click(container.querySelector('[aria-label="More actions for Physical"]')));
  expect(document.querySelector('[aria-label="Delete Physical"]').getAttribute('aria-disabled')).toBe('true');
});

test('edit menu opens the selected item type', () => {
  const record = { id: 'custom-uuid', name: 'Custom', status: 1 };
  const openEditor = jest.spyOn(page, 'openEditor').mockImplementation(() => {});
  act(() => page.setState({ access: 'allowed', records: [record], total: 1 }));
  act(() => Simulate.click(container.querySelector('[aria-label="More actions for Custom"]')));
  act(() => Simulate.click(document.querySelector('[aria-label="Edit Custom"]')));
  expect(openEditor).toHaveBeenCalledWith(record);
});

test('unavailable list has a retry action and does not pretend to be a successful empty list', () => {
  act(() => page.setState({ access: 'allowed', loadError: 'Unable to load item types.' }));
  expect(container.querySelector('[role="alert"]').textContent).toContain('Unable to load item types.');
  expect(container.textContent).toContain('Retry');
  expect(container.textContent).not.toContain('No item types found');
});
