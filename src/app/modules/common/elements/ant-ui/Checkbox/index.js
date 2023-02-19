import React from "react";
import Element from "../../common/Element";
import "./index.css";

export class Checkboxs extends Element {
  render(){
    const {getFieldDecorator} = this.props.form;
    return (
      <this.FormItem style={this.props.style}>
        {getFieldDecorator(this.props.name, {
          valuePropName: "checked",
          initialValue: this.props.defaultValue,
        })(
          <this.Checkbox onChange={this.props.onChange}>{this.props.label}</this.Checkbox>
        )}
      </this.FormItem>
    );
  }
}

Checkboxs.defaultProps = {
  name: "checkbox",
  defaultValue: false 
};
