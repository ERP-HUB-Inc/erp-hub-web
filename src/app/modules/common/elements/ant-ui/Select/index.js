import React from "react";
import Element from "../../common/Element";
import "./index.css";

export class Select extends Element {
  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <this.FormItem
        label={this.props.label}
        help={this.props.help}>
        {
          getFieldDecorator(this.props.name, {rules: this.props.rules, initialValue: this.props.defaultValue})(
            <this.Select
              placeholder={this.props.placeholder}
              onChange={this.props.onChange}
              disabled={this.props.disabled}
              style={{ width: "100%" }}
            >
              {
                this.props.dataSource.map((value, index) =>
                  <this.Option key={index} value={value[this.props.valueKey]}>{value[this.props.nameKey]}</this.Option>
                )
              }
            </this.Select>
          )
        }
      </this.FormItem>
    );
  }   
}

Select.defaultProps = {
  valueKey: "value",
  nameKey: "name"
};
