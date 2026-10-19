import { initialFilters } from "./purchaseReportConfig";

jest.mock("../../../../common/util", () => jest.fn().mockImplementation(() => ({})));
jest.mock("../../../services/report/PurchaseService", () => ({}));

afterEach(() => { window.history.replaceState({}, "", "/"); });

test.each([-10, -20])("URL initialization preserves negative variance %p", minChangePercent => {
  window.history.replaceState({}, "", `?minChangePercent=${minChangePercent}&thresholdDays=-20`);
  expect(initialFilters()).toMatchObject({ minChangePercent, thresholdDays: 60 });
});
