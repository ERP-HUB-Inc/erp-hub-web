# MarketChain ERP --- Purchase Report & Purchasing Intelligence Requirements

## 1. Purpose

The Purchase Report must help SME business owners understand not only
what they purchased, but whether purchasing decisions are aligned with
sales and inventory demand.

MarketChain reporting philosophy:

> Transactions → Data → Intelligence → Insight → Decision

The module should answer: How much did we purchase? What did we actually
receive? Which products consume the purchasing budget? Which suppliers
are we dependent on? Are purchase prices increasing? Are we buying
faster than we sell? Which products risk overstock? What should we
reorder next?

## 2. Required APIs

### Core Reports

``` text
GET /report/purchases/summary
GET /report/purchases/trend
GET /report/purchases/products
GET /report/purchases/suppliers
```

### Purchasing Intelligence

``` text
GET /report/purchases/intelligence/price-increase
GET /report/purchases/intelligence/overstock
GET /report/purchases/intelligence/reorder
GET /report/purchases/intelligence/supplier-concentration
GET /report/purchases/intelligence/purchase-vs-sales
```

Use the existing MarketChain architecture, TypeScript, TypeORM,
controllers, services, repositories, DTOs, enums, response wrappers,
pagination, authorization, date helpers, and coding conventions. Do not
duplicate existing infrastructure.

## 3. Existing Data Model

### PurchaseOrder

Relevant known fields:

``` text
id, supplierId, locationId, userId, updatedBy, receiverId,
referenceId, referenceNo, description, deliveryDueDate,
payTermNumber, payTermType, paymentDueDate, invoiceNo,
name, number, supplierName, shippingFee, itemCount,
totalQuantity, discount, totalAmount, returnTotal,
receiveTotal, step, type, status, createdAt, updatedAt
```

### PurchaseOrderEntry

``` text
id, purchaseOrderId, itemId, itemName, variantId,
variantName, sku, unitId, unitName, quantity, cost,
receiveQuantity, returnQuantity, batch, expiryDate,
shippingFee, discount, tax, status, createdAt, updatedAt
```

Important:

``` text
quantity        = ordered quantity
receiveQuantity = actually received quantity
returnQuantity  = returned quantity
```

For reports representing actual inventory acquisition, prefer received
quantity, but inspect the existing receiving/return flow before
finalizing formulas.

### Sales Data Used by Purchasing Intelligence

`Transaction` includes fields such as:

``` text
id, locationId, customerId, cost, taxAmount, discount,
total, subTotal, type, invoiceType, step, status,
createdAt, updatedAt
```

`TransactionEntry` includes:

``` text
id, transactionId, productId, itemName, productVariantId,
quantity, returnQuantity, cost, price, fullPrice,
tax, discount, total, status, createdAt, updatedAt
```

Codex must inspect actual transaction status/type enums and return
logic. Never invent enum values.

## 4. ProductSupplier

Use the existing entity if present. Otherwise the discussed model is:

``` sql
CREATE TABLE product_supplier (
    id BIGINT NOT NULL AUTO_INCREMENT,
    productVariantId BIGINT NOT NULL,
    supplierId BIGINT NOT NULL,
    leadTimeDays INT NOT NULL DEFAULT 0,
    minimumOrderQuantity DECIMAL(18, 4) NOT NULL DEFAULT 1,
    purchaseCost DECIMAL(18, 4) NOT NULL DEFAULT 0,
    isPreferred BOOLEAN NOT NULL DEFAULT FALSE,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_product_supplier_variant
        FOREIGN KEY (productVariantId) REFERENCES product_variant(id),
    CONSTRAINT fk_product_supplier_supplier
        FOREIGN KEY (supplierId) REFERENCES supplier(id),
    CONSTRAINT uq_product_supplier_variant_supplier
        UNIQUE (productVariantId, supplierId),
    INDEX idx_product_supplier_variant (productVariantId),
    INDEX idx_product_supplier_supplier (supplierId),
    INDEX idx_product_supplier_preferred (isPreferred)
);
```

