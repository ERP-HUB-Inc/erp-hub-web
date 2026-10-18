import React from "react";
import { Icon, InputNumber, Select, Tooltip } from "antd";
import { finiteNumber } from "./costChangesModel";

const presets = [0, 5, 10, 20, 50, -5, -10, -20, -50];
const labelFor = value => value < 0
  ? `Decrease ≥ ${Math.abs(value)}%`
  : `Increase ≥ ${value}%`;

export default function CostVarianceFilter({ value, onChange }) {
  const options = presets.includes(value) ? presets : [...presets, value];
  const groups = [
    { label: "Cost increases", values: options.filter(option => option >= 0) },
    { label: "Cost decreases", values: options.filter(option => option < 0) }
  ];

  const handleCustomChange = nextValue => {
    const parsed = finiteNumber(nextValue);
    if (parsed !== null) onChange(parsed);
  };

  return (
    <div className="cost-variance-filter">
      <Select
        aria-label="Cost change direction and percentage preset"
        value={value}
        onChange={onChange}
        dropdownClassName="cost-variance-preset-dropdown"
      >
        {groups.map(group => (
          <Select.OptGroup key={group.label} label={group.label}>
            {group.values.map(preset => (
              <Select.Option key={preset} value={preset}>{labelFor(preset)}</Select.Option>
            ))}
          </Select.OptGroup>
        ))}
      </Select>
      <InputNumber
        aria-label="Custom cost change percentage; negative for decreases"
        value={value}
        formatter={input => `${input}%`}
        parser={input => input.replace(/[^\d.\-]/g, "")}
        onChange={handleCustomChange}
      />
      <Tooltip title="Choose a preset or enter a custom percentage. Positive values select increases; negative values select decreases (for example, -10).">
        <Icon type="info-circle" tabIndex={0} aria-label="Positive percentages select increases; negative percentages select decreases" />
      </Tooltip>
    </div>
  );
}
