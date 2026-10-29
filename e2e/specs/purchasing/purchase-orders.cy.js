describe("Purchase orders — planned", () => {
  it("creates and reloads a purchase order with supplier, location, and item lines");
  it("validates required fields, quantities, costs, and date/time constraints");
  it("verifies supported draft and final submission behavior");
  it("verifies partial and complete receiving against remaining quantities");
  it("prevents duplicate receiving and repeated submission");
  it("shows backend validation errors without losing entered lines");
});
