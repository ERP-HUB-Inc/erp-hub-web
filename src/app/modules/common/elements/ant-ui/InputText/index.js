import React from "react";
import Input from "./input";
import "./index.css";


export function InputText(props) {
  return <Input
    suffix={props.suffix}
    type={ props.type }
    name={props.name}
    className={props.className}
    autoComplete={props.autoComplete}
    placeholder={props.placeholder}
    label={props.label}
    help={props.help}
    validateStatus={props.validateStatus}
    data={props.data}
    required={props.required}
    notation={props.notation}
    errorLenght={props.errorLenght}
    errorRequired={props.errorRequired}
    validator={props.validator}
    form={props.form}
    min={props.min}
    max={props.max}
    onChange={props.onChange}
    handleKeyDown={props.handleKeyDown}
    handleKeyUp={props.handleKeyUp}
    handlePressEnter={props.handlePressEnter}
    handleOnBlur={props.handleOnBlur}
    handleOnFocus={props.handleOnFocus}
    disabled= {props.disabled}
    isAutoFocus={props.isAutoFocus}
    allowClear={props.allowClear}
    didUpdateMakeAutoFocus={props.didUpdateMakeAutoFocus}/>;
}

Input.defaultProps = {
  max: 255,
  errorRequired: "Field required",
  errorLenght: "Over allow character lenght.",
  type: "text"
};

