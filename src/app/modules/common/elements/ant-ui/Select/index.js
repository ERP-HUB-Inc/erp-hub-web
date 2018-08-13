import React from "react";
import Element from "../../common/Element";
import "./index.css";

export class Select extends Element {

  constructor(props) {
    super(props);
    this.rules = [
      { required: this.props.required, message: this.props.errorRequired }
    ];
  }

  render() {
    return (
      <SelectElement {...this.props} rules={this.rules} />
    );
  }   
}


class SelectElement extends Element {   
  render() {
    const { getFieldDecorator } = this.props.form;
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
                  <this.Option key={index} value={value.value}>{value.name}</this.Option>
                )
              }
            </this.Select>
          )
        }
      </this.FormItem>
    );
  }
}