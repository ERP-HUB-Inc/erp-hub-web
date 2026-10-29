describe("Retail POS — planned", () => {
  it("loads the permitted register and opens a shift when required");
  it("finds an item by name and barcode and selects its variant");
  it("adds and removes cart lines and updates quantities");
  it("applies permitted discounts and verifies line and sale totals");
  it("completes a cash sale and verifies the receipt and stock deduction");
  it("handles tendered amount, change, tax, and currency rounding");
  it("prevents duplicate sales after repeated payment clicks");
  it("handles a failed payment without recording a completed sale");
  it("enforces cashier permissions and configured out-of-stock behavior");
});
