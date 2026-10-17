const cents = value => Math.round((Number(value) || 0) * 100);

export function isInventoryTrackingEnabled(item, refreshedVariant) {
  const product = item && item.product || {};
  const variant = refreshedVariant || item && item.variant || {};
  const variantProduct = variant.product || {};
  const flags = [
    item && item.enableInventoryTracking,
    product.enableInventoryTracking,
    product.productType && product.productType.enableInventoryTracking,
    variant.enableInventoryTracking,
    variantProduct.enableInventoryTracking,
    variantProduct.productType && variantProduct.productType.enableInventoryTracking
  ];
  return !flags.some(value => value === false || value === 0 || value === "false");
}

export function calculateOrderPreview(items, orderDiscount, deliveryFee, discountType = "USD") {
  const units = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  const lines = items.map(item => {
    const base = cents(item.price) * Number(item.quantity || 0);
    const lineDiscount = String(item.discountType || "USD").toUpperCase() === "PERCENTAGE"
      ? Math.round(base * Number(item.discount || 0) / 100)
      : Math.min(base, cents(item.discount));
    const discounted = base - lineDiscount;
    return { discounted, tax: Math.round(discounted * Number(item.tax || 0) / 100) };
  });
  const subtotalCents = lines.reduce((sum, line) => sum + line.discounted, 0);
  const discountValue = String(discountType || "USD").toUpperCase() === "PERCENTAGE"
    ? Math.round(subtotalCents * Number(orderDiscount || 0) / 100)
    : cents(orderDiscount);
  const discountCents = Math.min(Math.max(0, discountValue), subtotalCents);
  const taxCents = lines.reduce((sum, line) => sum + line.tax, 0);

  return {
    units,
    subtotal: subtotalCents / 100,
    discount: discountCents / 100,
    taxTotal: taxCents / 100,
    payable: deliveryFee == null ? null : (subtotalCents - discountCents + taxCents + cents(deliveryFee)) / 100
  };
}
