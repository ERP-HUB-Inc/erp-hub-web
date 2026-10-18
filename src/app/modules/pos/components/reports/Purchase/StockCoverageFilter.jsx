import React from "react";
import { Icon, InputNumber, Select } from "antd";
import { finiteNumber } from "./costChangesModel";

const presets = [30, 60, 90, 180];

export default function StockCoverageFilter({ value, onChange }) {
  const options = presets.includes(value) ? presets : [...presets, value].sort((a, b) => a - b);

  const handleCustomChange = nextValue => {
    const parsed = finiteNumber(nextValue);
    if (parsed !== null && parsed >= 0) onChange(parsed);
  };

  return (
    <div className="stock-coverage-filter">
      <Select
        aria-label="Overstock coverage threshold preset"
        value={value}
        onChange={onChange}
        suffixIcon={<Icon type="hourglass" />}
      >
        {options.map(days => (
          <Select.Option key={days} value={days}>Overstock threshold: &gt;{days} days</Select.Option>
        ))}
      </Select>
      <InputNumber
        aria-label="Custom overstock threshold in days"
        min={0}
        value={value}
        formatter={input => `${input}d`}
        parser={input => input.replace(/[^\d.]/g, "")}
        onChange={handleCustomChange}
      />
    </div>
  );
}
