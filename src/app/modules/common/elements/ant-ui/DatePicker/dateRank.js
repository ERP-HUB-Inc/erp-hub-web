import React, { Component } from "react";
import {  
  Label,
  FormGroup
} from "reactstrap";
import "./datepicker.css"; 
import { DatePicker,Form } from "antd";

const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;

export class DateRank extends Component {
  render(){

    const { 
      input,
      placeholder,
      label,
      meta: { touched, error, warning }
    } = this.props;

    return (
      <div className="main-date-picker">
        <FormGroup>
          <Label>{ label }</Label>
          <FormItem
            validateStatus={ touched && error ? "error" : ""  }
            help = 
              {touched && 
               ((
                 error && <span>{error}</span> || warning && <span>{warning}</span>
               ))
              }
          >
            <RangePicker
              placeholder={ placeholder }
              {...input} 
            />
          </FormItem>
        </FormGroup>
      </div>
    );
  }
}