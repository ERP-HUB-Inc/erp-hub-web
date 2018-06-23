
import React, { Component } from "react";
import {  
  FormGroup,
  Input,
  Label,
  FormText,
} from "reactstrap";

export class InputRedux extends Component {

  render() {
    const {
      input: { onChange, onFocus, onBlur },
      label,
      required,
      placeholder,
      type,
      meta: {
        touched, error, warning, valid
      }
    } = this.props;

    return (
      <FormGroup>
        <Label>{label} <span className="text-danger"> {required} </span></Label>
        <Input
          type={type}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={placeholder}
          valid={ touched && error ? false : null }
          // value={ value }
        />
        {touched &&
          ((error && <FormText className="select-error"> {error} </FormText>) ||
            (warning && <FormText className="select-error"> {warning} </FormText>))}
      </FormGroup>
    );

  }

}
