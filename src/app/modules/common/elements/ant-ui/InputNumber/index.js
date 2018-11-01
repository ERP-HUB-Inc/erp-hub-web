import React from "react";
import Input from "./input";
import Element from "../../common/Element";
import "./index.css";


export class InputNumber extends Element {
  constructor(props) {
    super(props);
    this.checkPrice = this.checkPrice.bind(this);
    this.rules = [
      {
        required: this.props.required,
        message: this.props.errorRequired,
        validator: this.checkPrice
      }
    ];
  }

  checkPrice(rule, value, callback) {
    if (parseFloat(value) <= 0 && this.props.required) {
      callback(this.props.errorRequired);
    } else {
      if (this.props.compare) {
        if (parseFloat(value) > this.props.compare.value) {
          callback(this.props.compare.message);
          return;
        }
      }

      callback();
    }
  }

  render() {
    return (
      <Input
        name={this.props.name}
        placeholder={this.props.placeholder}
        label={this.props.label}
        errorLength={this.props.errorLength}
        max={this.props.max}
        isUnsign={this.props.isUnsign}
        data={this.props.data}
        formatter={this.props.formatter}
        step={this.props.step}
        compare={this.props.compare}
        precision={this.props.precision}
        disabled={this.props.disabled}
        rules={this.rules}
        form={this.props.form}
        validateStatus={this.props.validateStatus}
        errorMsg={this.props.errorMsg}
        onChange={this.props.onChange}
        handleKeyDown={this.props.handleKeyDown}
        handleKeyUp={this.props.handleKeyUp}
        handlePressEnter={this.props.handlePressEnter}
        handleOnBlur={this.props.handleOnBlur}
        className={this.props.className}
        isAutoFocus={this.props.isAutoFocus}
        isAutoSelect={this.props.isAutoSelect}
        isHideTool={this.props.isHideTool}/>
    );
  }   
}

Input.defaultProps = {
  name: "name",
  max: 9999999999,
  precision: 2,
  errorLength: "The number allow maximum 9999 999 999.",
  required: true,
  errorRequired: "Field required"
};

