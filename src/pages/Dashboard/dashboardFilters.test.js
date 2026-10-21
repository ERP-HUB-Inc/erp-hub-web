import { dashboardFilterSearch, readDashboardFilters } from "./dashboardFilters";

const locations = [{ id: 1 }, { id: 2 }];

test("restores the selected branch and period from the URL", () => {
  expect(readDashboardFilters("?locationId=2&period=this-month", 1, locations)).toEqual({
    locationId: "2",
    periodKey: "this-month",
  });
});

test("uses the profile branch and Today when filters are absent", () => {
  expect(readDashboardFilters("", 1, locations)).toEqual({ locationId: "1", periodKey: "today" });
});

test("preserves All Branches after a reload even with a profile branch", () => {
  const search = dashboardFilterSearch("", { locationId: "", periodKey: "last-week" });
  expect(readDashboardFilters(search, 1, locations)).toEqual({ locationId: "", periodKey: "last-week" });
});

test("rejects an unknown URL branch and unsupported period", () => {
  expect(readDashboardFilters("?locationId=99&period=invalid", 1, locations)).toEqual({
    locationId: "1",
    periodKey: "today",
  });
});

test("never falls back to an inaccessible profile branch", () => {
  expect(readDashboardFilters("?locationId=99", 99, locations).locationId).toBe("");
});

test("waits for accessible locations before restoring a requested branch", () => {
  const search = "?locationId=2&period=yesterday";
  expect(readDashboardFilters(search, 1, []).locationId).toBe("");
  expect(readDashboardFilters(search, 1, locations).locationId).toBe("2");
});

test("changes filters while preserving unrelated query parameters", () => {
  const search = dashboardFilterSearch("?view=overview&period=today&locationId=1", {
    locationId: "2",
    periodKey: "this-year",
  });
  const params = new URLSearchParams(search);
  expect(params.get("view")).toBe("overview");
  expect(params.getAll("period")).toEqual(["this-year"]);
  expect(params.getAll("locationId")).toEqual(["2"]);
});

test("reads each history entry independently for Back and Forward navigation", () => {
  const first = dashboardFilterSearch("", { locationId: "1", periodKey: "today" });
  const second = dashboardFilterSearch(first, { locationId: "2", periodKey: "last-month" });
  expect(readDashboardFilters(second, 1, locations)).toEqual({ locationId: "2", periodKey: "last-month" });
  expect(readDashboardFilters(first, 1, locations)).toEqual({ locationId: "1", periodKey: "today" });
});
