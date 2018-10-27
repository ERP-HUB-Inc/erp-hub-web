import React from "react";
import Element from "../../common/Element";
import "./index.css";

export class Select extends Element {
  render() {
    const {getFieldDecorator} = this.props.form;
    let dataSource = this.props.dataSource;
    if (!Array.isArray(dataSource)) {
      dataSource = [];
    }
    return (
      <this.FormItem
        label={this.props.label}
        help={this.props.help}
        validateStatus={this.props.validateStatus}>
        {
          getFieldDecorator(this.props.name, {rules: 
              [
                {required: this.props.required, message: this.props.errorRequired}
              ],
          initialValue: this.props.defaultValue
          })(
            <this.Select
              placeholder={this.props.placeholder}
              onChange={this.props.onChange}
              onFocus={this.props.handleOnFocus}
              disabled={this.props.disabled}
              style={{ width: "100%" }}
            >
              {
                dataSource.map((value, index) =>
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
  required: false,
  errorRequired: "Please select this field.",
  valueKey: "value",
  nameKey: "name"
};
