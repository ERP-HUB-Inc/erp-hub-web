import React, { Component } from "react";
import { DatePicker } from "antd";
import moment from "moment";
import { Label } from "reactstrap";
const RangePicker = DatePicker.RangePicker;

function onChange(dates, dateStrings) {
  console.log("From: ", dates[0], ", to: ", dates[1]);
  console.log("From: ", dateStrings[0], ", to: ", dateStrings[1]);
}

export class DateRank extends Component {
  render(){
    return (
      <div className="main-date-picker">
        <RangePicker
          ranges={{ Today: [moment(), moment()], "This Month": [moment(), moment().endOf("month")] }}
          onChange={onChange}
          placeholder=""
        />
        {/* <Label>User</Label> */}
      </div>
    );
  }
}