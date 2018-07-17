
import React, { Component } from "react";
import PropTypes from "prop-types";
import {  
  FormGroup,
  Input,
  Label,
  FormText,
} from "reactstrap";

export class SapleInput extends Component {

  constructor(props) {
    super(props);
    this.state = {
      valid: false
    };
  }

  render() {
    const {
      input: { value, onChange, onFocus, onBlur },
      label,
      required,
      placeholder,
      type,
      meta: {
        touched, error, warning
      }
    } = this.props;
    return (
      <div>
        <FormGroup>
          <Label>{label} <span> {required} </span></Label>
          <Input
            type={type}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            placeholder={placeholder}
            valid={ touched && error ? false : null }
            value={ value }
          />
          {touched &&
        ((error && <FormText className="select-error"> {error} </FormText>) ||
          (warning && <FormText className="select-error"> {warning} </FormText>))}
        </FormGroup>
      </div>
    );

  }

}

SapleInput.propTypes = {
  type: PropTypes.string,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  input: PropTypes.any,
  required: PropTypes.string,
  meta: PropTypes.any,
  values: PropTypes.string
};
