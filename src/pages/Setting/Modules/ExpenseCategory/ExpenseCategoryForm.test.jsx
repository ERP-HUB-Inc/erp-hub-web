import React from 'react';
import ReactDOM from 'react-dom';
import { act, findRenderedComponentWithType } from 'react-dom/test-utils';
import DecoratedForm, { ExpenseCategoryForm } from './ExpenseCategoryForm';

let container, form, onSave;
beforeEach(() => {
  jest.spyOn(window, 'scrollTo').mockImplementation(() => {});
  container = document.createElement('div'); document.body.appendChild(container); onSave = jest.fn();
});
afterEach(() => { act(() => { ReactDOM.unmountComponentAtNode(container); }); container.remove(); jest.restoreAllMocks(); });
function mount(props = {}) {
  let root;
  act(() => { root = ReactDOM.render(<DecoratedForm record={{}} onSave={onSave} onCancel={() => {}} {...props} />, container); });
  form = findRenderedComponentWithType(root, ExpenseCategoryForm);
}
const set = values => act(() => form.props.form.setFieldsValue(values));

test('requires a nonblank name and rejects names longer than the API limit', () => {
  mount();
  act(() => form.submit()); expect(onSave).not.toHaveBeenCalled();
  set({ name: '   ' }); act(() => form.submit()); expect(onSave).not.toHaveBeenCalled();
  set({ name: 'x'.repeat(256) }); act(() => form.submit()); expect(onSave).not.toHaveBeenCalled();
  set({ name: 'Admin Fee', namekh: 'x'.repeat(256) }); act(() => form.submit()); expect(onSave).not.toHaveBeenCalled();
});

test('trims both fields and submits only the two supported fields', () => {
  mount(); set({ name: '  Admin Fee  ', namekh: '  ថ្លៃរដ្ឋបាល  ' }); act(() => form.submit());
  expect(onSave).toHaveBeenCalledWith({ name: 'Admin Fee', namekh: 'ថ្លៃរដ្ឋបាល' });
});

test('editing preserves values and allows clearing the optional Khmer name', () => {
  mount({ record: { id: 'category', name: 'Admin Fee', namekh: 'ថ្លៃរដ្ឋបាល' } });
  expect(form.props.form.getFieldValue('namekh')).toBe('ថ្លៃរដ្ឋបាល');
  set({ namekh: '' }); act(() => form.submit());
  expect(onSave).toHaveBeenCalledWith({ name: 'Admin Fee', namekh: '' });
});

test('busy state prevents submission and API errors keep entered values', () => {
  mount({ busy: true, error: 'An expense category with this name already exists.' });
  set({ name: 'Admin Fee' }); act(() => form.submit()); expect(onSave).not.toHaveBeenCalled();
  expect(document.body.textContent).toContain('An expense category with this name already exists.');
  expect(form.props.form.getFieldValue('name')).toBe('Admin Fee');
});
