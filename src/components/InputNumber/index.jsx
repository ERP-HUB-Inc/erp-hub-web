import React from "react";
import { 
  Form, 
  InputNumber as AntdInputNumber, 
  Tooltip,
  Icon 
} from "antd";
import "./index.css";


export class InputNumber extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      validateStatus: "success",
      errorMsg: null
    };
    this.errorMessage = "";
    this.rules = [
      {
        required: this.props.required,
        validator: this.checkPrice
      }
    ];
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

  // Handles number input changes
  handleNumberChange = (value) => {
    this.validatePrimeNumber(value);

    if (this.props.onChange) {
      this.props.onChange(value);
    }
  };

  // Handles focus event for the input
  handleFocus = (event) => {
    const { isAutoSelect, handleOnFocus } = this.props;

    if (isAutoSelect) {
      event.target.select();
      event.target.setSelectionRange(0, 9999);
    }

    if (handleOnFocus) {
      handleOnFocus();
    }
  };

  // Parses a string value and removes formatting characters
  parseValue = (value) => {
    let parsed = value.replace(/\$\s?|(,*)/g, "");
    parsed = parsed.replace("%", "");
    return parsed;
  };

  // Validates the input value for pricing rules
  validatePrice = (rule, value, callback) => {
    let parsedValue = value;

    if (value === null || value === "") {
      parsedValue = 0;
    }

    if (parseFloat(parsedValue) <= 0 && this.props.required) {
      callback(this.props.errorRequired);
      return;
    }

    if (this.props.compare && parseFloat(value) > this.props.compare.value) {
      callback(this.props.compare.message);
      return;
    }

    callback();
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form.Item
        label={this.props.tooltip ? <React.Fragment>
          {this.props.label}
          {
            this.props.tooltip && 
            <Tooltip placement="right" title={this.props.tooltip}>
              <Icon type="question-circle" style={{ marginLeft: 8, color: "#888" }} />
            </Tooltip>
          }
          </React.Fragment> : this.props.label}
        validateStatus={this.props.validateStatus}
        hasFeedback={!!this.props.data}
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
              onFocus={this.handleFocus}
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
  name: "name",
  max: 9999999999,
  precision: 2,
  errorLength: "The number allow maximum 9999 999 999.",
  required: false,
  isAutoSelect: true,
  data: 0.00,
  formatter: /\B(?=(\d{3})+(?!\d))/g,
  isUnsign: false,
  isHideTool: false,
  errorRequired: "Field required"
};

