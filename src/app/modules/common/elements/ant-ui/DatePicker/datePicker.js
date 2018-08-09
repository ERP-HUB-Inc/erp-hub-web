import React from "react";
// import {  
//   Label,
//   FormGroup
// } from "reactstrap";
import moment from "moment";
import Element from "../../common/Element";
import "./index.css";
import { DatePicker } from "antd";

const dateFormat = "YYYY/MM/DD";

export class DatePic extends Element {
  
  render(){
    const { 
      label,
      defaultValue
    } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <this.FormItem label={ label }>
        { 
          getFieldDecorator(this.props.name, {rules: this.props.rules }, { initialValue: this.props.defaultValue })(
            defaultValue != null ? 
              <DatePicker
                defaultValue={moment(" " + defaultValue , dateFormat)}
                // format={ dateFormat }
                disabled = { this.props.disabled }
              />  
              : <DatePicker disabled = { this.props.disabled } />
          )
        }
      </this.FormItem>
    );
  }
}

DatePic.defaultProps = {
  name: "name",
  required: false,
  disabled: false
};