It supports supplier lead time, MOQ, supplier cost, and
preferred-supplier logic for purchasing intelligence.

## 5. Common Filters

Where appropriate:

``` ts
interface PurchaseReportFilter {
    fromDate: string;
    toDate: string;
    locationId?: number | string;
    supplierId?: number | string;
}
```

Product intelligence may additionally support `productId`,
`productVariantId`, `categoryId`, or `brandId` when supported by
existing relations.

Validate dates, require `fromDate <= toDate`, and preserve
location/client/tenant authorization.

Recommended inclusive period pattern:

``` sql
createdAt >= :fromDate
AND createdAt < DATE_ADD(:toDate, INTERVAL 1 DAY)
```

## 6. Purchase Summary

Endpoint:

``` text
GET /report/purchases/summary
```

Purpose: high-level purchasing health for the selected period.

Metrics:

``` text
Purchase Order Count
Ordered Quantity
Received Quantity
Returned Quantity
Purchase Amount
Shipping Fee
Discount
Average Purchase Order Value
Supplier Count
Product/Variant Count
Pending Receiving
```

Core calculations:

``` text
Purchase Order Count = COUNT(DISTINCT purchaseOrder.id)
Ordered Quantity      = SUM(entry.quantity)
Received Quantity     = SUM(entry.receiveQuantity)
Returned Quantity     = SUM(entry.returnQuantity)
Supplier Count        = COUNT(DISTINCT purchaseOrder.supplierId)
```

For actual received purchase value, the discussed baseline is:

``` text
Purchase Amount = SUM(receiveQuantity * cost)
```

But Codex must inspect `totalAmount`, `receiveTotal`, discounts, tax,
shipping, and return semantics before finalizing financial totals.

Average PO value:

``` text
Purchase Amount / Purchase Order Count
```

Handle zero safely.

Pending receiving must follow the actual purchase workflow; do not guess
status values.

## 7. Purchase Trend

Endpoint:

``` text
GET /report/purchases/trend
```

Support grouping by:

``` text
DAY
WEEK
MONTH
```

Return chronologically ordered periods containing:

``` text
period
purchaseOrderCount
orderedQuantity
receivedQuantity
purchaseAmount
supplierCount
```

Perform aggregation in SQL.

## 8. Purchase Products

Endpoint:

``` text
GET /report/purchases/products
```

Prefer variant-level grouping.

Identity fields where available:

``` text
itemId
itemName
variantId
variantName
sku
unitId
unitName
```

Metrics:

``` text
orderedQuantity
receivedQuantity
returnedQuantity
purchaseAmount
averagePurchaseCost
purchaseOrderCount
supplierCount
```

Weighted average purchase cost is required:

``` text
SUM(receiveQuantity * cost) / SUM(receiveQuantity)
```

Do NOT use `AVG(cost)` when quantities differ.

Support existing pagination/sorting conventions.

## 9. Purchase Suppliers

Endpoint:

``` text
GET /report/purchases/suppliers
```

Supplier-level metrics:

``` text
supplierId
supplierName
purchaseOrderCount
orderedQuantity
receivedQuantity
purchaseAmount
productCount
averageOrderValue
percentageOfTotalPurchases
```

Supplier purchase share:

``` text
Supplier Purchase Amount / Total Purchase Amount * 100
```

This endpoint provides data for supplier-concentration intelligence.

## 10. Purchase Price Increase Intelligence

Endpoint:

``` text
GET /report/purchases/intelligence/price-increase
```

Goal: identify products whose weighted purchase cost increased versus a
previous comparable period.

Compare:

``` text
Current Period vs Previous Comparable Period
```

Weighted averages:

``` text
Current Average Cost =
SUM(currentReceivedQuantity * currentCost)
/
SUM(currentReceivedQuantity)

Previous Average Cost =
SUM(previousReceivedQuantity * previousCost)
/
SUM(previousReceivedQuantity)
```

Changes:

``` text
Price Change = Current Average Cost - Previous Average Cost

Price Change % =
Price Change / Previous Average Cost * 100
```

