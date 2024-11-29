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

export class CustomCheckbox extends React.PureComponent {
  render(){
    const {getFieldDecorator} = this.props.form;
    return (
      <Form.Item style={this.props.style}>
        {getFieldDecorator(this.props.name, {
          valuePropName: "checked",
          initialValue: this.props.defaultValue,
        })(
          <React.Fragment>
            <div style={{lineHeight: 0}}>
              <Checkbox onChange={this.props.onChange}>
                {this.props.label}
                {
                  this.props.tooltip && 
                  <Tooltip placement="right" title={this.props.tooltip}>
                    <Icon type="question-circle" style={{ marginLeft: 8, color: "#888" }} />
                  </Tooltip>
                }
              </Checkbox>
            </div>
            {this.props.subtitle && <StyledSubtitle>{this.props.subtitle}</StyledSubtitle>}
          </React.Fragment>
        )}
      </Form.Item>
    );
  }
}

CustomCheckbox.defaultProps = {
  name: "checkbox",
  defaultValue: false 
};
