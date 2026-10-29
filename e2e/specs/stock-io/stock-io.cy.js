describe("Stock IO — planned", () => {
  it("records stock in and verifies item quantity and movement history");
  it("records supported stock out and verifies the quantity change");
  it("receives against a purchase order without counting the receipt twice");
  it("validates quantities, units, required location, and effective date/time");
  it("enforces the configured insufficient-stock policy");
  it("keeps stock unchanged after a rejected movement");
  it("prevents duplicate movements after repeated submission");
});