Handle previous cost = 0 safely.

Suggested item output:

``` text
productId
productVariantId
itemName
variantName
sku
currentAverageCost
previousAverageCost
priceChange
priceChangePercent
currentReceivedQuantity
previousReceivedQuantity
```

Sort largest increases first by default. A price increase is
information, not automatically a bad purchasing decision.

## 11. Overstock Risk

Endpoint:

``` text
GET /report/purchases/intelligence/overstock
```

Goal: identify current stock that is high relative to recent sales
demand.

CRITICAL: Do not calculate actual current stock as:

``` text
purchases in selected period - sales in selected period
```

Actual QOH may depend on:

``` text
Opening Stock
+ Received Purchases
+ Sales Returns
- Sales
- Purchase Returns
± Adjustments
± Transfers
= Current Stock
```

Codex MUST locate the real inventory source of truth: inventory balance,
location stock, stock ledger, product variant quantity, inventory
transactions, or equivalent.

If no reliable stock source exists, do not pretend an estimate is actual
QOH. Either explicitly name it as an estimate or leave this intelligence
pending.

When actual QOH exists, useful inputs are:

``` text
currentStock
recentSalesQuantity
averageDailySales
daysOfStock
reorderPoint
```

Possible formulas:

``` text
Average Daily Sales = Sales Quantity / Number of Days
Days of Stock = Current Stock / Average Daily Sales
```

Suggested output:

``` text
productId
productVariantId
itemName
sku
currentStock
salesQuantity
averageDailySales
daysOfStock
purchaseQuantity
riskStatus
```

Do not invent arbitrary risk thresholds. Use existing/configurable
business rules.

## 12. Reorder Recommendation

Endpoint:

``` text
GET /report/purchases/intelligence/reorder
```

Goal: help the owner know what should be purchased next.

Use actual stock plus existing product/supplier data such as:

``` text
currentStock
reorderPoint
averageDailySales
leadTimeDays
minimumOrderQuantity
preferredSupplier
```

Relevant Product fields previously discussed include `reorderPoint`,
`supplierId`, `preferredSupplierId`, and `purchasePrice`.

Conceptual lead-time demand:

``` text
Average Daily Sales * Lead Time Days
```

Do not invent safety-stock logic if MarketChain does not have it. Prefer
the existing `reorderPoint`.

Suggested output:

``` text
productId
productVariantId
itemName
sku
currentStock
reorderPoint
averageDailySales
leadTimeDays
minimumOrderQuantity
recommendedQuantity
preferredSupplierId
preferredSupplierName
recommendationStatus
```

Recommended quantity must have a documented formula and respect MOQ
where applicable.

## 13. Supplier Concentration

Endpoint:

``` text
GET /report/purchases/intelligence/supplier-concentration
```

Goal: show purchasing dependency by supplier.

Formula:

``` text
Supplier Share % =
Supplier Purchase Amount / Total Purchase Amount * 100
```

Suggested items:

``` text
supplierId
supplierName
purchaseAmount
purchaseSharePercent
purchaseOrderCount
productCount
```

Suggested summary:

``` text
totalPurchaseAmount
supplierCount
topSupplierId
topSupplierName
topSupplierSharePercent
```

Do not automatically call high concentration dangerous. If risk statuses
are added, use documented/configurable thresholds.

## 14. Purchase vs Sales Intelligence

Endpoint:

``` text
GET /report/purchases/intelligence/purchase-vs-sales
```

Purpose: connect purchasing behavior with sales demand. This is
purchasing intelligence, not a complete accounting report.

It should answer:

``` text
What did we buy?
What did we sell?
Which products are purchased faster than sold?
Which products sell faster than purchased?
Which are purchase-only?
Which are sales-only?
```

Purchasing more than sales in one period is NOT automatically bad
because purchases and sales have different timing.

### Purchase Side

Group by product/variant:

``` text
Purchase Quantity = SUM(receiveQuantity)
Purchase Amount   = SUM(receiveQuantity * cost)
```

