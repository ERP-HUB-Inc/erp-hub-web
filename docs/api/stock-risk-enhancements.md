# Stock Risk API enhancement handoff

Status: **Proposed additions for backend review**, except for the summary valuation fields subsequently confirmed below. Keep existing fields and the application's response envelope compatible. No endpoint was called or live backend behavior verified while writing this document.

Endpoint: `GET /report/purchases/intelligence/overstock`.

## Existing request

Retain `fromDate` and `toDate` in `YYYY-MM-DD`, optional `supplierId` and `locationId`, and optional `thresholdDays` (existing default 60). Omit unselected optional IDs. Preserve existing validation, authentication, tenant/branch scope, and error conventions.

The frontend already submits these filters. No extra date, risk, pagination, or unit parameters should be required without agreeing the new request contract.

## 1. Valuation and currency

Confirmed by the developer: `summary.totalExcessStockValue`, `summary.currencyCode`, and `summary.valuationUnavailableProducts` already exist in backend code. The existing stock report cost basis is `excess stock × ProductVariant.cost`. The backend returns a null complete total if any excess item cannot be valued or client currency is unavailable; confirmed zero excess returns 0. The Stock Risk card now consumes these summary fields without recalculating them. Other fields in this handoff remain proposals unless separately confirmed.

| Proposed field | Type | Meaning |
| --- | --- | --- |
| `summary.totalExcessStockValue` | number or null | Valuation of excess inventory across the complete filtered report, in the report currency. |
| `summary.currencyCode` | ISO currency code or null | Currency of the report's valuation amounts, e.g. `USD`. |
| `summary.valuationUnavailableProducts` | nonnegative integer | Number of excess-bearing SKUs for which valuation cannot be established. |
| `items[].excessStockValue` | number or null | Value of this row's excess quantity using the established inventory valuation policy. |
| `meta.valuationMethod` | documented string | Actual valuation policy used by the backend. Do not introduce weighted average or FIFO solely for this UI. |

Rules:

- Use the established stock valuation basis, not retail/selling price and not an arbitrary latest purchase price.
- Where that policy uses a single applicable unit cost, `excessStockValue = excessStock × valuationUnitCost`. Layered valuation must follow the existing layer-selection rules instead.
- Sum unrounded monetary values and round only at the documented monetary precision. Return amounts as JSON numbers, without currency symbols or thousands separators.
- A confirmed zero excess value is `0`. Missing cost for positive excess is `null`, not `0`.
- If some positive-excess rows cannot be valued, return the complete total as `null` and report the unavailable count. Do not present a partial sum as the total.
- Normalize to one report currency using existing conversion rules. If that is unsupported, provide amounts grouped by currency and leave the single total unavailable; never add unconverted currencies.
- Summary aggregates cover every matching SKU, independently of any detail pagination/search implemented later.

## 2. Units and quantity totals

| Proposed field | Type | Meaning |
| --- | --- | --- |
| `items[].unitId` | string or null | Stable identifier of the unit used by this row. |
| `items[].unitName` | string or null | Display unit, e.g. `pcs`, `bottle`, or `pail`. |
| `meta.quantityAggregation` | `SINGLE_UNIT`, `NORMALIZED`, or `BY_UNIT` | How the aggregate quantity may be displayed. |
| `meta.normalizedUnitName` | string or null | Common unit label when aggregation has a genuinely compatible, documented basis. |
| `summary.excessStockByUnit` | array | Breakdown with `{ unitId, unitName, quantity }`. Required when a meaningful common unit is unavailable. |

All quantities within one row must use a comparable unit: purchased, sold, returns, current stock, daily velocity, target stock, excess, and expiry quantities. Perform necessary pack/base-unit conversions using existing catalog rules before calculating coverage or excess.

Preserve the existing `totalExcessStock` field for compatibility. For mixed units, its legacy scalar must not be labeled “pcs” or treated as a meaningful common-unit total. The enhanced UI can use `excessStockByUnit` instead, such as `20 bottles · 10 pails`.

Unit and currency normalization are separate requirements.

## 3. Category and expiry details

`items[].categoryName`: string or null. Use the actual catalog category. The UI already displays this optional field when supplied.

Proposed expiry object:

```json
{
  "expiry": {
    "trackingEnabled": true,
    "nearestExpiryDate": "2026-12-02",
    "daysToExpiry": 45,
    "warningWindowDays": 60,
    "expiringQuantity": 4,
    "expiredQuantity": 0
  }
}
```

This is a date example for `asOfDate=2026-10-18`, not real inventory.

