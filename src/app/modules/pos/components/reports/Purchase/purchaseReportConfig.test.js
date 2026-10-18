import { initialFilters } from "./purchaseReportConfig";

jest.mock("../../../../common/util", () => jest.fn().mockImplementation(() => ({})));
jest.mock("../../../services/report/PurchaseService", () => ({}));

afterEach(() => { delete global.document; });

test.each([-10, -20])("URL initialization preserves negative variance %p", minChangePercent => {
  global.document = {
    location: { search: `?minChangePercent=${minChangePercent}&thresholdDays=-20` }
  };
  expect(initialFilters()).toMatchObject({ minChangePercent, thresholdDays: 60 });
});
