import React from 'react';
import ReactDOM from 'react-dom';
import { act, findRenderedComponentWithType } from 'react-dom/test-utils';
import DecoratedForm, { SalesTargetForm } from './SalesTargetForm';

let container, form, onSave;
const locations = [{ id: '1', name: 'Main branch' }];
beforeEach(() => {
  jest.spyOn(window, 'scrollTo').mockImplementation(() => {});
  container = document.createElement('div'); document.body.appendChild(container); onSave = jest.fn();
});
afterEach(() => { act(() => { ReactDOM.unmountComponentAtNode(container); }); container.remove(); jest.restoreAllMocks(); });
function mount(props = {}) {
  let root;
  act(() => { root = ReactDOM.render(<DecoratedForm record={{}} locations={locations} onSave={onSave} onCancel={() => {}} {...props} />, container); });
  form = findRenderedComponentWithType(root, SalesTargetForm);
}
const set = values => act(() => { form.props.form.setFieldsValue(values); });
const submit = () => act(() => { form.submit(); });
const record = { id: 123, locationId: '1', targetType: 'MONTHLY', year: 2026, month: 10, quarter: 4, targetRevenue: 15000, status: 'INACTIVE' };

test('monthly update includes all editable fields and preserves inactive status', () => {
  mount({ record }); set({ targetRevenue: 18000 }); submit();
  expect(onSave).toHaveBeenCalledWith({ locationId: '1', targetType: 'MONTHLY', year: 2026, month: 10, quarter: 4, targetRevenue: 18000, status: 'INACTIVE' });
});

test.each([[1, 1], [3, 1], [4, 2], [6, 2], [7, 3], [9, 3], [10, 4], [12, 4]])('month %p derives quarter %p', (month, quarter) => {
  mount({ record }); set({ month }); submit(); expect(onSave.mock.calls[0][0].quarter).toBe(quarter);
});

test('switching to quarterly clears month and requires a quarter', () => {
  mount(); set({ targetType: 'QUARTERLY', year: 2026, targetRevenue: 30000 }); submit();
  expect(onSave).not.toHaveBeenCalled();
  set({ quarter: 2 }); submit();
  expect(onSave).toHaveBeenCalledWith({ locationId: '1', targetType: 'QUARTERLY', year: 2026, month: null, quarter: 2, targetRevenue: 30000, status: 'ACTIVE' });
});

test('switching monthly to yearly sends null month and quarter', () => {
  mount({ record }); set({ targetType: 'YEARLY' }); submit();
  expect(onSave).toHaveBeenCalledWith({ locationId: '1', targetType: 'YEARLY', year: 2026, month: null, quarter: null, targetRevenue: 15000, status: 'INACTIVE' });
});

test.each([{ targetRevenue: -1 }, { targetRevenue: Infinity }, { targetRevenue: undefined }, { year: 2026.5 }, { year: 0 }, { locationId: 'foreign' }])('invalid form prevents submission: %p', values => {
  mount({ record }); set(values); submit(); expect(onSave).not.toHaveBeenCalled();
});

test('busy and unavailable branch states prevent submission', () => {
  mount({ record, busy: true }); submit(); expect(onSave).not.toHaveBeenCalled();
});

test('multiple branches require an explicit selection for a new target', () => {
  mount({ locations: [...locations, { id: '2', name: 'Second branch' }] });
  set({ year: 2026, targetRevenue: 1000 }); submit(); expect(onSave).not.toHaveBeenCalled();
  set({ locationId: '2' }); submit(); expect(onSave.mock.calls[0][0].locationId).toBe('2');
});
