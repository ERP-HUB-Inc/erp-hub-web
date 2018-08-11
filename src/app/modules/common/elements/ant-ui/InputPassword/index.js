import React from "react";
import Current from "./current";
import Password from "./password";
import Confirm from "./confirm";
import Element from "../../common/Element";
import "./index.css";

export  class InputPassword extends Element {
  constructor(props) {
    super(props);
    this.state = {
      confirmDirty: false
    };
    this.validateClassStatusCurrentPWD = "";
    this.errorMessageCurrentPWD = "";
    this.isUserInputCurrentPWD = false;

    this.makePasswordToRequired = this.makePasswordToRequired.bind(this);
    this.validateToNextPassword = this.validateToNextPassword.bind(this);
    this.compareToFirstPassword = this.compareToFirstPassword.bind(this);
    this.handleConfirmBlur = this.handleConfirmBlur.bind(this);
  }

  makePasswordToRequired(e) {
    const form = this.props.form;
    if (e.target.value.trim().length > 0) {
      this.isUserInputCurrentPWD = true;
    } else {
      this.isUserInputCurrentPWD = false;
      form.resetFields([this.props.currentPWDName, "password", "confirm"]);
    }
  }

  validateToNextPassword (rule, value, callback) {
    if (this.props.checkConfirm) {
      const form = this.props.form;
      if (value && this.state.confirmDirty) {
        form.validateFields(["confirm"], { force: true });
      }
    }
    callback();
  }

  compareToFirstPassword (rule, value, callback) {
    const form = this.props.form;
    if (value && value !== form.getFieldValue("password")) {
      callback(this.props.messageIsMatchPassword);
    } else {
      callback();
    }
  }

  handleConfirmBlur (e) {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    let {required} = this.props;

    // ALLOW IT PROCESS WHEN ONLY CURRENT PASSWORD DISPLAY
    if (this.props.requiredCurrentPWD) {
      // CHECK IF USER INPUT CURRENT PASSWORD AND THEN MAKE PASSWORD REQUIRE
      if (this.isUserInputCurrentPWD) {
        required = true;
      } else {
        required = false;
      }
    }

    // HANDLE CHECK MESSAGE BACK FROM API WITH CURRENT PASSWORD CHECKING
    this.validateClassStatusCurrentPWD = this.props.validateClassStatusCurrentPWD;
    this.errorMessageCurrentPWD = this.props.errorMessageCurrentPWD;

    return (
      <div>
        <div className={this.validateClassStatusCurrentPWD}>
          {
            this.props.requiredCurrentPWD ?
              <Current
                name={this.props.currentPWDName}
                type="password"
                getFieldDecorator={getFieldDecorator}
                validateToNextPassword={this.validateToNextPassword}
                placeholder={this.props.currentPWDPlaceholder}
                label={this.props.currentPWDLabel}
                required={this.props.required}
                validateStatus={this.validateClassStatusCurrentPWD}
                help={this.errorMessageCurrentPWD}
                errorRequired={this.props.errorRequiredCurrentPWD}
                isUserInputCurrentPWD={this.isUserInputCurrentPWD}
                handleMakePasswordToRequired={this.makePasswordToRequired}
              />
              :
              ""
          }
        </div>
        <Password
          name="password"
          type="password"
          getFieldDecorator={getFieldDecorator}
          validateToNextPassword={this.validateToNextPassword}
          placeholder={this.props.placeholder}
          label={this.props.label}
          required={required}
          errorRequired={this.props.errorRequired}
        />
        { 
          this.props.checkConfirm ?
            <Confirm 
              name="confirm"
              type="password"
              getFieldDecorator={getFieldDecorator}
              compareToFirstPassword={this.compareToFirstPassword}
              handleConfirmBlur={this.handleConfirmBlur}
              placeholder={this.props.confirmPlaceholder}
              label={this.props.confirmLabel}
              required={required}
              errorRequired={this.props.errorRequiredConfirm}
            />
            :
            ""
        }
      </div>
    );
  }   
}

InputPassword.defaultProps = {
  min: 8,
  max: 255,
  checkConfirm: true,
  requiredCurrentPWD: false,
  messageIsMatchPassword: "Two passwords that you enter is inconsistent."
};



