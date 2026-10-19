import React from "react";
import { Tooltip } from "antd";
import "./logo-text-only.css";

export function LogoTextOnly({ collapsed = false }) {
  return (
    <div className={`market-sidebar-branding${collapsed ? " is-collapsed" : ""}`}>
      <Tooltip title={collapsed ? "MarketChain ERP" : undefined} placement="right">
        <div className="market-sidebar-brand" aria-label="MarketChain ERP">
          <img className="market-sidebar-brand-logo" src={collapsed ? "/marketchain-logo-only.png" : "/marketchain-logo.png"} alt="MarketChain ERP logo" />
        </div>
      </Tooltip>

    </div>
  );
}
