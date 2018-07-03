
import React, { Component } from "react";
import PropTypes from "prop-types";
import {  
  FormGroup,
  Label
} from "reactstrap";
import { Form, Input } from "antd";

const FormItem = Form.Item;

export class SapleInput extends Component {

  constructor(props) {
    super(props);
    this.state = {
      validateStatus: "",
      success:""
    };
  }

  render() {
    const {
      input: { value, onChange, onFocus, onBlur },
      label,
      required,
      placeholder,
      meta: {
        touched, error, warning, validateStatus, valid
      }
    } = this.props;
    console.log("valid" + !(touched && valid));
    return (
      <div className="main-input">
        <FormGroup>
          <Label>
            {label} <span className="text-danger"> {required} </span>
          </Label>
          <FormItem
            hasFeedback
            validateStatus={ touched && error ? "warning" : "success"  }
          >
            <Input placeholder={ placeholder } />
          </FormItem>
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
