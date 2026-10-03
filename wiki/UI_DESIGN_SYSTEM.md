# MarketChain UI Design System

> Defines the default visual language and UX rules for MarketChain.  
> All frontend work should follow this document unless a task explicitly overrides it.

## 1. Non-Negotiable Rules

- Use `lucide-react` for icons.
- Use a light lavender / gray-purple application background.
- Use white, rounded cards with subtle borders and restrained shadows.
- Use semantic colors consistently; do not use one accent color for everything.
- KPI cards in the same row must have equal height.
- Do not invent chart data.
- Do not expose `null`, `undefined`, `NaN`, `Infinity`, or raw backend values.
- Prefer business-friendly wording over technical/accounting terminology.
- Do not rely on color alone to communicate status.
- Reuse shared components before creating page-specific variants.

## 2. Design Character

MarketChain should feel:

- modern
- calm
- professional
- easy to scan
- friendly for SME owners
- consistent across ERP and Live modules

Reference feeling:

**shadcn/ui + modern SaaS dashboard + SME business software**

Avoid:

- heavy black UI
- dense legacy ERP layouts
- large gradients
- excessive shadows
- random colors
- decorative complexity
- table-first dashboards

## 3. Page Surface

Preferred page background:

```tsx
bg-[#F7F7FC]
```

Acceptable alternative:

```tsx
bg-violet-50/30
```

Page padding:

```tsx
p-5 md:p-6
```

Section spacing:

```tsx
space-y-5
```

or:

```tsx
gap-5
```

## 4. Cards

Default:

```tsx
rounded-2xl border border-slate-200/70 bg-white shadow-sm
```

Typical content:

```tsx
p-5 md:p-6
```

Rules:

- white surface
- soft border
- restrained shadow
- consistent radius
- clear visual hierarchy
- enough whitespace

Avoid fully colored cards unless explicitly required.

## 5. Semantic Color System

### Sales / Revenue / Primary Metric
Purple / Indigo

```tsx
text-violet-600
bg-violet-50
border-violet-100
```

### Profit / Positive
Emerald / Teal

```tsx
text-emerald-600
bg-emerald-50
border-emerald-100
```

### Cost / Expense / Attention
Orange / Amber

```tsx
text-orange-600
bg-orange-50
border-orange-100
```

or:

```tsx
text-amber-700
bg-amber-50
border-amber-100
```

### Loss / Failure / Destructive
Rose / Red

```tsx
text-rose-600
bg-rose-50
border-rose-100
```

Do not use red merely because a target is not yet reached.

### Neutral
Slate

```tsx
text-slate-600
bg-slate-50
border-slate-200
```

## 6. Typography

Page title:

```tsx
text-2xl font-bold tracking-tight text-slate-950
```

Section title:

```tsx
text-lg font-semibold text-slate-950
```

KPI label:

```tsx
text-sm font-semibold uppercase tracking-wide text-slate-500
```

KPI value:

```tsx
text-3xl font-bold tracking-tight text-slate-950
```

Body:

```tsx
text-sm text-slate-600
```

Muted:

```tsx
text-sm text-slate-500
```

## 7. KPI Cards

Recommended desktop grid:

```tsx
grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4 items-stretch
```

Card:

```tsx
<Card className="h-full rounded-2xl">
  <CardContent className="flex h-full flex-col p-6">
    <div className="flex items-start justify-between">
      {/* label + visual */}
    </div>

    <div className="mt-3">
      {/* main value */}
    </div>

    <div className="mt-auto pt-4">
      {/* helper / trend */}
    </div>
  </CardContent>
</Card>
```

Rules:

- equal height in same row
- target visual height around 160–180 px on desktop
- use `mt-auto` to align footers
- do not overload cards
- optional sparkline only if real historical data exists

## 8. Icons

Use only:

```text
lucide-react
```

Typical size:

```tsx
h-5 w-5
```

Prefer small top-right icons or subtle icon containers.

Do not use emoji as product UI icons.

## 9. Charts

Charts should use:

- white rounded card
- soft dotted grid
- no heavy axis borders
- smooth lines
- simple legends
- clean tooltips
- limited series count

Suggested mapping:

```text
Revenue → Violet
Profit  → Emerald / Teal
Cost    → Orange
Loss    → Rose
```

Never invent series values.

## 10. Progress Bars

Sales target:

```tsx
bg-violet-600
```

Positive completion:

```tsx
bg-emerald-500
```

Attention:

```tsx
bg-amber-500
```

Do not use black progress bars.

## 11. Status Badges

Behind target:

```tsx
bg-amber-50 text-amber-700 border-amber-200
```

Target reached:

```tsx
bg-emerald-50 text-emerald-700 border-emerald-200
```

Negative profit / failure:

```tsx
bg-rose-50 text-rose-700 border-rose-200
```

Neutral:

```tsx
bg-slate-50 text-slate-600 border-slate-200
```

Always pair color with clear text.

## 12. Business Language

Prefer:

- Sales This Month
- Sales Target
- Sales Still Needed
- Product Cost
- Gross Profit
- Profit Margin
- Business Expenses
- Estimated Profit

Avoid exposing raw or overly technical terms when a simpler label is available.

## 13. Tables

Dashboards should not lead with raw tables.

Preferred order:

1. KPI summary
2. visual breakdown
3. business insight
4. detailed table

Table style:

```tsx
rounded-xl border bg-white
```

Header:

```tsx
bg-slate-50 text-slate-600
```

Use sticky headers for long tables where useful.

## 14. Forms

Inputs:

```tsx
rounded-lg border-slate-200 bg-white
```

Labels:

```tsx
text-sm font-medium text-slate-700
```

Helper:

```tsx
text-sm text-slate-500
```

Error:

```tsx
text-sm text-rose-600
```

Validation messages should be specific and user-readable.

## 15. Buttons

Primary:
- brand violet / existing project primary

Secondary:
- neutral / outline

Destructive:
- rose/red only for destructive actions

Do not use dashboard semantic colors as random action colors.

## 16. Empty States

Never show:

```text
null
undefined
NaN
Infinity
-
```

Prefer:

- No sales data is available yet.
- No business expenses recorded for this period.
- No sales target has been set for this period.

## 17. Responsive Rules

Desktop:
- 4 KPI cards
- 2-column content sections

Tablet:
- 2 KPI cards
- 1–2 content columns

Mobile:
- single-column stack
- preserve readable spacing
- avoid forced desktop density

## 18. Accessibility

- Do not rely on color alone.
- Keep text contrast readable.
- Use semantic HTML.
- Interactive controls need visible focus states.
- Icon-only actions require labels/tooltips.
- Important business values should not use tiny text.

## 19. Reusable Components

Prefer shared components such as:

```text
MetricCard
DashboardSection
StatusBadge
MiniSparkline
SectionHeader
EmptyState
BusinessSummaryCard
DataTable
```

Before adding a new component, check whether an existing shared one can be extended.

## 20. Codex Rule

Before implementing UI changes:

1. Read this file.
2. Inspect existing shared components.
3. Preserve business logic and API behavior.
4. Reuse project formatters and design tokens.
5. Follow this system unless the task explicitly overrides it.
