import Enum from "../../../../enums";

export function normalizeProductOption(value, fallback = Enum.NO_VARIANT) {
  if (value === null || value === undefined || value === "") return fallback;
  const option = Number(value);
  return [Enum.NO_VARIANT, Enum.PRODUCT_VARIANT, Enum.PRODUCT_COMPOSITE].includes(option) ? option : fallback;
}

export function getItemProductOption(savedOption, formOption) {
  const saved = normalizeProductOption(savedOption);
  const current = normalizeProductOption(formOption, saved);
  // The edit form has no action for converting a saved variant item to standard.
  return saved === Enum.PRODUCT_VARIANT && current === Enum.NO_VARIANT ? saved : current;
}
