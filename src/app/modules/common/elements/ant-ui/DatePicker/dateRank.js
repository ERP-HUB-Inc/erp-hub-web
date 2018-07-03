import React, { Component } from "react";
import {  
  Label,
  FormGroup
} from "reactstrap";
import { DatePicker,Form } from "antd";
import moment from "moment";

const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;

function onChange(dates, dateStrings) {
  console.log("From: ", dates[0], ", to: ", dates[1]);
  console.log("From: ", dateStrings[0], ", to: ", dateStrings[1]);
}

export class DateRank extends Component {
  render(){

    const { 
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
              ranges={{ Today: [moment(), moment()], "This Month": [moment(), moment().endOf("month")] }}
              onChange={onChange}
              validateStatus="error"
              help="Please select the correct date"
            />
          </FormItem>
        </FormGroup>
      </div>
    );
  }
}