Apply actual date, location, purchase status/type, receiving, and return
rules.

### Sales Side

Group finalized sales by the same product/variant key:

``` text
Sales Quantity = SUM(quantity)
Sales Cost     = SUM(quantity * entry.cost)
Sales Amount   = recognized finalized sales amount
```

Codex must inspect whether recognized sales revenue is
`TransactionEntry.total` or `quantity * price`. Do not guess.

### Matching Key

Prefer `productVariantId`; carefully fallback to product ID when no
variant exists. Never match by display name.

Conceptually:

``` ts
const key = productVariantId
    ? `VARIANT:${productVariantId}`
    : `PRODUCT:${productId}`;
```

### Include Both Sides

The result must include:

``` text
purchase-only products
sales-only products
products on both sides
```

To avoid the known TypeScript `MapIterator` target issue, use:

``` ts
const keys = new Set<string>();

purchaseMap.forEach((_, key) => keys.add(key));
salesMap.forEach((_, key) => keys.add(key));
```

instead of requiring a TypeScript target change just for:

``` ts
new Set([...purchaseMap.keys(), ...salesMap.keys()])
```

### Per-Product Metrics

``` text
purchaseQuantity
purchaseAmount
salesQuantity
salesAmount
salesCost
grossProfit
quantityDifference
amountDifference
purchaseSalesRatio
activityStatus
```

Calculations:

``` text
Gross Profit = Sales Amount - Sales Cost

Quantity Difference =
Purchase Quantity - Sales Quantity

Amount Difference =
Purchase Amount - Sales Amount
```

`Amount Difference` is NOT profit.

A useful quantity-based ratio:

``` text
Purchase Sales Ratio =
Purchase Quantity / Sales Quantity
```

Handle zero sales safely.

### Activity Status

Use descriptive statuses:

``` text
PURCHASE_ONLY
SALES_ONLY
BALANCED
PURCHASE_AHEAD
SALES_AHEAD
```

Conceptual rules:

``` text
PURCHASE_ONLY  => purchase > 0, sales = 0
SALES_ONLY     => purchase = 0, sales > 0
BALANCED       => purchase approximately/equally matches sales
PURCHASE_AHEAD => purchase > sales
SALES_AHEAD    => sales > purchase
```

Do not introduce an arbitrary `BALANCED` tolerance silently.

These statuses describe period activity only:

``` text
PURCHASE_AHEAD != OVERSTOCK
SALES_AHEAD != STOCKOUT
```

Actual inventory is required for those conclusions.

### Summary

Return useful aggregate values such as:

``` text
purchaseQuantity
purchaseAmount
salesQuantity
salesAmount
salesCost
grossProfit
purchaseSalesRatio
quantityDifference
amountDifference
productCount
purchaseOnlyCount
salesOnlyCount
balancedCount
purchaseAheadCount
salesAheadCount
```

## 15. Important Purchase-vs-Sales Interpretation

Example:

``` text
Received Purchases = 100 units
Sales              = 30 units
```

Valid:

``` text
Activity: PURCHASE_AHEAD
Period Difference: +70 units
```

Invalid without inventory evidence:

``` text
70 units are overstock
```

The business may have opening stock conditions, seasonal demand, future
orders, promotions, or long supplier lead times. Overstock belongs to
the dedicated inventory-aware endpoint.

## 16. Pending Receiving

Conceptually:

``` text
Pending Quantity =
Ordered Quantity - Received Quantity - valid adjustments
```

But use the actual receiving lifecycle.

Useful information may include:

``` text
purchaseOrderId
purchaseOrderNumber
supplier
orderedQuantity
receivedQuantity
pendingQuantity
deliveryDueDate
daysOverdue
```

Keep logic reusable if a dedicated pending-receiving endpoint is added
later.

## 17. Business Interpretation Rules

Prefer evidence:

``` text
Purchase cost increased 12.4%
Purchase quantity is 70 units ahead of sales
Supplier A represents 64% of purchase value
Current stock represents approximately 95 days of recent sales
```

Avoid unsupported conclusions:

