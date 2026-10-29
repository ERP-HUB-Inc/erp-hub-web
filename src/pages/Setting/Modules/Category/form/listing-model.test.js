import { getCategoryColor, getCategoryStatus, normalizeCategorySummary } from "./listing-model";

test("normalizes configured category color and rejects invalid values", () => {
  expect(getCategoryColor({ posColor: "#abc" })).toEqual({ hex: "#aabbcc", name: "Custom color" });
  expect(getCategoryColor({ color: { name: "Blue", hex: "#3B82F6" } })).toEqual({ hex: "#3B82F6", name: "Blue" });
  expect(getCategoryColor({ color: "not-a-color" })).toBeNull();
});

test("uses explicit lifecycle state and preserves archived/draft distinctions", () => {
  expect(getCategoryStatus({ status: "active" })).toEqual({ label: "Active", active: true });
  expect(getCategoryStatus({ status: "archived" })).toEqual({ label: "Archived", active: false });
  expect(getCategoryStatus({ status: "draft" })).toEqual({ label: "Draft", active: false });
  expect(getCategoryStatus({ status: 2 })).toEqual({ label: "Draft", active: false });
  expect(getCategoryStatus({ status: 3 })).toEqual({ label: "Archived", active: false });
  expect(getCategoryStatus({ isFeature: true })).toBeNull();
});

test("normalizes summary fields from the API response envelope without inventing missing values", () => {
  expect(normalizeCategorySummary({ data: { data: {
    totalCategories: 48,
    activeCategories: 42,
    inactiveCategories: 6,
    draftCategories: 0,
    archivedCategories: 0,
    linkedSkus: 6537
  } } })).toEqual({
    totalCategories: 48,
    activeCategories: 42,
    inactiveCategories: 6,
    draftCategories: 0,
    archivedCategories: 0,
    linkedSkus: 6537
  });
  expect(normalizeCategorySummary({ data: { totalCategories: 1, activeCategories: -1 } })).toMatchObject({ totalCategories: 1, activeCategories: null, linkedSkus: null });
  expect(normalizeCategorySummary(null)).toBeNull();
});
