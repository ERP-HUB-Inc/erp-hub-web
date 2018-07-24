import React, { Component } from "react";
import { Label } from "reactstrap";
import { Select,Form } from "antd";
const FormItem = Form.Item;

export class Selects extends Component{

  constructor(props) {
    super(props);
    this.state = {
      focus: "",
      value: ""
    };
  }

  render(){
    const {
      input,
      label,
      required,
      children,
      placeholder,
      defaultValue
    } = this.props;
    const { focus } = this.state;
    return(
      <div className="main-antselect">
        <Label className={ focus }>
          {label} 
          <span className="text-danger"> {required} </span>
        </Label>
        <FormItem>
          <Select
            style={{ width: "100%" }}
            placeholder={ placeholder }
            defaultValue={ defaultValue }
            {...input}
          >
            { children } 
          </Select>
        </FormItem>
      </div>
    );
  }
} 