``` text
This purchase was bad
You are wasting money
Supplier A is dangerous
You definitely have overstock
Stop buying this product
```

MarketChain should support decisions rather than make unsupported
decisions for the owner.

## 18. Currency

Do not silently aggregate different currencies.

Codex must inspect existing currency/base-currency/exchange-rate
behavior and reuse it. Do not build a new FX subsystem as part of this
task.

## 19. Returns and Status Filtering

Inspect actual repository behavior for:

``` text
purchase returns
sales returns
partial receiving
partial returns
cancelled POs
cancelled sales
```

Do not double-subtract `returnQuantity` if another field is already net
of returns.

Find and reuse actual enum/constants for:

``` text
PurchaseOrder.status
PurchaseOrder.step
PurchaseOrder.type
PurchaseOrderEntry.status
Transaction.status
Transaction.step
Transaction.type
TransactionEntry.status
```

Never invent `COMPLETED`, `APPROVED`, `ACTIVE`, `SALE`, `RECEIVED`, etc.
unless they actually exist.

## 20. Security

Preserve existing client/tenant/location/user authorization.
`locationId` must not allow reporting against an unauthorized location.

## 21. Performance

Aggregate in SQL where practical:

``` text
SUM
COUNT
COUNT(DISTINCT ...)
GROUP BY
COALESCE
```

Avoid N+1 queries and loading entire transaction datasets into memory.

Inspect existing indexes before adding any.

Potential query fields:

``` text
PurchaseOrder.createdAt
PurchaseOrder.locationId
PurchaseOrder.supplierId
PurchaseOrder.status
PurchaseOrder.type
PurchaseOrderEntry.purchaseOrderId
PurchaseOrderEntry.itemId
PurchaseOrderEntry.variantId
Transaction.createdAt
Transaction.locationId
Transaction.status
Transaction.type
TransactionEntry.transactionId
TransactionEntry.productId
TransactionEntry.productVariantId
ProductSupplier.productVariantId
ProductSupplier.supplierId
```

## 22. Rounding

Reuse the existing helper if present. Otherwise:

``` ts
private round(value: number, decimals = 2): number {
    const factor = Math.pow(10, decimals);
    return Math.round((value + Number.EPSILON) * factor) / factor;
}
```

Return numeric API values. Currency/percentage display formatting
belongs to the frontend/shared formatter.

## 23. Edge Cases

Safely handle:

``` text
no purchase orders
no receiving
no sales
purchase-only products
sales-only products
zero previous cost
zero sales quantity
zero current stock
missing variant
partial receiving
returns
cancelled transactions
null numeric fields
multiple locations
multiple suppliers
multiple currencies
missing ProductSupplier
zero lead time
missing reorder point
```

Never return `NaN` or `Infinity`. Use `null` when a value is
mathematically undefined and zero would be misleading.

## 24. Suggested Service Structure

Follow existing architecture first. Conceptually:

``` text
ReportPurchaseController
ReportPurchaseService
PurchaseOrderRepository
existing Transaction repository/service
existing inventory repository/service
```

Potential methods:

``` ts
getSummary(...)
getTrend(...)
getProducts(...)
getSuppliers(...)
getPriceIncrease(...)
getOverstockRisk(...)
getReorderRecommendation(...)
getSupplierConcentration(...)
getPurchaseVsSales(...)
```

## 25. Implementation Order

``` text
1. Inspect repository entities/enums/report conventions.
2. Verify PO and PO-entry semantics.
3. Verify receiving and purchase-return semantics.
4. Verify sales and sales-return semantics.
5. Locate actual inventory/QOH source.
6. Locate currency handling.
7. Add ProductSupplier only if missing.
8. Implement summary.
9. Implement trend.
10. Implement products.
11. Implement suppliers.
12. Implement price increase.
13. Implement supplier concentration.
14. Implement purchase vs sales.
15. Implement overstock using actual inventory.
16. Implement reorder using actual inventory and supplier data.
17. Add/update controller endpoints.
18. Add tests.
19. Run typecheck, lint, and tests.
20. Fix introduced issues.
```

