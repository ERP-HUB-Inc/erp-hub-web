Please redesign the existing Sales Performance tab using the attached dashboard screenshot as the visual design reference.

IMPORTANT:
Do NOT copy the screenshot pixel-for-pixel.
Use it as the DESIGN SYSTEM reference:
- spacing
- card style
- background tone
- typography hierarchy
- rounded corners
- chart styling
- semantic colors
- clean SaaS dashboard feeling

DIRECTORY AND FILES
- src/app/modules/pos/components/reports/Sale/SalesReport.jsx


API SPECIFICATION
1. Sales Trend
   ``` [
    {
        "period": "2024-10-22",
        "salesRevenue": 215.51,
        "salesCost": 171.1,
        "grossProfit": 44.41,
        "grossMargin": 20.61,
        "transactionCount": 2,
        "itemsSold": 106
    },
    {
        "period": "2024-10-24",
        "salesRevenue": 20.51,
        "salesCost": 17.1,
        "grossProfit": 3.41,
        "grossMargin": 16.63,
        "transactionCount": 1,
        "itemsSold": 6
    }
  ]
  
2. Best Products
  ``` {
    "data": [
        {
            "productId": "0b7350e9-c8e7-4905-85f8-2ed8f9656153",
            "productVariantId": "994ebce6-2d34-44e1-b6c4-acfb57d1fb96",
            "itemName": "65″ AU8000 Crystal UHD Smart TV (2020 Model)",
            "description": null,
            "variantName": "",
            "unitName": null,
            "quantitySold": 5,
            "salesRevenue": 3747.25,
            "salesCost": 3600,
            "grossProfit": 147.25,
            "grossMargin": 3.93,
            "transactionCount": 5
        }
    ]}

