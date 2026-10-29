// Only fields supported by the category create contract belong in this payload.
export function buildCategoryCreatePayload(values, posColor, image = "") {
  const payload = {
    name: values.name,
    namekm: values.namekm || "",
    namebm: values.namebm || "",
    code: values.code || "",
    parentId: values.parentId == null ? null : values.parentId,
    image,
    description: values.description || "",
    label: values.label || "",
    status: values.status == null ? 1 : values.status,
    isDefault: values.isDefault == null ? false : values.isDefault,
    isFeature: values.isFeature == null ? false : values.isFeature,
    posColor: { name: posColor.name, hex: posColor.hex.toUpperCase() },
    posQuickAccessEnabled: values.posQuickAccessEnabled == null ? false : values.posQuickAccessEnabled
  };

  if (values.defaultMarginValue !== undefined && values.defaultMarginValue !== null && values.defaultMarginValue !== "") {
    payload.defaultMarginRule = { type: "GROSS_MARGIN", value: Number(values.defaultMarginValue) };
  }

  return payload;
}
