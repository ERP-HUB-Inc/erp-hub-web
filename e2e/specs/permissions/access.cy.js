describe("Role permissions — planned", () => {
  it("redirects unauthenticated visits to protected routes");
  it("blocks direct item, purchasing, and stock URLs for unauthorized users");
  it("restricts POS discount and selling actions according to the cashier role");
  it("does not fetch sales report data when report access is denied");
});
