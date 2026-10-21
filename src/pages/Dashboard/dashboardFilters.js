import { periodOptions } from "./dashboardModel";

export function readDashboardFilters(search, profileLocationId, locations) {
  const params = new URLSearchParams(search);
  const period = params.get("period");
  const hasLocation = (id) => locations.some((row) => String(row.id) === String(id));
  const defaultLocation = profileLocationId && hasLocation(profileLocationId) ? String(profileLocationId) : "";
  const requestedLocation = params.get("locationId");

  return {
    periodKey: periodOptions.some(([key]) => key === period) ? period : "today",
    locationId: requestedLocation === "" ? "" : requestedLocation !== null && hasLocation(requestedLocation) ? requestedLocation : defaultLocation,
  };
}

export function dashboardFilterSearch(search, { periodKey, locationId }) {
  const params = new URLSearchParams(search);
  params.set("period", periodKey);
  // Keep the empty value so All Branches survives a reload with a profile branch.
  params.set("locationId", locationId);
  return `?${params.toString()}`;
}
