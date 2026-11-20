import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import PaymentScreen from "./payment";

jest.mock("@services/RetailSaleService", () => ({}));
jest.mock("../../../../common/actions/general", () => ({}));
jest.mock("../../../action/transaction/transaction", () => ({}));
jest.mock("../../../../common/components/shares/Modal", () => require("react").Component);
jest.mock("./receipt.new", () => () => null);
jest.mock("./payment.css", () => ({}));
jest.mock("@helper/sales", () => ({
  generateQuickCashSuggestions: () => [],
  generateQuickCashSuggestionsUSD: () => []
}));
jest.mock("@helper/index", () => ({
  convertUSDToKHR: (value, rate) => value * rate,
  convertKHRToUSD: (value, rate) => value / rate
}));
jest.mock("../../../utils", () => ({
  getTotalAmountAfterDiscount: (quantity, price) => quantity * price
}));

const findTable = node => {
  if (!React.isValidElement(node)) return null;
  if (node.type === "table") return node;
  return React.Children.toArray(node.props.children).map(findTable).find(Boolean);
};

const renderItem = item => {
  const screen = {
    props: {
      orderItems: [{ itemName: "T-shirt", quantity: 2, price: 5, ...item }],
      customerFieldPrice: "price",
      form: { getFieldValue: () => 0, getFieldDecorator: () => input => input },
      exchangeRate: { sellRate: 4000, buyRate: 4000 },
      summaryTotal: { summaryTotal: { subTotal: 10 }, discountAmount: 0, taxAmount: 0 },
      summaryTax: {},
      transaction: {},
    },
    state: { tenderInputFocus: "KHR" },
    Util: { getSetting: () => ({}) },
    formatCurrency: ({ value }) => `$${value.toFixed(2)}`,
    getGrandTotal: () => 10,
    getTotalTenderUSD: () => 0,
    getTotalTenderKHR: () => 0,
    getChangeAmountInKHR: () => 0,
    isTenderValid: () => true,
  };
  const container = document.createElement("div");
  container.innerHTML = renderToStaticMarkup(findTable(PaymentScreen.prototype.render.call(screen)));
  return container.querySelector("tbody tr");
};

test.each([{ sku: "SHIRT-RED-M" }, { code: "SHIRT-01" }, {}])(
  "shows the variant alongside the item name when identifiers are %o",
  identifiers => {
    const row = renderItem({ ...identifiers, variantName: "Red / Medium" });
    expect(row.cells[0].querySelector("strong").textContent).toBe("T-shirt - Red / Medium");
    expect(row.cells[0].textContent.match(/Red \/ Medium/g)).toHaveLength(1);
    expect(row.cells[0].textContent).toContain(identifiers.sku || identifiers.code || "$5.00");
    expect(row.cells[1].textContent).toBe("2");
    expect(row.cells[3].textContent).toBe("$10.00");
  }
);

test("items without variants keep their name, SKU, and price", () => {
  const row = renderItem({ sku: "SHIRT-01" });
  expect(row.cells[0].textContent).toBe("T-shirtSHIRT-01 · $5.00");
});
