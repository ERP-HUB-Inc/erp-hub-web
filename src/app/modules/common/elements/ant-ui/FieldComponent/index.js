import React from "react";
import { Form } from "antd";
const FormItem = Form.Item;

export const FieldComponent = Component => ({ input,classsName, meta, children, hasFeedback, label, ...rest }) => {
  const hasError = meta.touched && meta.invalid;
  return (
    <div className={ classsName }>
      <FormItem
        label={label}
        validateStatus={hasError ? "error" : "success"}
        hasFeedback={hasFeedback && hasError}
        help={hasError && meta.error}
      >
        <Component 
          {...input} 
          {...rest} 
          children={children} 
        />
      </FormItem>
    </div>
  );
};
