import React from "react";
import ReactDOM from "react-dom";
import { act, Simulate } from "react-dom/test-utils";
import ItemDeleteConfirm from "./item-delete-confirm";

let container;
beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});
afterEach(() => {
  act(() => ReactDOM.unmountComponentAtNode(container));
  container.remove();
});
const render = props => act(() => { ReactDOM.render(<ItemDeleteConfirm {...props} />, container); });

test.each(["item", "variant"])("confirms %s deletion with the selected name and a danger button", kind => {
  const confirm = jest.fn();
  render({ target: { kind, name: "Selected record" }, deleting: false, onConfirm: confirm, onCancel: jest.fn() });
  expect(document.querySelector('.ant-modal-title').textContent).toBe(`Delete ${kind}?`);
  expect(document.querySelector('.ant-modal-body').textContent).toContain('Delete "Selected record"?');
  expect(confirm).not.toHaveBeenCalled();
  const button = document.querySelector('.ant-modal-footer .ant-btn-danger');
  expect(button.textContent).toBe(`Delete ${kind}`);
  act(() => Simulate.click(button));
  expect(confirm).toHaveBeenCalledTimes(1);
});

test("cancel leaves deletion unconfirmed", () => {
  const confirm = jest.fn(), cancel = jest.fn();
  render({ target: { kind: "item", name: "Item" }, onConfirm: confirm, onCancel: cancel });
  act(() => Simulate.click(document.querySelector('.ant-modal-footer button')));
  expect(cancel).toHaveBeenCalledTimes(1);
  expect(confirm).not.toHaveBeenCalled();
});

test("shows backend errors inside the modal and prevents closing while deleting", () => {
  const props = { target: { kind: "variant", name: "Blue" }, onConfirm: jest.fn(), onCancel: jest.fn() };
  render({ ...props, error: "Variant quantity is not zero." });
  expect(document.querySelector('[role="alert"]').textContent).toContain("Variant quantity is not zero.");
  render({ ...props, deleting: true });
  expect(document.querySelector('.ant-modal-footer button').disabled).toBe(true);
  expect(document.querySelector('.ant-modal-close')).toBeNull();
  expect(document.querySelector('.ant-btn-loading')).not.toBeNull();
});
