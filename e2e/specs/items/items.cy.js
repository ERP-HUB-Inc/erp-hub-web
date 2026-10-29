describe("Item management — planned", () => {
  it("creates a standard item and verifies its persisted details after reload");
  it("creates a variant item with unique SKU and barcode values");
  it("saves item details without opening Variants and omits variant fields");
  it("saves new variants without sending their numeric temporary keys as IDs");
  it("keeps variant edits after collapsing the editor");
  it("queues a variant deletion and submits its ID with status 3 on Save Changes");
  it("preserves pending variant deletions across search and pagination");
  it("shows the backend delete error and leaves the blocked variant visible");
  it("filters out-of-stock items and shows the summary badge count");
  it("preserves search, category, and location filters across pagination");
});
