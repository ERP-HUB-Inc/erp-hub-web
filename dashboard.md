# Dashboard UI and Implementation Notes

Source component: `src/pages/Dashboard/ERPSalesDashboard.jsx`

Current route wiring: `src/layout/main-app.jsx` lazy-loads `../pages/Dashboard/ERPSalesDashboard`, so this file is the active dashboard screen. The older dashboard implementation still exists at `src/pages/Dashboard/index.jsx` and can be used as a reference for API behavior, translations, and table patterns.

## Purpose

`ERPSalesDashboard.jsx` is a sales dashboard UI for ERP/POS reporting. It currently mixes live summary data with mock chart, category, transaction, and goal data. Future implementation work should keep the visual direction but replace static values with typed service data and project-standard components where possible.

## Main UI Structure

The dashboard renders inside a full-height light background layout:

- Top bar with page title, subtitle, transaction search input, date range selector, export button, and notification button.
- KPI card grid with four summary cards:
  - Gross Sales
  - Gross Profit
  - Total Orders
  - Avg Order Value
- Chart row with:
  - Revenue vs Costs vs Profit area chart
  - Weekly Sales bar chart
- Secondary row with:
  - Sales by Category donut chart and progress list
  - Monthly Goal card

There is also a `Sidebar` component in the file, but it is currently commented out in the render tree.

## Local Components

`AnimatedNumber`

- Animates numeric KPI values from zero to the target value.
- Uses `requestAnimationFrame`.
- Re-runs when `target` changes.

`Sparkline`

- Renders a small inline SVG trend line for stat cards.
- Reads `sales`, `revenue`, or `profit` from each data item.

`StatCard`

- Reusable KPI card shell.
- Shows label, animated value, delta pill, sublabel, and sparkline.

`ChartTooltip`

- Custom Recharts tooltip.
- Formats values using `fmtK`.

`CategorySection`

- Shows sales categories in a donut chart plus a progress list.
- Owns local date-range state, currently only changing the select value.

`Sidebar`

- Static navigation/sidebar prototype.
- Not currently rendered.

## Data Sources

Live data currently used:

- `DashboardService.getTodayTotal(option)`
- Endpoint path from `src/services/dashboard.js`: `reports/dashboard/today_total?rangeFilter=${range}`

The component expects `dashboardSummaries` to be an array where values are read by fixed index:

- index `0`: gross sales/revenue fields
- index `1`: total item cost
- index `2`: sales discount
- index `3`: gross profit and growth percentage
- index `4`: total sales/orders and growth percentage
- index `5`: expense

Important fields currently referenced:

- `value`
- `growthPercentage`
- `diffRevenueFromLLastAsPercentage`
- `diffSaleFromLastAsPercentage`

Static/mock data currently used:

- `revenueData`
- `weeklyTrend`
- `categoryData`
- `transactions`
- `navItems`
- Monthly goal values
- Avg Order Value value
- Top bar date text

## Implementation Gaps To Handle Next

1. Wire the date range selector to data fetching.
   - State exists as `dateRange`.
   - API state exists as `option`.
   - Current `useEffect` fetches once and does not refetch when `option` changes.

2. Replace fixed array-index reads with safer mapping.
   - `getDashboardValue(index, key)` assumes every index exists.
   - Prefer a named adapter from API response to dashboard view model.

3. Replace mock chart data with real API data.
   - Old dashboard uses `DashboardService.getOverallSales(startDate, endDate)`.
   - Consider extending backend data or adding a new service method for revenue/cost/profit series.

4. Replace mock category data with real category reporting.
   - Old dashboard uses `InventoryService.getPopularCategories(7)`.
   - Current category chart needs `name`, `value` percentage, `amount`, and `color`.

5. Implement top bar controls.
   - Search input is visual only.
   - Export button is visual only.
   - Notification button is visual only.

6. Remove or implement unused/static sections.
   - `transactions` is declared but not rendered.
   - `navItems` and `Sidebar` are present but disabled.
   - Imports for `moment`, `lodash`, `Util`, `InventoryService`, `SelectPeriodOption`, and `Translate` are currently unused in this component.

7. Fix hardcoded copy and dates.
   - Subtitle currently says `Monday, 30 May 2026 · Real-time data`.
   - Monthly goal card currently says `May 2026`.
   - Use `moment` or the project date utility if these should be dynamic.

8. Review responsiveness.
   - `statsGrid` uses `repeat(4, 1fr)` with no mobile breakpoint.
   - `chartsRow` uses flex rows with no small-screen stacking rule.
   - Inline styles make media queries harder; consider moving layout-critical CSS to a stylesheet if needed.

## Styling Notes

Design tokens are stored in local constants:

- `T` contains colors.
- `FONT` defines the dashboard font stack.
- `s` contains inline style objects.

The current visual style uses:

- White cards on a pale background.
- Purple as primary action/chart color.
- Teal, amber, and red for status and chart accents.
- Rounded cards and controls.
- Recharts for area, bar, and pie/donut charts.
- Ant Design `Select` for dropdowns.

If this becomes production UI, prefer moving repeated styles into shared components or CSS only when it matches existing project patterns. Keep visual changes scoped so the dashboard does not drift away from the rest of the app.

## Suggested Data Adapter Shape

Create a small adapter near the component before replacing API wiring:

```js
const toDashboardMetrics = (summaries = []) => ({
  grossSales: summaries[0]?.value || 0,
  grossSalesGrowth: summaries[0]?.diffRevenueFromLLastAsPercentage || 0,
  totalItemCost: summaries[1]?.value || 0,
  salesDiscount: summaries[2]?.value || 0,
  grossProfit: summaries[3]?.value || 0,
  grossProfitGrowth: summaries[3]?.growthPercentage || 0,
  totalOrders: summaries[4]?.value || 0,
  totalOrdersGrowth: summaries[4]?.growthPercentage || 0,
  expense: summaries[5]?.value || 0,
});
```

This keeps the existing API contract intact while reducing fragile repeated index lookups inside the render body.

## Manual Test Checklist

After future changes:

- Dashboard route loads without console errors.
- KPI cards render zero or fallback states before API data arrives.
- Date range changes refetch the expected API data.
- Charts render with empty, partial, and full datasets.
- Currency and percentage values are formatted consistently.
- Small screens do not overflow horizontally.
- Export/search/notification controls either work or are clearly removed.
- No sensitive sales/customer data is fetched or shown before permission checks, if permissions are added.

