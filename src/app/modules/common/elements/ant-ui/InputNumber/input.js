import React from "react";
import Element from "../../common/Element";

export default class InputNumber extends Element {
  constructor(props) {
    super(props);
    this.state = {
      validateStatus: "success",
      errorMsg: null
    };
    this.errorMessage="";
    this.validatePrimeNumber = this.validatePrimeNumber.bind(this);
    this.handleNumberChange = this.handleNumberChange.bind(this);
    this.handleOnFocus = this.handleOnFocus.bind(this);
  }

  componentDidMount(){
    if (this.props.isAutoFocus) {
      this.nameInput.focus();
    }
  }

  handleNumberChange (value) {
    this.validatePrimeNumber(value);
    if (this.props.onChange != null) {
      this.props.onChange(value);
    }
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

  handleOnFocus(event) {
    if (this.props.isAutoSelect) {
      event.target.select();
    }
  }

  parserValue(value) {
    value = value.replace(/\$\s?|(,*)/g, "");
    value = value.replace("%", "");
    return value;
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <this.FormItem
        label={this.props.label}
        validateStatus={this.props.validateStatus}
        help={this.props.errorMsg}
      >
        {
          getFieldDecorator(this.props.name, {rules: this.props.rules, initialValue: this.props.data})(
            <this.InputNumber
              ref={(input) => { this.nameInput = input; }}
              // formatter={value => `${value}`.replace(this.props.formatter, ",")}
              // parser={value => this.parserValue(value)}
              placeholder={this.props.placeholder}
              disabled={this.props.disabled}
              step={this.props.step}
              inputmode="numeric"
              precision={this.props.precision}
              onChange={this.handleNumberChange}
              onKeyDown={this.props.handleKeyDown}
              onKeyUp={this.props.handleKeyUp}
              onBlur={this.props.handleOnBlur}
              onFocus={this.handleOnFocus}
              onPressEnter={this.props.handlePressEnter}
              className={`${this.props.isHideTool ? "hide-input-number-tool" : "" } ${this.props.className}`}
              help={this.errorMessage} />
          )
        } 
      </this.FormItem>
    );
  }
}

InputNumber.defaultProps = {
  data: 0.00,
  formatter: /\B(?=(\d{3})+(?!\d))/g,
  isUnsign: false,
  isHideTool: false
};

