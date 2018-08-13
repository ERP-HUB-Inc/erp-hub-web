import React from "react";
import { Input } from "antd";
import Element from "../../common/Element";

const { TextArea } = Input;

export default class TextAreas extends Element {
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <this.FormItem label={this.props.label}>
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
              validator: this.props.validator
            }
          ],
          initialValue: this.props.data})(<TextArea placeholder={ this.props.placeholder } rows={ this.props.rows }/>)
        }
       
      </this.FormItem>
    );
  }
}

TextAreas.defaultProps = {
  name: "name",
  type: "text",
  max: 255,
  rows: 4,
  required: false
};

