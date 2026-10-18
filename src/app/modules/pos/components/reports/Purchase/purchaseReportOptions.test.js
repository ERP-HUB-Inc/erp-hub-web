import { getPurchaseReportOptions } from "./purchaseReportOptions";

const filters = {
  fromDate: "2026-10-01",
  toDate: "2026-10-17",
  locationId: 1,
  supplierId: 2,
  minChangePercent: 5,
  thresholdDays: 60
};

test("monthly trend sends only dates", () => {
  expect(getPurchaseReportOptions(filters, "trend")).toEqual({
    summaryOption: { fromDate: "2026-10-01", toDate: "2026-10-17" },
    sectionOption: { fromDate: "2026-10-01", toDate: "2026-10-17" }
  });
});

test("supplier report keeps location but omits supplier ID", () => {
  expect(getPurchaseReportOptions(filters, "suppliers").sectionOption).toEqual({
    fromDate: "2026-10-01", toDate: "2026-10-17", locationId: 1
  });
});

test("intelligence requests include only their supported threshold", () => {
  expect(getPurchaseReportOptions(filters, "priceIncrease").sectionOption).toEqual({
    fromDate: "2026-10-01", toDate: "2026-10-17", locationId: 1, supplierId: 2, minChangePercent: 5
  });
  expect(getPurchaseReportOptions(filters, "overstock").sectionOption).toEqual({
    fromDate: "2026-10-01", toDate: "2026-10-17", locationId: 1, supplierId: 2, thresholdDays: 60
  });
  expect(getPurchaseReportOptions(filters, "purchaseVsSales").sectionOption).toEqual({
    fromDate: "2026-10-01", toDate: "2026-10-17", locationId: 1, supplierId: 2
  });
});

test("unselected optional filters are omitted", () => {
  expect(getPurchaseReportOptions({ ...filters, locationId: "", supplierId: "" }, "products").sectionOption).toEqual({
    fromDate: "2026-10-01", toDate: "2026-10-17"
  });
});

test.each([-10, -20])("decrease filter sends signed minChangePercent %p unchanged", minChangePercent => {
  const options = getPurchaseReportOptions({ ...filters, minChangePercent }, "priceIncrease");
  expect(options.sectionOption.minChangePercent).toBe(minChangePercent);
  expect(options.summaryOption).not.toHaveProperty("minChangePercent");
});
