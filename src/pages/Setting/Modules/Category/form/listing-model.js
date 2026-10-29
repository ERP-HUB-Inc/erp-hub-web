const COLOR_NAMES = {
  "#3b82f6": "Blue", "#f59e0b": "Amber", "#14b8a6": "Teal", "#f97316": "Orange",
  "#6366f1": "Indigo", "#eab308": "Yellow", "#a855f7": "Purple", "#06b6d4": "Cyan", "#64748b": "Slate"
};

function getCategoryColor(category = {}) {
  const configured = category.posColor || category.color;
  const value = configured && typeof configured === "object" ? configured.hex || configured.value : configured;
  if (typeof value !== "string" || !/^#(?:[\da-f]{3}|[\da-f]{6})$/i.test(value)) return null;
  const hex = value.length === 4 ? `#${value.slice(1).split("").map(char => char + char).join("")}` : value;
  const name = configured && typeof configured === "object" && configured.name || COLOR_NAMES[hex.toLowerCase()] || "Custom color";
  return { hex, name };
}

function getCategoryStatus(category = {}) {
  const raw = category.status;
  if (typeof raw === "string") {
    const normalized = raw.trim().toLowerCase();
    if (["active", "enabled"].includes(normalized)) return { label: "Active", active: true };
    if (["inactive", "disabled"].includes(normalized)) return { label: "Inactive", active: false };
    if (["archived", "archive"].includes(normalized)) return { label: "Archived", active: false };
    if (["draft", "pending"].includes(normalized)) return { label: normalized === "draft" ? "Draft" : "Pending", active: false };
  }
  if (raw === 1 || raw === true) return { label: "Active", active: true };
  if (raw === 0 || raw === false) return { label: "Inactive", active: false };
  if (raw === 2) return { label: "Draft", active: false };
  if (raw === 3) return { label: "Archived", active: false };
  if (category.isArchived === true) return { label: "Archived", active: false };
  if (typeof category.isActive === "boolean") return { label: category.isActive ? "Active" : "Inactive", active: category.isActive };
  if (category.isActive === 1 || category.isActive === 0) return { label: category.isActive ? "Active" : "Inactive", active: category.isActive === 1 };
  return null;
}

function normalizeCategorySummary(response) {
  const payload = response && response.data && response.data.data !== undefined
    ? response.data.data
    : response && response.data !== undefined ? response.data : response;
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return null;

  const fields = ["totalCategories", "activeCategories", "inactiveCategories", "draftCategories", "archivedCategories", "linkedSkus"];
  return fields.reduce((summary, field) => {
    const value = payload[field];
    summary[field] = Number.isSafeInteger(value) && value >= 0 ? value : null;
    return summary;
  }, {});
}

export { getCategoryColor, getCategoryStatus, normalizeCategorySummary };