3. Business Performance
  ``` {
      "period": {
          "fromDate": "2026-09-01",
          "toDate": "2026-09-30",
          "targetType": "MONTHLY"
      },
      "target": {
          "targetRevenue": 45000,
          "actualRevenue": 6786.2,
          "achievementPercent": 15.08,
          "remainingRevenue": 38213.8
      },
      "profitability": {
          "salesCost": 4973.4,
          "grossProfit": 1812.8,
          "grossMargin": 26.71
      },
      "operatingExpense": {
          "amount": 0,
          "coveragePercent": null,
          "surplus": 1812.8
      },
      "performance": {
          "targetStatus": "BELOW_TARGET",
          "expenseCoverageStatus": "NO_EXPENSE"
      }
  }


The existing business logic and API integration must remain unchanged.

==================================================
1. DESIGN DIRECTION
==================================================

Use a visual style similar to the provided dashboard reference.

The page should feel:
- modern
- soft
- clean
- premium but simple
- friendly for SME business owners
- less like a traditional accounting report
- easy to scan within a few seconds

Visual characteristics:

Page background:
- very light lavender / gray-purple
- similar to:
  bg-[#F7F7FC]
  or
  bg-violet-50/30

Cards:
- white background
- large rounded corners
- subtle neutral/lavender border
- minimal shadow
- spacious padding

Example:
rounded-2xl
border border-slate-200/70
bg-white
shadow-sm

Avoid:
- black-heavy UI
- dark cards
- strong gradients
- harsh borders
- dense tables
- excessive gray
- overly colorful backgrounds

==================================================
2. TYPOGRAPHY
==================================================

Use strong dark navy / near-black text for important values.

Suggested colors:

Main headings:
text-slate-950

Secondary labels:
text-slate-500
or
text-violet-900/50

Main KPI values:
text-slate-950

Use:
- font-semibold or font-bold for major values
- uppercase small labels for KPI titles where suitable
- muted helper text

Example hierarchy:

BUSINESS PERFORMANCE
small muted label

$6,786.20
large bold value

Total sales this month
small secondary description

==================================================
3. PAGE HEADER
==================================================

Top left:

Business Performance

Below:
Sep 1 – Sep 30, 2026

Use muted text for the date range.

Top right:
optional period selector if one already exists.

Example options:
Today
This Week
This Month
This Quarter
This Year

Do not introduce a new filter if the page currently does not support one.

==================================================
3A. TOP SUMMARY STATISTIC CARDS
==================================================

The top summary cards above the report tabs should use the same visual
design language as the Sales Performance dashboard.

These cards summarize the overall sales report and should remain visible
above:
- Sales Trend
- Best Products
- Business Performance

Current summary cards:
- Revenue
- Net Sales
- Orders
- Items Sold
- Discount
- Gross Profit

Design requirements:
- white card background
- large rounded corners
- subtle lavender-gray border
- soft shadow
- generous padding
- small uppercase muted label
- large dark navy value
- semantic icon tile using the same palette as Performance cards
- equal visual rhythm with the Business Performance KPI cards

Suggested styling:
- border-radius similar to rounded-2xl
- border similar to rgba(196, 190, 220, 0.7)
- background #ffffff
- shadow should be subtle, not heavy
- card value should use #17152B
- label should use #8885A7

Semantic icon colors:
- Revenue: purple
- Net Sales: teal / emerald
- Orders: purple / indigo
- Items Sold: teal
- Discount: orange / amber
- Gross Profit: rose or emerald, depending on business meaning

Do not make these cards look separate from the Performance tab design.
They should feel like part of the same modern SaaS dashboard system.

Do not add extra explanation text inside these top cards unless the UI
already supports it. Keep them compact and scannable.

==================================================
4. KPI CARD DESIGN
==================================================

Create 4 KPI cards in one row on desktop.

Desktop:
grid-cols-4

Tablet:
grid-cols-2

Mobile:
grid-cols-1

Use:

grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4 items-stretch

IMPORTANT:
All KPI cards MUST have equal height.

Suggested visual height:
160–180px

Use:
h-full
flex
flex-col

==================================================
5. KPI CARD STYLE
==================================================

Each KPI card should resemble the reference dashboard.

Structure:

Top:
small uppercase muted title

Middle:
large strong number

Bottom:
supporting information

Optional right side:
small sparkline / micro-chart / icon

Example:

GROSS SALES                 [sparkline]

$6,786.20

▲ 15.08%   vs target

Use whitespace generously.

Do not place too many details inside the KPI card.

==================================================
6. KPI CARDS
==================================================

CARD 1
Title:
SALES THIS MONTH

Value:
Actual revenue

Example:
$6,786.20

Accent:
Purple / Indigo

Icon:
DollarSign

Helper:
Total sales this month

Optional small right-side sparkline if historical data already exists.

--------------------------------------------------

CARD 2
Title:
GROSS PROFIT

Value:
Gross profit

Example:
$1,812.80

Accent:
Teal / Emerald

Icon:
TrendingUp

Helper:
After product cost

--------------------------------------------------

CARD 3
Title:
SALES TARGET

Value:
Achievement percentage

Example:
15.08%

Accent:
Purple / Indigo

Icon:
Target

Supporting line:
$6,786.20 of $45,000

Show a compact progress indicator if suitable.

--------------------------------------------------

CARD 4
Title:
PROFIT MARGIN

Value:
26.71%

Accent:
Pink / Rose or Teal

Icon:
Percent

Helper:
Profit kept from each $100 of sales

==================================================
7. COLOR SYSTEM
==================================================

Use the same visual color feeling as the reference dashboard.

Primary Purple:
#6C4CFF
or Tailwind violet-600

Teal:
#00BFA6
or emerald-500 / teal-500

Orange:
#F5A623
or amber-500

Pink / Rose:
#FF5C7A
or rose-500

Page background:
#F7F7FC

Text:
#17152B
or slate-950

Muted text:
#8885A7
or slate-500

Borders:
very soft lavender-gray

IMPORTANT:
Do NOT make all cards the same color.

Use semantic accents:

Sales:
Purple

Gross Profit:
Teal

Sales Target:
Indigo / Purple

Profit Margin:
Rose or Teal

Product Cost:
Orange

Business Expenses:
Amber / Orange

Estimated Profit:
Emerald

Loss:
Rose / Red

==================================================
8. COLOR USAGE RULE
==================================================

Do NOT fill the whole card with strong color.

Cards stay white.

Use semantic color on:
- small sparkline
- icons
- status pills
- progress bars
- comparison text
- tiny accent elements

Example:

<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50">
  <DollarSign className="h-5 w-5 text-violet-600" />
</div>

Keep the main value dark for readability.

==================================================
9. EQUAL CARD HEIGHT
==================================================

All KPI cards in the same row must have equal height.

Recommended structure:

<Card className="h-full rounded-2xl">
  <CardContent className="flex h-full flex-col p-6">

    <div className="flex items-start justify-between">
      title
      icon or sparkline
    </div>

    <div className="mt-3">
      main value
    </div>

    <div className="mt-auto pt-3">
      helper / comparison
    </div>

  </CardContent>
</Card>

Do not allow helper text length to change card height.

==================================================
10. SALES GOAL SECTION
==================================================

Below KPI cards, use a large white card similar to the large chart card in the reference.

Title:
Sales Goal

Top right:
status badge

Example:
Behind Target

Main content:

You've reached 15% of your monthly sales target.

Use a horizontal progress bar in purple.

Then show:

Sales so far
$6,786.20

Monthly target
$45,000.00

Still needed
$38,213.80

Keep layout simple and spacious.

Status colors:

Behind Target:
soft amber

Target Reached:
soft teal / green

Target Exceeded:
soft emerald

Do not use red unless there is a real loss/error.

==================================================
11. PROFIT BREAKDOWN
==================================================

Create another large card beside Sales Goal on desktop.

Title:
Where Your Sales Went

Use a clean breakdown:

Sales
$6,786.20

Product Cost
-$4,973.40

Gross Profit
$1,812.80

Business Expenses
-$0.00

Estimated Profit
$1,812.80

Use thin separators.

Semantic colors:

Sales:
purple

Product Cost:
orange

Gross Profit:
teal

Business Expenses:
amber

Estimated Profit:
emerald if positive
rose/red if negative

Do not over-color the text.
Keep labels neutral and use small colored indicators/icons.

==================================================
12. BUSINESS SUMMARY CARD
==================================================

Add a full-width white card below.

Title:
Business Summary

Example dynamic message:

Your business generated $6,786 in sales this month,
reaching 15% of your $45,000 sales target.

You still need $38,214 in sales to reach your target.

Your current gross profit is $1,813 with a 26.7% profit margin.

If operating expenses > 0:

After $1,200 in business expenses,
your estimated profit is $613.

Keep text short and friendly.

==================================================
13. FRIENDLY TERMINOLOGY
==================================================

Rename technical fields:

Target Revenue
→ Sales Target

Actual Revenue
→ Sales This Month

Achievement
→ Target Progress

Remaining Revenue
→ Sales Still Needed

Sales Cost
→ Product Cost

Gross Margin
→ Profit Margin

Expense Amount
→ Business Expenses

Surplus
→ Estimated Profit

Target Status
→ Sales Status

Expense Coverage Status
→ Expense Status

Do not expose difficult accounting terminology unnecessarily.

==================================================
14. LUCIDE-REACT
==================================================

Use lucide-react only.

Suggested imports:

import {
  DollarSign,
  Target,
  TrendingUp,
  Percent,
  Wallet,
  Package,
  CircleDollarSign,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

Do not use emoji.

Do not mix icon libraries.

==================================================
15. OPTIONAL SPARKLINES
==================================================

The reference dashboard uses tiny sparklines inside KPI cards.

If historical series data already exists in the current API:
- render a small sparkline inside the KPI card
- no axis
- no labels
- thin smooth line
- transparent background

Use:
Purple for Sales
Teal for Profit
Rose for Margin where suitable

If no historical data exists:
DO NOT invent fake data.

Instead use the lucide icon.

==================================================
16. CHART STYLE
==================================================

If this Performance page contains charts or if charts are added later,
follow this visual style:

- rounded chart cards
- white background
- dotted or very soft grid lines
- no heavy axis borders
- smooth lines
- medium stroke width
- simple legends
- lots of whitespace

Recommended series:

Revenue:
Purple

Cost:
Teal or Orange depending on context

Profit:
Orange or Emerald

Do not use random colors.

==================================================
17. ADVANCED DETAILS
==================================================

Keep raw metrics available but hidden by default.

Use:

View details

with:
Accordion
or
Collapsible

Inside:

Period
Target Type
Sales Target
Sales This Month
Target Progress
Sales Still Needed
Product Cost
Gross Profit
Profit Margin
Business Expenses
Expense Coverage
Estimated Profit
Sales Status
Expense Status

Do not show this raw table as the main screen.

==================================================
18. EMPTY / ZERO STATE
==================================================

Do not show:

Coverage: -
No Expense
NaN
Infinity
undefined
null

If operatingExpense === 0:

Show:
No business expenses recorded for this period.

If no target exists:

Show:
No sales target has been set for this period.

If percentage cannot be calculated:
hide or display a meaningful empty state.

==================================================
19. RESPONSIVE LAYOUT
==================================================

Recommended structure:

Business Performance                  [Period]

Sep 1 – Sep 30, 2026

[ Sales This Month ]
[ Gross Profit     ]
[ Sales Target     ]
[ Profit Margin    ]

[ Sales Goal                    ]
[ Where Your Sales Went         ]

[ Business Summary              ]

[ View Details                  ]

Desktop:
4 KPI columns
2 large content columns

Tablet:
2 KPI columns
1 or 2 content columns depending on width

Mobile:
1 column

==================================================
20. SPACING
==================================================

Use generous spacing similar to the reference.

Page:
p-5 / p-6

Card gap:
gap-5

Card padding:
p-5 / p-6

Section gap:
space-y-5 or gap-6

Avoid tightly packed content.

==================================================
21. REUSABLE COMPONENTS
==================================================

Extract reusable components where appropriate:

PerformanceMetricCard
SalesGoalCard
ProfitBreakdownCard
BusinessSummaryCard
PerformanceDetails
MiniSparkline

Use strict TypeScript.

Avoid any.

Example KPI props:

type PerformanceMetricCardProps = {
  title: string;
  value: string;
  description?: string;
  icon: React.ElementType;
  accent?: "purple" | "teal" | "orange" | "rose";
  trendText?: string;
  trendDirection?: "up" | "down" | "neutral";
};

==================================================
22. IMPORTANT DEVELOPMENT RULES
==================================================

- Inspect the current Performance implementation first
- Reuse the existing API response
- Preserve current backend contract
- Do not hardcode sample values
- Do not invent sparkline data
- Reuse existing currency/date formatters
- Keep existing loading states
- Keep existing errors
- Keep existing tabs working
- Do not rewrite unrelated components
- Keep TypeScript strict
- Avoid any
- Use existing shared UI components where possible
- Use lucide-react
- Keep the result production-ready

==================================================
23. FINAL VISUAL TARGET
==================================================

The final design should visually resemble the attached dashboard in terms of:

- very light lavender page background
- white rounded cards
- dark navy primary text
- muted purple-gray secondary text
- purple as a major accent
- teal for positive/profit data
- orange for cost-related data
- rose for negative/change indicators
- large readable KPI values
- generous whitespace
- consistent card height
- subtle borders
- soft modern SaaS appearance

However, keep the CONTENT specifically designed for SME business owners and sales performance.

The end user should be able to answer immediately:

1. How much did I sell?
2. How much profit did I make?
3. How close am I to my sales target?
4. What is my profit margin?
5. How much did my products cost?
6. How much more do I need to sell?
7. How much profit remains after expenses?
