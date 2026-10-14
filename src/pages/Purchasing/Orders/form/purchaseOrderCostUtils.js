export const CHARGE_TYPES = [
  { value: "HANDLING", label: "Handling" },
  { value: "CUSTOMS_DUTY", label: "Customs duty" },
  { value: "INSURANCE", label: "Insurance" },
  { value: "OTHER", label: "Other" },
];

export const newCharge = () => ({
  key: `charge-${Date.now()}-${Math.random()}`,
  type: undefined,
  description: "",
  amount: undefined,
  payee: "SUPPLIER",
  includeInInventoryCost: false,
});

export const restoreCharges = (charges = []) =>
  (Array.isArray(charges) ? charges : []).map((charge) => ({
    ...charge,
    key: `charge-${Date.now()}-${Math.random()}`,
    description: charge.description || "",
    payee: charge.payee || "SUPPLIER",
    includeInInventoryCost: charge.includeInInventoryCost || false,
  }));

export const serializeCharges = (charges) =>
  charges.map(({ key, ...charge }) => ({
    ...charge,
    description: charge.type === "OTHER" ? (charge.description || "").trim() : "",
  }));

export const validateCharges = (charges) => {
  const invalidIndex = charges.findIndex((charge) =>
    !CHARGE_TYPES.some((type) => type.value === charge.type) ||
    !Number.isFinite(charge.amount) || charge.amount <= 0 ||
    (charge.type === "OTHER" && !(charge.description || "").trim()) ||
    !["SUPPLIER", "THIRD_PARTY"].includes(charge.payee)
  );
  return invalidIndex < 0 ? null : `Complete additional charge ${invalidIndex + 1} with a type, positive amount, and description for Other.`;
};

const money = (value) => Math.round((Number(value) || 0) * 100) / 100;

export const calculatePurchaseOrderTotals = (items, costs, charges) => {
  const subtotal = money(items.reduce((total, item) =>
    total + (item.itemId ? money(Number(item.quantity) * Number(item.cost)) : 0), 0));
  const discount = money(costs.discount);
  const shippingFee = money(costs.shippingFee);
  const tax = money(costs.tax);
  const supplierCharges = money(charges.reduce((total, charge) =>
    total + (charge.payee === "SUPPLIER" ? money(charge.amount) : 0), 0));
  const thirdPartyCharges = money(charges.reduce((total, charge) =>
    total + (charge.payee === "THIRD_PARTY" ? money(charge.amount) : 0), 0));
  const supplierPayable = money(subtotal - discount + shippingFee + supplierCharges + (costs.taxInclusive ? 0 : tax));

  return {
    subtotal,
    discount,
    shippingFee,
    tax,
    supplierCharges,
    thirdPartyCharges,
    supplierPayable,
    estimatedTotalCost: money(supplierPayable + thirdPartyCharges),
  };
};
