import React from "react";
import Element, { Form } from "../../common/Element";

class InputText extends Element {
  render() {
    const { getFieldDecorator } = this.props.form;
    const { input } = this.props;
    delete input["value"];
    return (
      <this.FormItem label={this.props.label}>
        {
          getFieldDecorator(this.props.name, {rules: this.props.rules})(
            <this.Input {...input} type={this.props.type} placeholder={this.props.placeholder}/>
          )
        }
      </this.FormItem>
    );
  }
}

InputText.defaultProps = {
  name: "name",
  label: "Name",
  type: "text",
  required: false
};

export default Form.create()(InputText);
