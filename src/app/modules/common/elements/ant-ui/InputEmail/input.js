import React from "react";
import { Form, Input } from "antd";
import Element from "../../common/Element";

const FormItem = Form.Item;

class InputText extends Element {
  constructor(props) {
    super(props);
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { input } = this.props;
    delete input["value"];
    return (
      <this.FormGroup>
        <FormItem label={this.props.label}>
          {getFieldDecorator(this.props.name, {rules: this.props.rules})(<Input {...input} type={this.props.type} placeholder={this.props.placeholder}/>)}
        </FormItem>
      </this.FormGroup>
    );
  }
}

InputText.defaultProps = {
  name: "email",
  type: "text",
  required: false
};

export default Form.create()(InputText);
