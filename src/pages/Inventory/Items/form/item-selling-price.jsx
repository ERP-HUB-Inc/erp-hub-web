import React from "react";
import { Typography } from "antd";

const numberOrNull = value => {
  if (typeof value !== "number" && typeof value !== "string") return null;
  if (typeof value === "string" && !value.trim()) return null;
  return Number.isFinite(Number(value)) ? Number(value) : null;
};

export function getPriceDifference(price, cost) {
  const sellingPrice = numberOrNull(price);
  const unitCost = numberOrNull(cost);
  return sellingPrice !== null && unitCost !== null && unitCost >= 0 ? sellingPrice - unitCost : null;
}

export default function ItemSellingPrice({ price, cost, formatCurrency, enableInventoryTracking }) {
  const sellingPrice = numberOrNull(price);
  const unitCost = numberOrNull(cost);
  const difference = getPriceDifference(price, cost);
  const percentage = difference !== null && unitCost > 0 ? (difference / unitCost) * 100 : null;
  const tone = difference === null || difference === 0 ? "neutral" : difference < 0 ? "negative" : "positive";
  const marginLabel = difference === null
    ? "Margin unavailable"
    : difference < 0
      ? `${formatCurrency(difference)} Loss`
      : `${percentage === null ? "—" : `${percentage > 0 ? "+" : ""}${percentage.toFixed(1)}%`} (${formatCurrency(difference)})`;

  return (
    <div className="item-selling-price">
      <Typography.Text strong style={{ fontSize: "16px" }}>
        {sellingPrice === null ? "—" : formatCurrency(sellingPrice)}
      </Typography.Text>
      {enableInventoryTracking === true && (
        <span
          className={`item-selling-price-margin item-selling-price-margin-${tone}`}
          title={difference === null ? "Cost or selling price is unavailable." : difference < 0 ? "Difference between selling price and cost per unit." : unitCost === 0 ? "Percentage unavailable because cost is zero." : "Compared with cost: (selling price − cost) ÷ cost × 100."}
        >
          {marginLabel}
        </span>
      )}
    </div>
  );
}
