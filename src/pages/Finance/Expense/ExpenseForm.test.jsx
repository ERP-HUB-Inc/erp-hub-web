import React from 'react';
import ReactDOM from 'react-dom';
import { act, findRenderedComponentWithType } from 'react-dom/test-utils';
import moment from 'moment';
import DecoratedForm, { ExpenseForm } from './ExpenseForm';

// Form validation checks only: option loading lifecycle is disabled, no HTTP calls.
let container, form, onSave;
beforeEach(() => {
  jest.spyOn(ExpenseForm.prototype, 'componentDidMount').mockImplementation(() => {});
  jest.spyOn(window, 'scrollTo').mockImplementation(() => {});
  container = document.createElement('div'); document.body.appendChild(container); onSave = jest.fn();
});
afterEach(() => { act(() => { ReactDOM.unmountComponentAtNode(container); }); container.remove(); jest.restoreAllMocks(); });
const mount = (recurring = false, props = {}) => {
  let root;
  act(() => { root = ReactDOM.render(<DecoratedForm record={{}} recurring={recurring} {...props} onSave={onSave} onCancel={() => {}} />, container); });
  form = findRenderedComponentWithType(root, ExpenseForm);
  act(() => form.setState({ loading: false, locations: [{ id: 'branch', name: 'Shop' }], currencies: [{ id: 'usd', code: 'USD' }], categories: [{ name: 'Office Rent' }] }));
};
const set = overrides => act(() => form.props.form.setFieldsValue({ name: '  Shop Rent  ', categoryName: 'Office Rent', locationId: 'branch', currencyId: 'usd', amount: 100, registerDate: moment('2026-10-01'), ...overrides }));

test('rejects missing fields, nonpositive amounts and branches outside loaded authorization choices', () => {
  mount();
  act(() => form.submit());
  expect(onSave).not.toHaveBeenCalled();
  set({ amount: 0 }); act(() => form.submit()); expect(onSave).not.toHaveBeenCalled();
  set({ amount: Infinity }); act(() => form.submit()); expect(onSave).not.toHaveBeenCalled();
  set({ locationId: 'other-branch' }); act(() => form.submit()); expect(onSave).not.toHaveBeenCalled();
});

test('one-off expense submits only supported fields with a frozen calendar date', () => {
  mount(); set({}); act(() => form.submit());
  expect(onSave).toHaveBeenCalledWith({ name: 'Shop Rent', categoryName: 'Office Rent', locationId: 'branch', currencyId: 'usd', amount: 100, registerDate: '2026-10-01', isRecurring: 0, attachment: '' });
});

test('recurring form requires a recurrence date and stores frequency without claiming a payment', () => {
  mount(true); set({}); act(() => form.submit()); expect(onSave).not.toHaveBeenCalled();
  act(() => form.props.form.setFieldsValue({ recurringType: 3, recurringDate: moment('2026-11-01') }));
  act(() => form.submit());
  expect(onSave.mock.calls[0][0]).toMatchObject({ isRecurring: 1, recurringType: 3, recurringDate: '2026-11-01' });
  expect(onSave.mock.calls[0][0]).not.toHaveProperty('paid');
});

test('upload in progress prevents submission', () => {
  mount(); set({}); act(() => form.setState({ uploading: true })); act(() => form.submit()); expect(onSave).not.toHaveBeenCalled();
});


test('selects the only available branch after choices load', () => {
  mount();
  expect(form.props.form.getFieldValue('locationId')).toBe('branch');
});

test('requires a branch choice when multiple branches are available', () => {
  mount();
  act(() => form.setState({ locations: [{ id: 'branch', name: 'Shop' }, { id: 'other', name: 'Other shop' }] }));
  expect(form.props.form.getFieldValue('locationId')).toBeUndefined();
});

test('preserves the saved branch when editing', () => {
  mount(false, { record: { locationId: 'saved-branch' } });
  expect(form.props.form.getFieldValue('locationId')).toBe('saved-branch');
});

test('selects the only branch for a new recurring bill and allows clearing it', () => {
  mount(false, { commitment: true });
  expect(form.props.form.getFieldValue('locationId')).toBe('branch');
  act(() => form.props.form.setFieldsValue({ locationId: undefined }));
  expect(form.props.form.getFieldValue('locationId')).toBeUndefined();
});

test('preserves all branches when editing an existing recurring bill', () => {
  mount(false, { commitment: true, record: { id: 'existing', locationId: null } });
  expect(form.props.form.getFieldValue('locationId')).toBeUndefined();
});
