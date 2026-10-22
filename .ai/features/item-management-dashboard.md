Add the four summary cards shown in the attached screenshot to my existing **Item Management page**.

First read the existing design system Markdown and relevant frontend/backend rules. Inspect the current item, stock, pricing, warehouse, and purchase-order services. Reuse existing components, design tokens, icons, formatting utilities, permissions, and query patterns.

## 1. Scope and placement

- Add the cards below the existing page header and above the item filters/table.
- Preserve all existing page functionality, search, filters, item actions, table columns, pagination, and navigation.
- Do not redesign the rest of Item Management.
- Use actual application data; screenshot values are visual references only.

## 2. Shared layout and appearance

- Four equal-width, equal-height cards in one desktop row.
- Two columns on tablet and one on mobile.
- White backgrounds, rounded corners, subtle borders/shadows, and consistent gaps.
- Upper section: small uppercase heading, large value, and top-right icon tile.
- Lower section: softly tinted background containing supporting metrics.
- Keep footer sections aligned across the cards.
- Use dark navy text, teal for healthy values, red for pricing risks, amber for stock warnings, and blue for incoming stock.
- Match the screenshot’s visual hierarchy using the existing design system.
- Allow content to wrap without clipping or introducing awkward abbreviations.

## 3. Card: Total Inventory Valuation

Reference content:
- Heading: TOTAL INVENTORY VALUATION.
- Main value: $184,250.00.
- Wallet icon inside a mint rounded square.
- Pale blue-gray footer containing:
  - Upward-trend icon.
  - +3.4% MoM in teal.
  - Separator dot.
  - Retail cap $268,400.00.
  - Second line: 6,537 Active SKUs across 9 facilities.

Data requirements:
- Inventory valuation must use the existing stock valuation method and applicable on-hand quantities.
- Retail cap means potential retail value at current selling prices. Prefer the clearer label “Retail value” if consistent with project terminology.
- Count distinct active SKUs; do not count the same SKU once per facility.
- Count facilities within the authorized reporting scope.
- Calculate month-over-month movement only when comparable historical valuation data exists.
- If historical data is unavailable, omit the MoM indicator rather than inventing a trend.
- Follow existing currency conversion and valuation rules.

## 4. Card: Pricing & Margin Health

Reference content:
- Heading: PRICING & MARGIN HEALTH.
- Main value: 18 Alerts in dark red.
- Compact pale red badge: ACTION REQ.
- Money/pricing icon inside a pale red rounded square.
- Pale pink footer containing:
  - Left: 14 Cost > Price (Loss).
  - Right: 4 Zero Retail.
  - Warning icon and text:
    “Urgent review needed for margins”.

Data requirements:
- Identify products whose applicable cost exceeds their selling price.
- Identify products with a confirmed zero retail price.
- Distinguish zero prices from missing or invalid prices.
- Respect legitimate free/non-sale items according to existing rules.
- Define whether alerts count distinct SKUs or SKU/location/price-tier combinations, and apply that definition consistently.
- Avoid double-counting overlapping conditions in the total alert count.
- Cost > Price is a pricing-risk indicator, not proof of a realized accounting loss. Prefer “Below Cost” where appropriate.
- When no alerts exist, show a calm healthy state with suitable text and color.

If supported by existing navigation, make the breakdowns open Item Management filtered to the relevant pricing issue.

## 5. Card: Stock Health & Deficits

Reference content:
- Heading: STOCK HEALTH & DEFICITS.
- Main value: 44 Action Req. in amber/brown.
- Clipboard/check icon inside a pale amber rounded square.
- Light warm footer containing two adjacent status panels:
  - Pale red: red dot, Out of Stock, 12.
  - Pale amber: amber dot, Low Stock, 32.
- Bottom line:
  - Downward-trend icon.
  - “Est. lost daily velocity:”
  - Right-aligned ~$1,420.00.

Data requirements:
- Use the existing available-stock definition and configured reorder thresholds.
- Keep out-of-stock and low-stock categories mutually exclusive.
- Apply existing rules for stock-tracked items, bundles, services, inactive items, and negative stock.
- Clearly define whether counts represent unique SKUs or SKU/location combinations.
- The total action count must reconcile with the displayed breakdown.
- For multi-location scope, avoid hiding a branch stockout simply because another branch has stock; use the established location-aware reporting policy.

The screenshot’s dollar-valued “lost daily velocity” label is ambiguous. Use “Estimated daily sales at risk” only if a supported calculation exists based on demand history and selling prices.
- Do not present this estimate as confirmed lost revenue.
- Provide a tooltip explaining its basis.
- If unsupported, show “Estimate unavailable” or omit that metric without fabricating a value.

Connect stock breakdowns to the existing filtered stock/item view when supported.

## 6. Card: Incoming Purchase Orders

Reference content:
- Heading: INCOMING PURCHASE ORDERS.
- Main value: 350 Units in blue.
- Delivery truck icon inside a pale blue rounded square.
- Pale blue-gray footer containing:
  - Left: Across 4 open supplier POs.
  - Right teal label: Toul Kork Hub.
  - Second line:
    “Next freight arrival scheduled tomorrow, 09:30 AM”.

Data requirements:
- Calculate incoming quantity from outstanding quantities on eligible open/approved purchase orders.
- Subtract quantities already received and canceled.
- Count distinct purchase orders.
- Do not include drafts unless the existing procurement policy treats them as incoming commitments.
- Do not combine incompatible units of measure under one misleading total; use existing unit normalization or an appropriate breakdown.
- Show the destination associated with the next scheduled arrival.
- If multiple destinations apply to the aggregate, label them accurately rather than implying all units go to one hub.
- Use the actual expected arrival date/time in the configured timezone.
- If no ETA exists, show “Arrival date not scheduled”.
- If no incoming orders exist, display a useful zero state.

Link to the existing pending-receiving or purchase-order view when available and permitted.

## 7. Data scope and integration

- Respect tenant, branch, warehouse, location, and permission boundaries.
- Reuse the existing page location scope.
- Clearly distinguish overall inventory metrics from table-only search results.
- Do not calculate summary cards from only the current paginated item list.
- Prefer existing aggregate endpoints; extend the appropriate backend service if necessary.
- Avoid per-item requests or fetching the complete inventory history into the browser.
- Refresh affected cards after successful stock, pricing, item, or purchase-order changes using existing query invalidation patterns.
- Keep calculations consistent with other inventory and purchasing reports.
- Do not expose restricted valuation or margin data to unauthorized users.

## 8. Loading and error states

- Use skeletons that preserve card dimensions.
- Distinguish confirmed zero from unavailable data.
- Handle each card’s error independently where practical.
- Provide a retry through existing patterns.
- Prevent stale requests from replacing newer location-filter results.
- Keep meaningful text labels alongside colors and icons.
- Make clickable metrics keyboard-accessible with visible focus states.

## 9. Verification

Verify:
- All four cards and every supporting metric from the screenshot are represented.
- Cards align and remain equal in height at each responsive breakpoint.
- Existing Item Management features continue working.
- Counts, quantities, valuation, and alert totals reconcile.
- Location scope, permissions, loading, empty, and error states work correctly.
- Any metric links open the correct filtered existing page.