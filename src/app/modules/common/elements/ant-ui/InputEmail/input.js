import React from "react";
import Element, { Form } from "../../common/Element";

class InputText extends Element {
  constructor(props) {
    super(props);
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { input } = this.props;
    delete input["value"];
    return (
      <this.FormItem>
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
  name: "email",
  type: "text",
  required: false
};

export default Form.create()(InputText);
