import React from "react";
import "./index.css";
import Element from "../../common/Element";

export class SelectTag extends Element {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  handleChange(value) {
    console.log(`On Change ${value}`);
  }
    
  handleSelect(value) {
    console.log(`On Select ${value}`);
  }
  render() {
    const {getFieldDecorator} = this.props.form;
    const children = [];
    this.props.dataSource.forEach((value, index) => {
      // const obj = JSON.stringify(value);
      children.push(<this.Option key={index} value={value[this.props.valueKey]}>{value[this.props.nameKey]}</this.Option>);
    });
    return (
      <this.FormItem
        label={this.props.label}
        help={this.props.help}>
        {
          getFieldDecorator(this.props.name, {initialValue: this.props.defaultValue})(
            <this.Select
              mode="tags"
              placeholder={this.props.placeholder}
              onChange={this.props.onChange}
              onSelect={this.props.onSelect}
              onDeselect={this.props.onDeselect}
              notFoundContent={this.props.notFoundContent}>
              {children}
            </this.Select>
          )
        }
      </this.FormItem>
    );
  }
}

SelectTag.defaultProps = {
  valueKey: "value",
  nameKey: "name",
  textAddNew: "Add New"
};