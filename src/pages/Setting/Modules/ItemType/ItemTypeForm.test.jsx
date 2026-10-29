import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import ItemTypeForm from './ItemTypeForm';
import { errorMessage, itemTypePayload, savedItem } from './model';

let container;
let scrollTo;
beforeEach(() => { scrollTo = window.scrollTo; window.scrollTo = () => {}; container = document.createElement('div'); document.body.appendChild(container); });
afterEach(() => { act(() => { ReactDOM.unmountComponentAtNode(container); }); container.remove(); window.scrollTo = scrollTo; });

test('requires a nonblank name before allowing a create', async () => {
  const onSave = jest.fn();
  let form;
  act(() => { ReactDOM.render(<ItemTypeForm wrappedComponentRef={value => { form = value; }} record={{}} onSave={onSave} />, container); });
  await act(async () => { form.props.form.setFieldsValue({ name: '  ' }); form.handleSubmit(); });
  expect(onSave).not.toHaveBeenCalled();
  expect(document.body.textContent).toContain('Enter an item type name.');
  expect(document.body.querySelector('#item-type-code')).toBeNull();
});

test('creates without displaying or requiring a code', async () => {
  const onSave = jest.fn();
  let form;
  act(() => { ReactDOM.render(<ItemTypeForm wrappedComponentRef={value => { form = value; }} record={{}} onSave={onSave} />, container); });
  await act(async () => { form.props.form.setFieldsValue({ name: 'Service' }); form.handleSubmit(); });
  expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ name: 'Service' }));
  expect(onSave.mock.calls[0][0]).not.toHaveProperty('code');
  expect(onSave.mock.calls[0][0]).not.toHaveProperty('serialType');
  expect(document.body.querySelector('#item-type-serial-type')).toBeNull();
  expect(document.body.querySelector('#item-type-code')).toBeNull();
});

test('preserves UUID edits and false/zero field values without sending ownership or ID', async () => {
  const onSave = jest.fn();
  const record = { id: '11111111-1111-4111-8111-111111111111', name: 'Service', code: 'SERVICE', enableInventoryTracking: false, isSellable: false, status: 0, serialType: 0, productOption: 0, sortOrder: 0 };
  let form;
  act(() => { ReactDOM.render(<ItemTypeForm wrappedComponentRef={value => { form = value; }} record={record} onSave={onSave} />, container); });
  await act(async () => { form.handleSubmit(); });
  expect(onSave).toHaveBeenCalledWith({ name: 'Service', description: '', enableInventoryTracking: false, isSellable: false, status: 0, productOption: 0, sortOrder: 0 });
  expect(record.id).toBe('11111111-1111-4111-8111-111111111111');
  expect(record.code).toBe('SERVICE');
  expect(record.serialType).toBe(0);
  expect(document.body.querySelector('#item-type-serial-type')).toBeNull();
  expect(document.body.querySelector('#item-type-code')).toBeNull();
});

test('busy forms cannot resubmit and API errors stay visible', () => {
  const onSave = jest.fn();
  let form;
  act(() => { ReactDOM.render(<ItemTypeForm wrappedComponentRef={value => { form = value; }} record={{ name: 'Service', code: 'SERVICE' }} busy error="This code is already in use." onSave={onSave} />, container); });
  act(() => { form.handleSubmit(); });
  expect(onSave).not.toHaveBeenCalled();
  expect(document.body.querySelector('[role="alert"]').textContent).toContain('This code is already in use.');
});

test('save payload ignores record ownership, system flags, IDs, and unrelated form values', () => {
  const payload = itemTypePayload({ id: 'fake', clientId: 'other-tenant', isSystem: true, products: [], name: ' Custom ', code: ' CUSTOM ', description: ' note ', enableInventoryTracking: false, isSellable: true, productOption: 0, serialType: 1, sortOrder: 0, status: 0 });
  expect(payload.name).toBe('Custom');
  expect(payload).not.toHaveProperty('clientId');
  expect(payload).not.toHaveProperty('isSystem');
  expect(payload).not.toHaveProperty('id');
  expect(payload).not.toHaveProperty('products');
});

test('an empty successful HTTP body is not accepted as a saved record', () => {
  expect(() => savedItem({ data: {} })).toThrow('Refresh the list');
  expect(() => savedItem({ data: { data: { id: 0 } } })).toThrow();
  expect(savedItem({ data: { data: { id: 'uuid-as-string' } } }).id).toBe('uuid-as-string');
  expect(errorMessage({ response: { data: { error: { message: { name: 'Name is required.', code: 'Code is required.' } } } } }, 'Fallback')).toBe('Name is required. Code is required.');
});
