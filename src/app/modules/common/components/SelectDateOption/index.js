import React from "react";
import {Select, DatePicker} from "antd";
import {Translate} from "react-localize-redux";
import moment from "moment";

const { RangePicker } = DatePicker;

export default function SelectDateOption(props) {
  const [showRangePicker, setShowRangePicker] = React.useState(false);

  const onSelectOption = (value) => {
    if (value === "modify") {
      setShowRangePicker(true);
    } else {
      setShowRangePicker(false);
    }
  }

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
      <Select.Option key="today" value="today"><Translate id="text_today" /></Select.Option>
      <Select.Option key="this-week" value="this-week"><Translate id="text_this_week" /></Select.Option>
      <Select.Option key="this-month" value="current-month"><Translate id="text_this_month" /></Select.Option>
      <Select.Option key="l-30-days" value="last-30-days"><Translate id="text_last_30_days" /></Select.Option>
      <Select.Option key="l-3-month" value="last-3-months"><Translate id="text_last_3_months" /></Select.Option>
      <Select.Option key="pre-quater" value="previous-quater"><Translate id="text_previous_quarter" /></Select.Option>
      <Select.Option key="l-12-month" value="last-12-months"><Translate id="text_last_12_months" /></Select.Option>
      <Select.Option key="pre-year" value="previous-year"><Translate id="text_previous_year" /></Select.Option>
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
    
  </div>
}