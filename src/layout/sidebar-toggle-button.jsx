import React from "react";
import { Tooltip } from "antd";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

export default function SidebarToggleButton({ collapsed, onToggle }) {
  const label = collapsed ? "Expand sidebar" : "Collapse sidebar";
  const ToggleIcon = collapsed ? PanelLeftOpen : PanelLeftClose;

  return (
    <Tooltip title={label} placement="bottom">
      <button
        type="button"
        className="market-header-icon-button market-sidebar-collapse-button"
        aria-label={label}
        aria-expanded={!collapsed}
        aria-controls="market-sidebar-navigation"
        onClick={onToggle}
      >
        <ToggleIcon size={18} strokeWidth={1.8} aria-hidden="true" />
      </button>
    </Tooltip>
  );
}
