import React from "react";
import { Dropdown, Button, Menu, Icon } from "antd";

const POStatusDropdown = ({ onSelect, selectedStatus, disabled }) => {
  const statusGroups = {
    active: [
      { name: "Mark as Ordered", value: "ORDERED" },
      { name: "Confirm Received", value: "RECEIVED" },
    ],
    inactive: [{ name: "Cancel Order", value: "CANCELLED" }],
  };

  const handleMenuClick = (e) => {
    const allStatuses = Object.values(statusGroups).flat();
    const selected = allStatuses.find((opt) => opt.value === e.key);
    if (onSelect) {
      onSelect(selected);
    }
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      {statusGroups.active.map((option) => (
        <Menu.Item key={option.value}>{option.name}</Menu.Item>
      ))}

      <Menu.Divider />

      {statusGroups.inactive.map((option) => (
        <Menu.Item key={option.value}>{option.name}</Menu.Item>
      ))}
    </Menu>
  );

  const allStatuses = Object.values(statusGroups).flat();
  const currentStatus = allStatuses.find((opt) => opt.value === selectedStatus);

  return (
    <Dropdown overlay={menu} disabled={disabled}>
      <Button type="primary" size="large">
        {currentStatus ? currentStatus.name : "Select Status"}{" "}
        <Icon type="down" />
      </Button>
    </Dropdown>
  );
};

export default POStatusDropdown;
