import React from "react";
import { Form } from "antd";
import styled from "styled-components";

// Styled Components
const Subtitle = styled.div`
  font-size: 13px;
  color: #888;
  margin-top: 4px;
  white-space: normal; /* Allow line breaks */
  word-wrap: break-word; /* Break long words */
  line-height: 1.4; /* Improve readability */
`;

const CustomFormItem = ({ name, label, subtitle, children, ...props }) => {
  return (
    <Form.Item
      name={name}
      label={
        label ? (
          <div style={{ textAlign: "left" }}>
            <div>{label}</div>
            {subtitle && <Subtitle>{subtitle}</Subtitle>}
          </div>
        ) : null
      }
      {...props}
    >
      {children}
    </Form.Item>
  );
};

export {
  CustomFormItem
};
