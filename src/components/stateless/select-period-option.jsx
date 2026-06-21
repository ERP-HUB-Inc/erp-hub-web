import React from "react";
import {Select, DatePicker} from "antd";
import {Translate} from "react-localize-redux";
import moment from "moment";

const { RangePicker } = DatePicker;

const defaultOptions = [
  { label: <Translate id="text_today" />, value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: <Translate id="text_this_week" />, value: "this-week" },
  { label: <Translate id="text_last_week" />, value: "last-week" },
  { label: <Translate id="text_this_month" />, value: "this-month" },
  { label: "Current month", value: "current-month" },
  { label: <Translate id="text_last_month" />, value: "last-month" },
  { label: "Last 7 days", value: "last-7-day" },
  { label: <Translate id="text_last_30_days" />, value: "last-30-days" },
  { label: <Translate id="text_previous_quarter" />, value: "previous-quarter" },
  { label: <Translate id="text_this_year" />, value: "this-year" },
  { label: <Translate id="text_previous_year" />, value: "previous-year" },
  { label: <Translate id="text_last_12_months" />, value: "last-12-months" },
  { label: <Translate id="text_last_3_months" />, value: "last-3-months" },
];

export function SelectPeriodOption(props) {
  const [showRangePicker, setShowRangePicker] = React.useState(false);
  const options = props.options || defaultOptions;

  const onSelectOption = (value) => {
    if (value === "modify") {
      setShowRangePicker(true);
    } else {
      setShowRangePicker(false);
    }
  };

  return <div style={{display: "flex"}}>
    <Select
      name={props.name}
      defaultValue="today"
      value={props.value}
      style={props.style}
      className={props.className}
      id={props.id}
      onChange={props.onChange}
      onSelect={onSelectOption}
      placeholder={props.placeholder}
    >
      {options.map((option) => (
        <Select.Option key={option.value} value={option.value}>
          {option.label}
        </Select.Option>
      ))}
      {
        props.showSelectCustomDate ? <Select.Option key="custom" value="modify"><Translate id="text_custom" /></Select.Option> : null
      }
    </Select>
    {
      showRangePicker || props.value === "modify" ? 
        <RangePicker
          style={{width: 220}}
          format="DD/MM/YYYY"
          placeholder={["Start", "End"]}
          defaultValue={[moment(), moment()]}
          value={props.rangeValue}
          allowClear={props.allowClearDates}
          onChange={props.onChangeDate}
        />
      : null
    }
    
  </div>;
}
