import React from "react";
import Element from "../../common/Element";

export default class InputNumber extends Element {
  constructor(props) {
    super(props);
    this.state = {
      validateStatus: "success",
      errorMsg: null
    };
    this.validatePrimeNumber = this.validatePrimeNumber.bind(this);
    this.handleNumberChange = this.handleNumberChange.bind(this);
  }
  handleNumberChange (value) {
    this.validatePrimeNumber(value);
  }

  validatePrimeNumber(number) {
    if (number > this.props.max) {
      this.setState({
        validateStatus: "error",
        errorMsg: this.props.errorLength
      });
    } else {
      this.setState({
        validateStatus: "success",
        errorMsg: null
      });
    }
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <this.FormItem
        label={this.props.label}
        validateStatus={this.state.validateStatus}
        help={this.state.errorMsg}
      >
        {
          getFieldDecorator(this.props.name, {rules: this.props.rules, initialValue: this.props.data})(
            <this.InputNumber
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              placeholder={this.props.placeholder}
              onChange={this.handleNumberChange}
              className={this.props.className}
            />
          )
        } 
      </this.FormItem>
    );
  }
}

InputNumber.defaultProps = {
  data: 0.00
};

