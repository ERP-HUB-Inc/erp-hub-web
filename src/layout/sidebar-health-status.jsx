import React from "react";
import { Tooltip } from "antd";
import HealthService from "../services/HealthService";

const labels = {
  checking: "Checking…",
  operational: "Operational",
  unavailable: "Unavailable",
  unknown: "Unknown"
};

export default function SidebarHealthStatus({ collapsed = false }) {
  const [status, setStatus] = React.useState("checking");

  React.useEffect(() => {
    let mounted = true;
    let timer;
    let controller;
    const check = async () => {
      controller = typeof AbortController !== "undefined" ? new AbortController() : null;
      try {
        const response = await HealthService.getStatus({ signal: controller ? controller.signal : undefined });
        if (mounted) {
          setStatus(response.data && response.data.status === "ok" ? "operational" : "unknown");
        }
      } catch (error) {
        if (mounted) setStatus("unavailable");
      } finally {
        // Schedule after completion so slow probes cannot overlap.
        if (mounted) timer = setTimeout(check, 30000);
      }
    };
    check();
    return () => {
      mounted = false;
      clearTimeout(timer);
      if (controller) controller.abort();
    };
  }, []);

  const text = `Status: ${labels[status]}`;
  return (
    <Tooltip title={collapsed ? text : undefined} placement="right">
      <div className={`market-sidebar-status is-${status}`} role="status" aria-live="polite" aria-label={text}>
        {!collapsed && <span>{text}</span>}
        <span className="market-sidebar-status-dot" aria-hidden="true" />
      </div>
    </Tooltip>
  );
}