- Derive expiry from actual lots/batches with remaining stock in the selected location/report scope.
- `nearestExpiryDate` is the earliest known expiry among those remaining lots, including already expired lots. Use a date-only `YYYY-MM-DD` string.
- `daysToExpiry` uses the business timezone's calendar dates: negative means expired, zero means expires today, and positive means days remaining.
- `expiringQuantity` covers lots with `0 <= daysToExpiry <= warningWindowDays`; `expiredQuantity` covers lots with negative days remaining. Do not count an entire SKU's stock because one lot is expiring.
- The warning window must come from the business policy and be disclosed, not invented from screenshot values.
- If tracking is disabled, return `trackingEnabled=false` and null expiry details. If tracking exists but dates are missing, keep the relevant values null. Unknown expiry quantity is not a confirmed zero.
- Define the handling of lots whose expiry dates are missing; do not claim the result covers all stock when it does not.

## 4. Defined coverage-card aggregate

Proposed default: show the maximum finite coverage among HIGH-risk SKUs. This is explicit and does not require adding quantities with incompatible units.

```json
{
  "highRiskCoverageDays": 61.7142857143,
  "highRiskCoverageMetric": "MAX_FINITE_HIGH_RISK",
  "highRiskCoverageEligibleProducts": 1,
  "highRiskCoverageExcludedProducts": 0
}
```

These fields belong in `summary`.

- Compute `MAX(stockCoverageDays)` across the complete matching HIGH-risk population with a valid finite coverage value.
- Do not choose the first visible row or compute from a single detail page.
- Return `highRiskCoverageDays=null` when no eligible rows exist. A zero value must mean confirmed zero coverage.
- Identify excluded high-risk rows in the excluded count. Null/zero-sales coverage must not silently be converted to numeric infinity.
- Frontend badge label should be **Max 61.7d**, making the metric clear.
- If the backend already has a preferred aggregate, return its actual metric name and document its population/weights instead. The proposed maximum must not replace an established business policy without agreement.

## 5. Suggested actions and workflow context

Proposed optional per-item `suggestedActions` array:

```json
[
  {
    "type": "REVIEW_ITEM",
    "enabled": true,
    "reasonCode": "REVIEW_EXCESS_STOCK",
    "unavailableReason": null,
    "target": {
      "itemId": "example-item",
      "variantId": "example-variant",
      "locationId": "example-location"
    }
  }
]
```

| Proposed action type | Required context / condition |
| --- | --- |
| `REVIEW_ITEM` / `MONITOR` | Valid item and variant identifiers, and `productOption` if required by the existing item workflow. |
| `CREATE_CLEARANCE` / `FLASH_PROMO` | A supported promotion workflow, item/variant and location/unit context, and permission to open it. Expiry-driven suggestions must be based on actual lot data. |
| `HOLD_PO` | Existing purchasing review/hold workflow and eligible order identifiers in the authorized scope. No recommendation should imply that orders were already stopped. |
| `REORDER_PO` | Actual reorder-policy eligibility, recommended quantity and unit, destination location, supplier where required, and a documented reason. Healthy stock or low coverage alone is insufficient. |

The backend should return a stable type/reason and scoped identifiers rather than arbitrary navigation URLs. The frontend maps supported types to existing workflows. A GET report never changes prices, creates promotions/POs, or holds orders. Those mutations require the existing explicit workflow and backend authorization.

If unavailable, omit the suggestion or return `enabled=false` with a user-readable `unavailableReason`. Do not label a generic item-detail link as Create Clearance or Hold POs.

The current frontend fallback is Review item / Monitor. Returning suggested action data alone does not create missing workflows; their routes and integration behavior must also be agreed.

Item detail navigation must use `items[].itemId`: `/inventories/items/view/{itemId}`. Never substitute `variantId`. If `itemId` is missing, disable the detail action instead of guessing an identifier. `variantId` remains variant context only.

## 6. Stock, risk, and scope definitions to confirm

These are contract clarifications, not requests for the frontend to invent new calculations:

- `meta.stockBasis`: whether `currentStock` is ON_HAND, AVAILABLE, or INVENTORY_POSITION. Identify the existing authoritative stock ledger/balance source. Current stock must include applicable opening stock, transfers, adjustments, and returns.
- `meta.asOfDate` and `meta.timezone`: inventory/expiry evaluation date and configured business timezone.
- `meta.observationDays`: actual denominator used for daily sales, including the established inclusive/exclusive date convention and eligible returns/cancellations.
- Confirm target stock rounding, safety stock, minimum stock, and pack rules; row `thresholdDays` and `targetStock` remain authoritative.
- Keep NORMAL/HEALTHY, HIGH, and CRITICAL mutually exclusive. Document critical thresholds, zero-sales behavior, and minimum history for recently introduced stock. Do not adopt the screenshot's >500-day rule solely for visual consistency.
- Confirm whether critical always means dead stock; otherwise the UI card should use Critical Stock Risk rather than claim every critical item is dead stock.
- Clarify whether `overstockProducts` equals high + critical under the real policy; do not force this equality if other critical reasons exist.
- Return unavailable history separately from confirmed zero sales. Keep non-finite coverage null; no JSON `Infinity`, and no misleading zero coverage for positive stock with no sales.
- Confirm `items` includes healthy rows in the requested scope. If the endpoint only returns flagged products, agree a supported scope/risk filter or report endpoint for Healthy/All Items.
- Confirm the examples' unpaged `items` contract. If server pagination is introduced, agree category/search/page inputs and totals together. All summary aggregates must still cover the full report scope.

