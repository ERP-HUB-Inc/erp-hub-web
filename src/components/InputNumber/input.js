import React from "react";
import { Form, InputNumber as AntdInputNumber, Tooltip, Icon } from "antd";

export default class InputNumber extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      validateStatus: "success",
      errorMsg: null
    };
    this.errorMessage="";
  }

  componentDidMount(){
    if (this.props.isAutoFocus) {
      this.nameInput.focus();
    }
  }

  componentDidUpdate() {
    if (this.props.isAutoFocus && this.props.didUpdateMakeAutoFocus) {
      this.nameInput.focus();
    }
  }

  handleNumberChange = (value) => {
    this.validatePrimeNumber(value);
    if (this.props.onChange != null) {
      this.props.onChange(value);
    }
  }

  validatePrimeNumber = (number) => {
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

  handleOnFocus = (event) => {
    if (this.props.isAutoSelect) {
      event.target.select();
      event.target.setSelectionRange(0, 9999);
    }

    if (this.props.handleOnFocus) {
      this.props.handleOnFocus();
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
      <Form.Item
        label={<React.Fragment>
          {this.props.label}
          {
            this.props.tooltip && 
            <Tooltip placement="right" title={this.props.tooltip}>
              <Icon type="question-circle" style={{ marginLeft: 8, color: "#888" }} />
            </Tooltip>
          }
          </React.Fragment>
        }
        validateStatus={this.props.validateStatus}
        help={this.props.errorMsg}
        style={this.props.style}
      >
        {
          getFieldDecorator(this.props.name, {rules: this.props.rules, initialValue: this.props.data})(
            <AntdInputNumber
              ref={(input) => { this.nameInput = input; }}
              placeholder={this.props.placeholder}
              disabled={this.props.disabled}
              min={this.props.min}
              max={this.props.max}
              step={this.props.step}
              precision={this.props.precision}
              onChange={this.handleNumberChange}
              onKeyDown={this.props.handleKeyDown}
              onKeyUp={this.props.handleKeyUp}
              onBlur={this.props.handleOnBlur}
              onFocus={this.handleOnFocus}
              style={this.props.inputStyle}
              parser={this.props.parser}
              onPressEnter={this.props.handlePressEnter}
              className={`${this.props.isHideTool ? "hide-input-number-tool" : "" } ${this.props.className}`}
              help={this.errorMessage} />
          )
        } 
      </Form.Item>
    );
  }
}

InputNumber.defaultProps = {
  data: 0.00,
  formatter: /\B(?=(\d{3})+(?!\d))/g,
  isUnsign: false,
  isHideTool: false
};

