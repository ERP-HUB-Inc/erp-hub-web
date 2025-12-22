import React from "react";
import { Form, Input } from "antd"
import "./index.css";


export class InputText extends React.Component {
  componentDidMount(){
    if (this.props.isAutoFocus) {
      this.nameInput.focus();
    }
  }

  componentDidUpdate() {
    if (this.props.isAutoFocus && this.props.didUpdateMakeAutoFocus) {
      this.nameInput.focus();
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form.Item
        label={this.props.label}
        labelCol={this.props.labelCol}
        wrapperCol={this.props.wrapperCol}
        help={this.props.help}
        validateStatus={this.props.validateStatus}
        hasFeedback={!!this.props.data}
        style={this.props.style}
        className={this.props.className}>
        {
          getFieldDecorator(this.props.name, {rules: [
            {
              required: this.props.required,
              message: this.props.errorRequired
            },
            {
              min: this.props.min,
              message: this.props.errorLenght
            },
            {
              max: this.props.max,
              message: this.props.errorLenght
            },
            {
              validator: this.props.validator
            }
          ],
          initialValue: this.props.data})(<Input
            size={this.props.size ? this.props.size : "large"}
            name={this.props.name}
            suffix={this.props.suffix}
            prefix={this.props.prefix}
            type={this.props.type}
            style={this.props.inputStyle}
            ref={(input) => { this.nameInput = input; }}
            placeholder={this.props.placeholder}
            autoComplete={this.props.autoComplete}
            disabled={this.props.disabled}
            addonBefore={this.props.addonBefore}
            addonAfter={this.props.addonAfter}
            allowClear={this.props.allowClear}
            onChange={this.props.onChange}
            onKeyDown={this.props.handleKeyDown}
            onKeyUp={this.props.handleKeyUp}
            onBlur={this.props.handleOnBlur}
            onFocus={this.props.handleOnFocus}
            onPressEnter={this.props.handlePressEnter}
          />) 
        }
        { this.props.notation !=="" ?
          <label className="notation-textfield">{ this.props.notation }</label>
          : ""  
        }
      </Form.Item>
    );
  }
}

InputText.defaultProps = {
  errorRequired: "Field required",
  errorLenght: "Over allow character lenght.",
  type: "text"
};

