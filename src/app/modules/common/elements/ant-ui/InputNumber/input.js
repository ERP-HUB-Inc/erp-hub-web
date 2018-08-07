import React from "react";
import Element from "../../common/Element";

export default class InputNumbers extends Element {
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <this.FormItem label={this.props.label}>
        {
          getFieldDecorator(this.props.name, {rules: this.props.rules, initialValue: this.props.data})(
            <this.Input
              type={ this.props.type }
              placeholder={ this.props.placeholder }
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
