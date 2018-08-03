import React from "react";
import {  
  Label,
  FormGroup
} from "reactstrap";
import moment from "moment";
import Element, { Form } from "../../common/Element";
import "./index.css";
import { DatePicker } from "antd";

const dateFormat = "YYYY/MM/DD";

export class DatePic extends Element {
  
  render(){
    const { 
      label,
    } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <this.FormItem label={ label }>
        { 
          getFieldDecorator(this.props.name, {rules: this.props.rules, initialValue: this.props.data})(
            <DatePicker 
              defaultValue={moment(" " + this.props.defaultValue  , dateFormat)}
              format={ dateFormat }
            />  
          )
        }
      </this.FormItem>
    );
  }
}

DatePic.defaultProps = {
  name: "name",
  required: false
};

