import React from "react";
import Input from "./input";
import Element from "../../common/Element";
import "./index.css";

export class InputText extends Element {
  render() {
    return (
      <Input
        suffix={this.props.suffix}
        type={ this.props.type }
        name={this.props.name}
        className={this.props.className}
        autoComplete={this.props.autoComplete}
        placeholder={this.props.placeholder}
        label={this.props.label}
        help={this.props.help}
        validateStatus={this.props.validateStatus}
        data={this.props.data}
        required={this.props.required}
        notation={this.props.notation}
        errorLenght={this.props.errorLenght}
        errorRequired={this.props.errorRequired}
        validator={this.props.validator}
        form={this.props.form}
        min={this.props.min}
        max={this.props.max}
        onChange={this.props.onChange}
        handleKeyDown={this.props.handleKeyDown}
        handleKeyUp={this.props.handleKeyUp}
        handlePressEnter={this.props.handlePressEnter}
        handleOnBlur={this.props.handleOnBlur}
        handleOnFocus={this.props.handleOnFocus}
        disabled= {this.props.disabled}
        isAutoFocus={this.props.isAutoFocus}
        didUpdateMakeAutoFocus={this.props.didUpdateMakeAutoFocus}/>
    );
  }   
}

Input.defaultProps = {
  max: 255,
  errorRequired: "Field required",
  errorLenght: "Over allow character lenght.",
  type: "text"
};

