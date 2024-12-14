import React from "react";
import { Form, Checkbox, Tooltip, Icon } from "antd";
import styled from "styled-components";
import "./index.css";

const StyledSubtitle = styled.div`
  all: unset;
  font-size: ${(props) => props.fontSize || "13px"};
  font-weight: ${(props) => props.fontWeight || "normal"};
  margin-top: ${(props) => props.marginTop || "5px"};
  color: ${(props) => props.color || "#888"};
`;

export function CustomCheckbox(props) {
  const { getFieldDecorator } = props.form;
    return (<Form.Item style={props.style}>
        {getFieldDecorator(props.name, { valuePropName: "checked", initialValue: props.defaultValue })(
          <Checkbox disabled={props.disabled}>
            {props.label}
            {
              props.tooltip && 
              <Tooltip placement="right" title={props.tooltip}>
                <Icon type="question-circle" style={{ marginLeft: 8, color: "#888" }} />
              </Tooltip>
            }
            {
              props.subtitle && 
              <div>
                <StyledSubtitle>{props.subtitle}</StyledSubtitle>
              </div>
            }
          </Checkbox>
        )}
      </Form.Item>
    );
}

