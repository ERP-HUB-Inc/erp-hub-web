Update the statistics cards on my existing Sales Orders page to match the attached screenshot closely.

First, read the existing design system Markdown and relevant frontend rules. Reuse existing components, design tokens, icons, and data integrations. Limit changes to the statistics cards and their data mapping; preserve the rest of the Sales Orders page.

## Layout and shared styling

- Four equal-width, equal-height cards in one row on wide desktop screens.
- Use a responsive grid: four columns on desktop, two on tablet, and one on mobile.
- Match the screenshot’s compact proportions: approximately 165px tall on desktop, 20px internal padding, and 16–20px gaps.
- White background, rounded corners around 16px, and a subtle border or shadow.
- A thin accent strip along each card’s bottom edge, clipped to its rounded corners.
- Small uppercase muted headings at the top left.
- An icon inside a softly tinted rounded square at the top right.
- Large bold dark numbers, with smaller amounts or units aligned on the same baseline.
- Position the supporting information consistently near the bottom so all cards align.
- Use the project’s existing font and accessible text contrast.
- Keep all labels readable without overlap or unwanted truncation.

## Card 1: TODAY’S ORDERS

Reference content:
- Heading: TODAY’S ORDERS
- Top-right icon: shopping cart/order icon in green, on a pale tinted background.
- Main value: 38
- Inline amount: ($2,450.00)
- Bottom line: green upward arrow and 18%, followed by muted text:
  “vs. yesterday (32 orders)”
- Bottom accent: dark green transitioning to mint.

Data behavior:
- Use today’s order count and corresponding amount from existing data.
- Calculate the comparison against yesterday using the same order eligibility rules.
- Use the configured business timezone for day boundaries.
- Round the percentage consistently; 38 versus 32 displays approximately 18.75%, or 19% when rounding to the nearest whole percent. The screenshot’s 18% is reference text, not a formula to hardcode.
- Handle decreases, no change, and a zero previous-day count without misleading percentages.

## Card 2: CHAT & SOCIAL ORDERS

Reference content:
- Heading: CHAT & SOCIAL ORDERS
- Top-right icon: chat bubbles in muted purple-gray on a pale tinted background.
- Main value: 24
- Inline amount: ($1,680.00)
- Bottom row: three compact pale pill badges distributed across the width:
  - Blue dot · Telegram 14
  - Muted purple-gray dot · FB 7
  - Dark muted dot · TikTok 3
- Channel names are muted; counts are darker and slightly emphasized.
- Bottom accent: deep blue.

Data behavior:
- Map the total and amount from actual chat/social order sources.
- Map Telegram, Facebook, and TikTok counts from existing source identifiers.
- Preserve any other supported sources in the data. If additional channels exist, allow badges to wrap or use a compact overflow treatment without changing the desktop reference unnecessarily.
- Do not infer an order’s source from its payment method or courier.

## Card 3: READY FOR DISPATCH

Reference content:
- Heading: READY FOR DISPATCH
- Top-right icon: outlined package/cube in blue on a pale blue background.
- Main value: 12
- Inline unit: Parcels
- Bottom left: red dot and red “Requires Waybills”.
- Bottom right: muted “6 J&T • 6 Grab”.
- Bottom accent: bright blue.

Data behavior:
- Use the existing ready-for-dispatch definition.
- Confirm whether the system counts orders or parcels; label the unit accurately and do not assume one order equals one parcel.
- Show “Requires Waybills” only when eligible shipments actually lack waybills.
- When no waybills are missing, show an accurate neutral or positive state.
- Derive courier counts from real eligible shipments. Handle additional couriers gracefully.

## Card 4: UNPAID & COD IN-TRANSIT

Reference content:
- Heading: UNPAID & COD IN-TRANSIT
- Top-right icon: wallet in muted gray-green on a pale blue background.
- Main value: 5
- Inline amount: ($320.00)
- Bottom left: “4 Cash on Delivery”.
- Bottom right: “1 Bank Verif.”
- Bottom accent: slate gray.

Data behavior:
- Inspect existing payment and fulfillment statuses to identify outstanding unpaid orders, COD shipments in transit, and transfers awaiting bank verification.
- Count unique orders so overlapping conditions do not double-count an order.
- Calculate the amount according to the existing outstanding-balance definition.
- Derive the COD and bank-verification breakdown from actual data.
- Do not treat a payment method alone as proof that an order is unpaid, paid, or awaiting verification.

## Integration and states

- Use actual API/store values in production. Screenshot numbers are visual reference values only.
- Preserve existing date, branch, location, and permission scopes. Make each card’s time scope clear and consistent with the page.
- Reuse the existing currency formatter; do not sum different currencies without the application’s established conversion rules.
- If required metrics are unavailable, report the missing fields or endpoint clearly. Do not fabricate production statistics.
- Provide loading skeletons that preserve card dimensions.
- Show 0 for confirmed zero results and “—” for unavailable data.
- Preserve existing card navigation if present. Do not add unsupported click actions.
- Avoid fixed heights that clip content when badges wrap or text is enlarged.

## Verification

- Compare the result against the screenshot for card order, sizing, spacing, headings, icons, typography, badges, bottom alignment, and accent strips.
- Verify all four cards remain equal in height at each grid breakpoint.
- Check loading, zero, unavailable, long-label, and small-screen states.
- Run appropriate project lint/type checks and relevant existing tests.
- Report changed files and any missing data integrations.

Implement the changes fully in the existing page.

codex resume 01a125b6-7500-76a0-916d-c8fe2955a2cf