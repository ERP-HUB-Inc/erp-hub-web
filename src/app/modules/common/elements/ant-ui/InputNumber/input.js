import React from "react";
import Element, { Form } from "../../common/Element";

class InputNumbers extends Element {

  render() {

    const { getFieldDecorator } = this.props.form;
    const { input } = this.props;
    delete input["value"];

    console.log("input values",input);

    return (
      <this.FormItem label={this.props.label}>
        {
          getFieldDecorator(this.props.name, {rules: this.props.rules, initialValue: this.props.data})(
            <this.InputNumber 
              defaultValue={ this.props.defaultValue } 
              type={ this.props.type }
              placeholder={ this.props.placeholder } 
              { ...input } 
            />
          )
        }
      </this.FormItem>
    );
  }
}

InputNumbers.defaultProps = {
  name: "name",
  type: "number",
  required: false
};

export default Form.create()(InputNumbers);
