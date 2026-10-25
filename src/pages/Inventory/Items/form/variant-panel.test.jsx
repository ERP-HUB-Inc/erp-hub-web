import React from "react";
import ReactDOM from "react-dom";
import { act, Simulate } from "react-dom/test-utils";
import { Form, Input } from "antd";
import { CustomCollapse } from "../../../../components/CustomCollapse";

let container;

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  act(() => { ReactDOM.unmountComponentAtNode(container); });
  container.remove();
});

test("variant fields stay unregistered until opened and remain available after collapsing", () => {
  let form;
  const onVariantsReady = jest.fn();
  const variants = [{ id: "variant-1", name: "Small", price: 5 }];

  function VariantFields({ form }) {
    React.useEffect(() => { onVariantsReady(variants); }, []);
    return <>
      {form.getFieldDecorator("variantId[0]", { initialValue: variants[0].id })(<Input />)}
      {form.getFieldDecorator("variantName[0]", { initialValue: variants[0].name })(<Input />)}
      {form.getFieldDecorator("variantRetailPrice[0]", { initialValue: variants[0].price })(<Input />)}
    </>;
  }

  const EditForm = Form.create()(({ form: currentForm }) => {
    form = currentForm;
    return <Form>
      <CustomCollapse headerTitle="Variants">
        <VariantFields form={form} />
      </CustomCollapse>
    </Form>;
  });

  act(() => { ReactDOM.render(<EditForm />, container); });

  expect(container.querySelector("[aria-expanded]").getAttribute("aria-expanded")).toBe("false");
  expect(onVariantsReady).not.toHaveBeenCalled();
  expect(form.getFieldsValue()).toEqual({});
  act(() => { Simulate.click(container.querySelector(".ant-collapse-header")); });
  expect(onVariantsReady).toHaveBeenCalledWith(variants);
  act(() => { Simulate.click(container.querySelector(".ant-collapse-header")); });
  expect(container.querySelector("[aria-expanded]").getAttribute("aria-expanded")).toBe("false");
  const onValidate = jest.fn();
  act(() => { form.validateFieldsAndScroll(onValidate); });
  expect(onValidate).toHaveBeenCalledWith(null, expect.objectContaining({
    variantId: ["variant-1"],
    variantName: ["Small"],
    variantRetailPrice: [5]
  }));
});

test("other collapsed panels retain lazy mounting by default", () => {
  act(() => {
    ReactDOM.render(<CustomCollapse headerTitle="Other section"><input aria-label="Lazy field" /></CustomCollapse>, container);
  });

  expect(container.querySelector("input")).toBeNull();
});
