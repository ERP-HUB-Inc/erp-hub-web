import React from "react";
import ReactDOM from "react-dom";
import { act, Simulate } from "react-dom/test-utils";
import Login from "./login";
import ClientService from "../app/modules/common/services/ClientService";

jest.mock("react-router-dom", () => ({ withRouter: component => component }));
jest.mock("i18next", () => ({ t: key => key }));
jest.mock("lucide-react", () => ({
  ArrowRight: () => null, AtSign: () => null, Building2: () => null,
  Circle: () => null, KeyRound: () => null, ShieldCheck: () => null,
}));
jest.mock("./signin.css", () => ({}));
jest.mock("../app/modules/common/services/ClientService", () => ({ signin: jest.fn() }));

let container;

beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  act(() => { ReactDOM.unmountComponentAtNode(container); });
  container.remove();
});

test.each([null, "previous-store"])("uses the hidden default store when the saved identifier is %s", async savedStore => {
  if (savedStore) localStorage.setItem("PRIVATE_URL", savedStore);
  ClientService.signin.mockResolvedValue({ data: {} });

  act(() => { ReactDOM.render(<Login history={{ push: jest.fn() }} />, container); });

  const store = container.querySelector("input[id$='_privateURL']");
  const email = container.querySelector("input[autocomplete='username']");
  const password = container.querySelector("input[autocomplete='current-password']");
  expect(store.value).toBe("default");
  expect(store.closest(".ant-form-item").style.display).toBe("none");
  expect(document.activeElement).toBe(email);

  act(() => {
    Simulate.change(email, { target: { value: "user@example.test" } });
    Simulate.change(password, { target: { value: "test-password" } });
  });
  await act(async () => {
    Simulate.submit(container.querySelector("form"));
  });

  expect(ClientService.signin).toHaveBeenCalledWith("user@example.test", "test-password", "default");
  expect(localStorage.getItem("PRIVATE_URL")).toBe("default");
});
