import React from "react";
import { Button, InputNumber } from "antd";

export const getPricingVariantId = row => row.productVariantId || row.variantId;

export function calculatePricingPreview(cost, margin) {
  if (cost === null || cost === undefined || String(cost).trim() === "" || !Number.isFinite(Number(cost)) || Number(cost) <= 0) {
    return { price: null, error: "A unit cost greater than zero is required." };
  }
  if (margin === null || margin === undefined || String(margin).trim() === "" || !Number.isFinite(Number(margin))) {
    return { price: null, error: "Enter a valid margin percentage." };
  }
  if (Number(margin) >= 100) return { price: null, error: "Margin must be less than 100%." };
  const price = Number(cost) / (1 - Number(margin) / 100);
  const roundedPrice = Math.round((price + Number.EPSILON) * 10000) / 10000;
  if (!Number.isFinite(roundedPrice) || roundedPrice <= 0) {
    return { price: null, error: "This margin cannot produce a valid unit price." };
  }
  return { price: roundedPrice, error: "" };
}

export function getPricingDraftPreview(draft) {
  if (draft.source !== "price") return calculatePricingPreview(draft.expectedUnitCost, draft.margin);
  if (!Number.isFinite(draft.expectedUnitCost) || draft.expectedUnitCost < 0) {
    return { price: null, error: "A valid unit cost is required." };
  }
  const value = draft.salesPrice;
  const price = Number(value);
  if (value === null || value === undefined || String(value).trim() === "" || !Number.isFinite(price) || price <= 0) {
    return { price: null, error: "Enter a selling price greater than zero." };
  }
  if (price !== Number(price.toFixed(4))) {
    return { price: null, error: "Selling price supports up to four decimal places." };
  }
  return { price, error: "" };
}

export function getPricingColumns(columns, drafts, onChange, onReset, formatMoney, sortedInfo = {}, saveState = {}) {
  const renderActions = (row, error) => {
    const id = getPricingVariantId(row);
    const label = row.itemName || row.productName || row.sku || "item";
    const saving = saveState.savingId === id;
    return (
      <div className="pricing-margin-actions">
        <Button size="small" type="primary" loading={saving}
          disabled={!!error || !!saveState.savingId || !!saveState.errors?.[id]?.conflict}
          onClick={() => saveState.onSave(row)} aria-label={`Save price for ${label}`}>Save</Button>
        <Button size="small" disabled={saving} onClick={() => onReset(id)} aria-label={`Reset margin for ${label}`}>Reset</Button>
      </div>
    );
  };
  const orderedColumns = columns.filter(column => !["stockAge", "marketPrice", "marginPercent"].includes(column.key));
  const marginColumn = columns.find(column => column.key === "marginPercent");
  if (marginColumn) {
    const costIndex = orderedColumns.findIndex(column => column.key === "unitCost");
    orderedColumns.splice(costIndex === -1 ? orderedColumns.length : costIndex + 1, 0, marginColumn);
  }
  const marginIndex = orderedColumns.findIndex(column => column.key === "marginPercent");
  orderedColumns.splice(marginIndex === -1 ? orderedColumns.length : marginIndex + 1, 0, {
    title: "Set Unit Price",
    key: "directSalesPrice",
    width: 160,
    align: "right",
    render: (_, row) => {
      const id = getPricingVariantId(row);
      const draft = drafts[id];
      const preview = draft && getPricingDraftPreview(draft);
      const cost = draft ? draft.expectedUnitCost : row.unitCost;
      const validCost = cost !== null && cost !== undefined && String(cost).trim() !== "" && Number.isFinite(Number(cost)) && Number(cost) >= 0;
      const label = row.itemName || row.productName || row.sku || "item";
      const error = draft && preview.error;
      const active = draft?.source === "price";
      const errorMessage = active ? error || saveState.errors?.[id]?.message : "";
      return <div className="pricing-margin-editor">
        <div className="pricing-margin-controls"><InputNumber
        aria-label={`Selling price for ${label}`}
        aria-invalid={!!errorMessage}
        aria-describedby={errorMessage ? `pricing-margin-error-${id}` : undefined}
        value={draft ? draft.source === "price" ? draft.salesPrice : preview.price ?? undefined : row.salesPrice == null ? undefined : Number(row.salesPrice)}
        disabled={!id || !validCost || saveState.savingId === id}
        precision={4}
        step={0.01}
        onChange={value => saveState.onPriceChange(row, value)}
        /></div>
        {active && renderActions(row, error)}
        {errorMessage && <small id={`pricing-margin-error-${id}`} role="alert">{errorMessage}</small>}
      </div>;
    }
  });
  const stockIndex = orderedColumns.findIndex(column => column.key === "quantityOnHand");
  orderedColumns.splice(stockIndex === -1 ? orderedColumns.length : stockIndex + 1, 0, {
    title: "Expected Profit",
    dataIndex: "expectedProfit",
    key: "expectedProfit",
    width: 140,
    align: "right",
    sorter: true,
    sortOrder: sortedInfo.field === "expectedProfit" ? sortedInfo.order : null,
    render: value => formatMoney(value)
  });
  return orderedColumns.map(column => {
    if (column.key === "salesPrice") {
      return {
        ...column,
        render: (price, row) => {
          const draft = drafts[getPricingVariantId(row)];
          const preview = draft && getPricingDraftPreview(draft);
          return preview && !preview.error ? (
            <div className="pricing-price-preview">
              <strong>{formatMoney(preview.price)}</strong>
              <small>Current: {formatMoney(price)}</small>
              <small>Unsaved preview</small>
            </div>
          ) : formatMoney(price);
        }
      };
    }
    if (column.key !== "marginPercent") return column;
    return {
      ...column,
      title: "Margin (%)",
      width: 160,
      render: (margin, row) => {
        const id = getPricingVariantId(row);
        const draft = drafts[id];
        const hasValidCost = !calculatePricingPreview(draft ? draft.expectedUnitCost : row.unitCost, 0).error;
        const preview = draft && getPricingDraftPreview(draft);
        const draftMargin = draft?.source === "price"
          ? preview.error ? undefined : Number(((preview.price - draft.expectedUnitCost) / preview.price * 100).toFixed(2))
          : draft?.margin;
        const error = !id ? "Variant information is unavailable." : draft ? preview.error : !hasValidCost
          ? "A unit cost greater than zero is required to edit margin." : "";
        const saveError = saveState.errors?.[id];
        const saving = saveState.savingId === id;
        const active = draft?.source !== "price";
        const label = row.itemName || row.productName || row.sku || "item";
        const errorId = `pricing-margin-error-${id}`;
        return (
          <div className="pricing-margin-editor">
            <div className="pricing-margin-controls">
              <InputNumber
                aria-label={`Margin percentage for ${label}`}
                aria-invalid={active && !!(error || saveError)}
                aria-describedby={active && (error || saveError) ? errorId : undefined}
                value={draft ? draftMargin : margin == null ? undefined : Number(margin)}
                disabled={!id || !hasValidCost || saving}
                precision={2}
                step={1}
                onChange={value => onChange(row, value)}
              />
            </div>
            {draft && active && renderActions(row, error)}
            {active && (error || saveError) && <small id={errorId} role="alert">{error || saveError.message}</small>}
          </div>
        );
      }
    };
  });
}
