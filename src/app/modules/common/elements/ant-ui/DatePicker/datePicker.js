import React from "react";
import {  
  Label,
  FormGroup
} from "reactstrap";
import Element, { Form } from "../../common/Element";
import "./index.css";
import { DatePicker } from "antd";

function onChange(date, dateString) {
  console.log(date, dateString);
}

export class DatePic extends Element {
  render(){
    const { 
      input,
      placeholder,
      label
    } = this.props;
    return (
      <this.FormItem label={ label }>
        <DatePicker onChange={onChange} { ...input }/>
      </this.FormItem>
    );
  }
}