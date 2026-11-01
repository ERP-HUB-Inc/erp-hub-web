import React from "react";
import { QuantityValue } from "../../../../components/stateless/quantity.value";

export function incomingStockQuantity(value) {
  if (typeof value !== "number" && typeof value !== "string") return null;
  if (String(value).trim() === "") return null;
  const quantity = Number(value);
  return Number.isFinite(quantity) && quantity >= 0 ? quantity : null;
}

export default function IncomingStock({ quantity, unit }) {
  const amount = incomingStockQuantity(quantity);
  return amount === null
    ? <span title="Incoming stock is unavailable">—</span>
    : <QuantityValue quantity={amount} unit={unit} decimals={2} />;
}
