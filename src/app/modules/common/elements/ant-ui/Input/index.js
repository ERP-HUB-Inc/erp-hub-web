
import React, { Component } from "react";
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
      input, 
      label,
      type,
      meta: { touched, error, warning },
      placeholder
    } = this.props;
    return (
      <div>
        <FormGroup>
          <Label>
            { label }
          </Label>
          <FormItem
            hasFeedback
            validateStatus={ touched && error ? "error" : ""  }
            help = 
              {touched && 
                ((
                  error && <span>{error}</span> || warning && <span>{warning}</span>
                ))
              }
          >
            <Input 
              {...input} 
              placeholder={ placeholder } 
              type={ type } 
            />
          </FormItem>
        </FormGroup>
      </div>
    );

  }

}
