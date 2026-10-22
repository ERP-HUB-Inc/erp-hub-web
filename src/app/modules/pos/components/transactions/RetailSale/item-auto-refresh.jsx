import React, { useEffect, useState } from "react";
import { Select } from "antd";

export default function ItemAutoRefresh({ onRefresh }) {
  const [intervalSeconds, setIntervalSeconds] = useState(0);

  useEffect(() => {
    if (!intervalSeconds) return;

    const timer = setInterval(onRefresh, intervalSeconds * 1000);
    return () => clearInterval(timer);
  }, [intervalSeconds, onRefresh]);

  return (
    <Select
      aria-label="Stock auto-refresh interval"
      value={intervalSeconds}
      onChange={setIntervalSeconds}
      style={{ width: 155 }}
    >
      <Select.Option value={0}>Stock refresh: Off</Select.Option>
      <Select.Option value={10}>Stock refresh: 10s</Select.Option>
      <Select.Option value={15}>Stock refresh: 15s</Select.Option>
      <Select.Option value={20}>Stock refresh: 20s</Select.Option>
    </Select>
  );
}