## 7. Complete illustrative response

The example below contains one HIGH-risk SKU and is internally consistent. Names, identifiers, currency, and valuation method are fixtures, not production values or a new accounting policy. It represents 18 observation days: 105 sold / 18 days, 360 current stock, 60-day target 350, and excess 10 valued at 38 per unit.

```json
{
  "meta": {
    "asOfDate": "2026-10-18",
    "timezone": "Asia/Phnom_Penh",
    "observationDays": 18,
    "stockBasis": "ON_HAND",
    "valuationMethod": "WEIGHTED_AVERAGE",
    "quantityAggregation": "SINGLE_UNIT",
    "normalizedUnitName": "pcs"
  },
  "summary": {
    "totalProducts": 1,
    "overstockProducts": 1,
    "normalProducts": 0,
    "highRiskProducts": 1,
    "criticalRiskProducts": 0,
    "totalExcessStock": 10,
    "totalExcessStockValue": 380,
    "currencyCode": "USD",
    "valuationUnavailableProducts": 0,
    "excessStockByUnit": [
      { "unitId": "example-unit", "unitName": "pcs", "quantity": 10 }
    ],
    "highRiskCoverageDays": 61.714285714285715,
    "highRiskCoverageMetric": "MAX_FINITE_HIGH_RISK",
    "highRiskCoverageEligibleProducts": 1,
    "highRiskCoverageExcludedProducts": 0
  },
  "items": [
    {
      "itemId": "example-item",
      "itemName": "Sample stocked product",
      "variantId": "example-variant",
      "variantName": "",
      "sku": "EXAMPLE-001",
      "categoryName": "Example category",
      "unitId": "example-unit",
      "unitName": "pcs",
      "purchasedQuantity": 465,
      "soldQuantity": 105,
      "returnQuantity": 0,
      "currentStock": 360,
      "averageDailySales": 5.833333333333333,
      "stockCoverageDays": 61.714285714285715,
      "thresholdDays": 60,
      "targetStock": 350,
      "excessStock": 10,
      "excessStockValue": 380,
      "risk": "HIGH",
      "expiry": {
        "trackingEnabled": false,
        "nearestExpiryDate": null,
        "daysToExpiry": null,
        "warningWindowDays": null,
        "expiringQuantity": null,
        "expiredQuantity": null
      },
      "suggestedActions": [
        {
          "type": "REVIEW_ITEM",
          "enabled": true,
          "reasonCode": "REVIEW_EXCESS_STOCK",
          "unavailableReason": null,
          "target": {
            "itemId": "example-item",
            "variantId": "example-variant",
            "locationId": "example-location"
          }
        }
      ]
    }
  ]
}
```

## 8. Backend acceptance cases

1. No matching inventory: empty items, confirmed zero counts/quantity/value where computable, null coverage aggregate. Missing data must not be disguised as a zero.
2. Positive stock + confirmed zero sales: daily sales 0, coverage null, risk according to the existing history policy. No Infinity in JSON.
3. Missing sales history or newly introduced product: preserve unavailability/minimum-history handling; do not automatically call it dead stock.
4. Mixed units: breakdowns are correct and the legacy scalar is not given a false common unit label.
5. Missing valuation for positive excess: row value and complete total remain null; unavailable count is accurate.
6. Multiple currencies: normalized valuations follow existing conversion policy or remain separately grouped.
7. Multiple lots: nearest expiry and expiring/expired quantities use actual remaining stock and business timezone boundaries.
8. Full report totals: filters apply equally to totals, metric populations, and detail rows, independently of any page.
9. Unsupported/unauthorized actions: unavailable or omitted; direct workflow mutations still enforce authorization.
10. Existing consumers: original fields, query parameters, and response envelope retain their agreed behavior.

## Suggested delivery order

1. Valuation/currency, units, and category: fills the most visible missing card/table details.
2. Coverage aggregate and expiry object: completes the meaningful badge and secondary row details.
3. Suggested actions: integrate only after actual workflows and reorder/hold policies are confirmed.

## Document verification

All four JSON examples parsed successfully. Local assertions confirmed the complete example's count, excess quantity, valuation total, daily sales, target stock, coverage aggregate, and the separate expiry date example's 45-day difference. Whitespace validation passed. These checks establish example consistency, not live API behavior. No credentials or real customer data are included.
