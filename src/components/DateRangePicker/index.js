import React from "react";
import moment from "moment";
import { DatePicker, Form } from "antd";
import "./index.css";

export class DateRangePicker extends React.Component {
  render(){
    const {getFieldDecorator} = this.props.form;
    return (
      <Form.Item label={this.props.label} style={this.props.style}>
        { 
          getFieldDecorator(this.props.name, {rules: [
            {
              required: this.props.required,
              message: this.props.errorRequired
            },
            { type: "array" }
          ], initialValue: this.props.defaultValue})(
            <DatePicker.RangePicker
              ranges={this.props.ranges}
              placeholder={this.props.placeholder}
              format={this.props.dateFormat}
              onChange={this.props.onChange}
              showTime={this.props.showTime}
              disabled={this.props.disabled} />
          )
        }
      </Form.Item>
    );
  }
}

DateRangePicker.defaultProps = {
  name: "name",
  dateFormat: "DD MMM YYYY",
  required: false,
  ranges: { 
    "Last Week": [moment().subtract(1, "week").startOf("isoWeek"), moment().subtract(1, "week").endOf("isoWeek")],
    "This Week": [moment().startOf("isoWeek"), moment().endOf("isoWeek")],
    "Before Last Month":  [moment().subtract(1, "months").startOf("month")],
    "Last Month": [moment().subtract(1, "month").startOf("month"), moment().subtract(1, "month").endOf("month")],
    "This Month": [moment().startOf("month"), moment().endOf("month")],
    Today: [moment(), moment()]
  }
};

