import { resolvePeriod } from "./dashboardModel";

test.each([
  ["2026-11-08T05:00:00Z", "2026-11-01", "2026-11-30"],
  ["2026-01-15T05:00:00Z", "2026-01-01", "2026-01-31"],
  ["2026-02-08T05:00:00Z", "2026-02-01", "2026-02-28"],
  ["2028-02-08T05:00:00Z", "2028-02-01", "2028-02-29"],
  ["2026-10-31T18:00:00Z", "2026-11-01", "2026-11-30"],
])("This Month uses full business-month boundaries at %s", (now, fromDate, toDate) => {
  const range = resolvePeriod("this-month", new Date(now), "Asia/Phnom_Penh");
  expect(range.fromDate).toBe(fromDate);
  expect(range.toDate).toBe(toDate);
});

test("provides full-month boundaries for the sales goal", () => {
  const range = resolvePeriod("this-month", new Date("2026-11-08T05:00:00Z"), "Asia/Phnom_Penh");
  expect(range.monthStart).toBe("2026-11-01");
  expect(range.monthEnd).toBe("2026-11-30");
  expect(range.today).toBe("2026-11-08");
});
