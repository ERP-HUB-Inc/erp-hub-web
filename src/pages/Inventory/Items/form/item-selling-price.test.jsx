import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
import ItemSellingPrice from "./item-selling-price";

let container;
const currency = value => `${value < 0 ? "-" : ""}$${Math.abs(value).toFixed(2)}`;
beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});
afterEach(() => {
  act(() => { ReactDOM.unmountComponentAtNode(container); });
  container.remove();
});

test.each([
  [11, 8, "$11.00", "+37.5% ($3.00)", "positive"],
  [5, 8, "$5.00", "-$3.00 Loss", "negative"],
  [8, 450, "$8.00", "-$442.00 Loss", "negative"],
  [8, 8, "$8.00", "0.0% ($0.00)", "neutral"],
  [8, 0, "$8.00", "— ($8.00)", "positive"],
  [0, 8, "$0.00", "-$8.00 Loss", "negative"],
  [11, null, "$11.00", "Margin unavailable", "neutral"],
  [11, "", "$11.00", "Margin unavailable", "neutral"],
  [null, 8, "—", "Margin unavailable", "neutral"],
  ["11", "8", "$11.00", "+37.5% ($3.00)", "positive"]
])("displays price %p and cost %p without inventing a margin", (price, cost, priceText, marginText, tone) => {
  act(() => { ReactDOM.render(<ItemSellingPrice price={price} cost={cost} formatCurrency={currency} enableInventoryTracking={true} />, container); });
  expect(container.querySelector(".ant-typography").textContent).toBe(priceText);
  const margin = container.querySelector(".item-selling-price-margin");
  expect(margin.textContent).toBe(marginText);
  expect(margin.className).toContain(`margin-${tone}`);
});

test.each([false, undefined, null])("shows only the selling price when inventory tracking is %p", enableInventoryTracking => {
  act(() => { ReactDOM.render(<ItemSellingPrice price={11} cost={8} formatCurrency={currency} enableInventoryTracking={enableInventoryTracking} />, container); });
  expect(container.querySelector(".ant-typography").textContent).toBe("$11.00");
  expect(container.querySelector(".item-selling-price-margin")).toBeNull();
});
