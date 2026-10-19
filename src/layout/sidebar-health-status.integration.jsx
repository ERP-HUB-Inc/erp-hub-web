import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
import SidebarHealthStatus from "./sidebar-health-status";
import HealthService from "../services/HealthService";

jest.mock("../app/modules/common/util", () => jest.fn().mockImplementation(() => ({})));
jest.mock("antd", () => ({ Tooltip: ({ children }) => children }));

const integration = process.env.SIDEBAR_HEALTH_SIM_URL ? describe : describe.skip;

integration("sidebar health over HTTP", () => {
  let container;
  const render = props => act(() => { ReactDOM.render(<SidebarHealthStatus {...props} />, container); });
  const waitForLabel = async label => {
    const deadline = Date.now() + 3000;
    while (container.querySelector("[role='status']").getAttribute("aria-label") !== label) {
      if (Date.now() > deadline) throw new Error(`Expected ${label}, received ${container.textContent}`);
      await act(async () => { await new Promise(resolve => setTimeout(resolve, 20)); });
    }
  };

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    HealthService.baseUrl = process.env.SIDEBAR_HEALTH_SIM_URL;
  });
  afterEach(() => {
    act(() => { ReactDOM.unmountComponentAtNode(container); });
    container.remove();
    jest.useRealTimers();
  });

  test("shows Operational only after the confirmed status response, including collapsed accessibility", async () => {
    render();
    expect(container.textContent).toBe("Status: Checking…");
    await waitForLabel("Status: Operational");
    expect(container.textContent).toBe("Status: Operational");
    render({ collapsed: true });
    expect(container.querySelector("[role='status']").getAttribute("aria-label")).toBe("Status: Operational");
    expect(container.textContent).toBe("");
  });

  test("unrecognized payloads remain Unknown rather than claiming health", async () => {
    HealthService.baseUrl += "/unknown";
    render();
    await waitForLabel("Status: Unknown");
  });

  test("a failed health request is visible as Unavailable", async () => {
    HealthService.baseUrl += "/failure";
    render();
    await waitForLabel("Status: Unavailable");
  });

  test("refreshes after 30 seconds and replaces stale Operational status", async () => {
    const originalSetTimeout = global.setTimeout;
    const scheduled = [];
    // Advance only the polling interval; HTTP and request timeouts stay real.
    const timerSpy = jest.spyOn(global, "setTimeout").mockImplementation((callback, delay, ...args) => {
      const id = originalSetTimeout(callback, delay, ...args);
      if (delay === 30000) scheduled.push({ callback, id });
      return id;
    });
    try {
      render();
      await waitForLabel("Status: Operational");
      expect(scheduled).toHaveLength(1);
      HealthService.baseUrl += "/failure";
      clearTimeout(scheduled[0].id);
      act(() => { scheduled[0].callback(); });
      await waitForLabel("Status: Unavailable");
    } finally {
      timerSpy.mockRestore();
    }
  });

  test("transport timeout prevents a slow health check from hanging", async () => {
    HealthService.baseUrl += "/slow";
    await expect(HealthService.getStatus({ timeout: 40 })).rejects.toMatchObject({ code: "ECONNABORTED" });
  });
});
