import React from "react";
import moment from "moment";
import {DatePicker} from "antd";
import Element from "../../common/Element";
import "./index.css";
export class DateRangePicker extends Element {
  render(){
    const {getFieldDecorator} = this.props.form;
    return (
      <this.FormItem label={this.props.label}>
        { 
          getFieldDecorator(this.props.name, {rules: [
            {
              required: this.props.required,
              message: this.props.errorRequired
            },
            { type: "array" }
          ], initialValue: this.props.defaultValue})(
            <DatePicker.RangePicker
              ranges={{ 
                "Last Week": [moment().subtract(1, "week").startOf("isoWeek"), moment().subtract(1, "week").endOf("isoWeek")],
                "This Week": [moment().startOf("isoWeek"), moment().endOf("isoWeek")],
                "Before Last Month":  [moment().subtract(1, "months").startOf("month")],
                "Last Month": [moment().subtract(1, "month").startOf("month"), moment().subtract(1, "month").endOf("month")],
                "This Month": [moment().startOf("month"), moment().endOf("month")],
                Today: [moment(), moment()]
              }}
              format={this.props.dateFormat}
              onChange={this.props.onChange}
              disabled={this.props.disabled} />
          )
        }
      </this.FormItem>
    );
  }
}

DateRangePicker.defaultProps = {
  name: "name",
  dateFormat: "DD MMM YYYY",
  required: false
};

