import FormCreate from "./form.create";
import CategoryAction from "../redux/action";

jest.mock("@layout/base-modal", () => {
  const React = require("react");
  class BaseModal extends React.Component {}
  BaseModal.prototype.Translate = () => null;
  return BaseModal;
}, { virtual: true });
jest.mock("./form.item", () => () => null);
jest.mock("../redux/action", () => ({ add: jest.fn() }));

const makeForm = (values, error = null) => {
  const form = new FormCreate({
    form: { validateFieldsAndScroll: jest.fn(callback => callback(error, values)) },
    dispatch: jest.fn()
  });
  form.getImageFromUpload = jest.fn(() => "category-photo.png");
  return form;
};

beforeEach(() => {
  CategoryAction.add.mockReset();
  CategoryAction.add.mockReturnValue({ type: "ADD_CATEGORY" });
});

test("dispatches supported category fields and the stored image key without mutating form values", () => {
  const image = { file: { name: "category-photo.png" }, fileList: [], dimensions: { width: 100 } };
  const values = Object.freeze({
    name: "Dairy",
    parentId: 0,
    label: "Chilled",
    description: "Keep refrigerated",
    isFeature: false,
    image,
    posColor: "#059669"
  });
  const form = makeForm(values);
  const event = { preventDefault: jest.fn() };

  form.handleSubmit(event);

  expect(event.preventDefault).toHaveBeenCalledTimes(1);
  expect(form.getImageFromUpload).toHaveBeenCalledWith(values, "image");
  expect(CategoryAction.add).toHaveBeenCalledWith({
    name: "Dairy",
    parentId: 0,
    label: "Chilled",
    description: "Keep refrigerated",
    isFeature: false,
    image: "category-photo.png"
  });
  expect(form.props.dispatch).toHaveBeenCalledWith({ type: "ADD_CATEGORY" });
  expect(values.image).toBe(image);
});

test.each([undefined, null, ""])("preserves an empty image value (%s)", image => {
  const form = makeForm({ name: "Dairy", image });

  form.handleSubmit({ preventDefault: jest.fn() });

  expect(form.getImageFromUpload).not.toHaveBeenCalled();
  expect(CategoryAction.add).toHaveBeenCalledWith(expect.objectContaining({ name: "Dairy", image }));
});

test("does not dispatch when form validation fails", () => {
  const form = makeForm({}, { name: { errors: ["Enter a category name."] } });

  form.handleSubmit({ preventDefault: jest.fn() });

  expect(CategoryAction.add).not.toHaveBeenCalled();
  expect(form.props.dispatch).not.toHaveBeenCalled();
});