Do not finalize Overstock/Reorder using fake stock calculations merely
to make the endpoints appear complete.

## 26. Testing Requirements

Test at minimum:

### Summary

-   multiple POs/entries
-   partial/full receiving
-   returns
-   cancelled PO
-   no purchases
-   multiple suppliers
-   location filtering

### Trend

-   DAY/WEEK/MONTH
-   chronological order
-   empty result
-   location filtering

### Products

-   same variant across many POs
-   weighted average cost
-   multiple suppliers
-   partial receiving
-   returns
-   sorting/pagination

### Suppliers

-   multiple suppliers
-   purchase share
-   multiple products/POs
-   zero total purchase amount

### Price Increase

-   increase/decrease/no change
-   no previous purchases
-   quantity-weighted cost

Weighted average example:

``` text
10 units @ 5
90 units @ 7

(10*5 + 90*7) / 100 = 6.80
```

Do not use `(5+7)/2`.

### Purchase vs Sales

-   purchase only
-   sales only
-   purchase ahead
-   sales ahead
-   balanced
-   zero sales
-   variant matching
-   gross profit
-   summary counts
-   location filtering

### Overstock

Only after real inventory source exists: - high stock/low sales - zero
sales - low stock/high sales - returns/adjustments/transfers where
applicable

### Reorder

-   above/at/below reorder point
-   lead time
-   MOQ
-   missing preferred supplier
-   zero recent sales

## 27. Acceptance Criteria

The task is complete when:

-   All four core purchase report APIs work.
-   Intelligence endpoints use reliable source data.
-   Existing purchase/sales enums are reused.
-   Invalid/cancelled transactions are excluded correctly.
-   Partial receiving and returns follow current business semantics.
-   Weighted purchase cost is used where required.
-   Price increase compares comparable periods.
-   Purchase vs Sales includes both purchase-only and sales-only
    products.
-   Purchase vs Sales does not pretend period difference is QOH.
-   Overstock uses the real inventory source.
-   Reorder uses actual inventory/reorder/supplier data.
-   Supplier concentration is based on purchase share.
-   Mixed currencies are not silently summed.
-   Existing security/location/client filters remain intact.
-   No N+1 queries are introduced.
-   No NaN/Infinity is returned.
-   Existing response conventions are preserved.
-   Tests, typecheck, and lint pass.

## 28. Codex Repository Inspection Checklist

Before coding, search for:

``` text
PurchaseOrder
PurchaseOrderEntry
purchase receiving service
purchase return service
purchase status/type enums

Transaction
TransactionEntry
sales creation/calculation
sales return logic
sales status/type enums

Product
ProductVariant
Inventory
Stock
Stock Ledger
Location Stock
QOH

Supplier
ProductSupplier

ReportPurchaseController
ReportPurchaseService
other report modules

currency
exchange rate
base currency

pagination
response wrapper
date helper
round helper

authentication
authorization
location/client/tenant filtering
```

## 29. Codex Final Instruction

Treat this document as the functional requirement and the existing
MarketChain ERP repository as the technical source of truth.

Before changing code, inspect existing entities, enums, purchase
receiving/returns, sales/returns, inventory/QOH, report patterns, shared
helpers, security filters, and currency behavior.

Make the smallest safe implementation changes.

Do NOT:

``` text
invent enum/status values
duplicate entities/helpers
change unrelated modules
rewrite purchasing or sales workflow
guess QOH
treat purchases - sales as current stock
treat PURCHASE_AHEAD as automatically OVERSTOCK
treat SALES_AHEAD as automatically STOCKOUT
use simple AVG(cost) where weighted average is required
silently mix currencies
match products by display name
count draft/cancelled transactions
invent arbitrary risk thresholds
```

The final business goal is to move the owner from:

> "I purchased \$20,000 this month."

to:

> "What did I purchase? Which products consumed my budget? Which
> supplier am I dependent on? Which costs increased? Am I buying faster
> than I sell? Do I have too much stock? What should I reorder next?"
