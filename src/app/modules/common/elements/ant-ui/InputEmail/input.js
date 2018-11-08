import React from "react";
import Element from "../../common/Element";

export default class InputEmail extends Element {
  constructor(props) {
    super(props);
    this.handleOnFocus = this.handleOnFocus.bind(this);
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

  handleOnFocus(event) {
    if (this.props.isAutoSelect) {
      event.target.select();
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <this.FormItem
        label={this.props.label}
        help={this.props.help}
        validateStatus={this.props.validateStatus}
        className={this.props.className}>
        {
          getFieldDecorator(this.props.name, {rules: [
            {
              type: "email",
              message: this.props.errorInvalid
            },
            {
              required: this.props.required,
              message: this.props.errorRequired
            },
            {
              min: this.props.min,
              message: this.props.errorLenght
            },
            {
              max: this.props.max,
              message: this.props.errorLenght
            },
            {
              validator: this.props.validator
            }
          ],initialValue: this.props.data})(
            <this.Input
              ref={(input) => { this.nameInput = input; }}
              type={this.props.type}
              placeholder={this.props.placeholder}
              onKeyDown={this.props.handleKeyDown}
              onFocus={this.handleOnFocus}/>
          )
        }
      </this.FormItem>
    );
  }
}

InputEmail.defaultProps = {
  name: "email",
  type: "text",
  required: false
};
