import React from "react";
import ReactDOM from "react-dom";
import { act, Simulate } from "react-dom/test-utils";
import RemoteRecordSelect from "./RemoteRecordSelect";
import LocationService from "../../services/LocationService";
import VendorService from "../../services/VendorService";

jest.mock("../../helper/util", () => jest.fn().mockImplementation(() => ({})));
jest.mock("../../app/modules/common/util", () => jest.fn().mockImplementation(() => ({})));
jest.mock("antd", () => {
  const React = require("react");
  const Select = ({ children, value, onChange, onSearch, dropdownRender, loading }) => {
    const menu = <select aria-label="Record" value={value == null ? "" : value} onChange={event => onChange(event.target.value)}>{children}</select>;
    return <div>
      <input aria-label="Search" onChange={event => onSearch(event.target.value)} />
      <button onClick={() => onChange(undefined)}>Clear</button>
      {loading && <span>Loading options</span>}
      {dropdownRender(menu)}
    </div>;
  };
  Select.Option = ({ value, children }) => <option value={value}>{children}</option>;
  return { Select, Button: ({ children, onClick }) => <button onClick={onClick}>{children}</button> };
});

const enabled = Boolean(process.env.REPORT_RECORDS_SIM_URL);
const integration = enabled ? describe : describe.skip;

integration("remote record filters against the local HTTP simulation", () => {
  let container;
  const waitFor = async assertion => {
    const deadline = Date.now() + 4000;
    while (true) {
      try { assertion(); return; } catch (error) {
        if (Date.now() >= deadline) throw error;
        await act(async () => { await new Promise(resolve => setTimeout(resolve, 30)); });
      }
    }
  };
  const search = value => act(() => Simulate.change(container.querySelector("input"), { target: { value } }));
  const render = (service, props = {}) => act(() => { ReactDOM.render(
    <RemoteRecordSelect service={service} limit={20} allValue="" allLabel="All records" value="" {...props} />, container
  ); });

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    LocationService.baseUrl = `${process.env.REPORT_RECORDS_SIM_URL}/locations`;
    VendorService.baseUrl = `${process.env.REPORT_RECORDS_SIM_URL}/vendors`;
  });
  afterEach(() => {
    act(() => { ReactDOM.unmountComponentAtNode(container); });
    container.remove();
  });

  test.each([LocationService, VendorService])("finds records outside the initial page, retains their label, and clears", async service => {
    const onChange = jest.fn();
    render(service, { onChange });
    await waitFor(() => expect(container.textContent).toContain("Initial"));
    search("Remote");
    await waitFor(() => expect(container.textContent).toContain("Remote"));
    expect(container.querySelector("option[value='99']")).not.toBeNull();
    act(() => Simulate.change(container.querySelector("select"), { target: { value: "99" } }));
    expect(onChange).toHaveBeenCalledWith("99");
    render(service, { value: "99", onChange });
    search("missing");
    await waitFor(() => expect(container.textContent).not.toContain("Loading options"));
    expect(container.querySelector("option[value='99']").textContent).toContain("Remote");
    act(() => Simulate.click(container.querySelector("button")));
    expect(onChange).toHaveBeenCalledWith(undefined);
  });

  test("hydrates a URL-restored selection outside the initial page", async () => {
    render(LocationService, { value: "42" });
    await waitFor(() => expect(container.querySelector("option[value='42']").textContent).toBe("Restored Store"));
    expect(container.querySelector("select").value).toBe("42");
  });

  test("shows a recoverable error and searches again after failure", async () => {
    render(VendorService);
    await waitFor(() => expect(container.textContent).toContain("Initial"));
    search("failure");
    await waitFor(() => expect(container.textContent).toContain("Unable to load options"));
    expect(container.textContent).toContain("Retry");
    search("Recovered");
    await waitFor(() => expect(container.textContent).toContain("Recovered"));
    expect(container.querySelector("[role='alert']")).toBeNull();
  });

  test("discards a slower response after a newer search completes", async () => {
    render(LocationService);
    await waitFor(() => expect(container.textContent).toContain("Initial"));
    search("slow");
    await act(async () => { await new Promise(resolve => setTimeout(resolve, 450)); });
    search("Latest");
    await waitFor(() => expect(container.textContent).toContain("Latest"));
    await act(async () => { await new Promise(resolve => setTimeout(resolve, 400)); });
    expect(container.textContent).not.toContain("slow Store");
    expect(container.textContent).toContain("Latest Store");
  });
});
