import React from "react";
import Element from "../../common/Element";

export default class InputText extends Element {
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <this.FormItem
        label={this.props.label}
        help={this.props.help}
        validateStatus={this.props.validateStatus}>
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
          initialValue: this.props.data})(<this.Input type={this.props.type} 
            placeholder={this.props.placeholder} 
            disabled= { this.props.disabled } 
            onKeyDown={this.props.handleKeyDown}
            onKeyUp={this.props.handleKeyUp}
          />) 
        }
        { this.props.notation !=="" ?
          <label className="notation-textfield">{ this.props.notation }</label>
          : ""  
        }
      </this.FormItem>
    );
  }
}

InputText.defaultProps = {
  name: "name",
  type: "text",
  max: 255,
  required: false,
  disabled: false
};
