
# MarketChain ERP — Financial Health & Decision Report

## 1. Purpose

The purpose of the MarketChain ERP Financial Report is to help small and medium-sized business owners understand the financial condition of their business and make better business decisions based on actual operational data.

The report should not only show financial numbers. It should transform business transactions into understandable insights that answer:

> **“How is my business doing financially, and what should I consider doing next?”**

MarketChain ERP should connect data from:

- Sales
- Purchases
- Inventory
- Expenses
- Payments
- Receivables
- Payables
- Cash
- Business investment
- Other operational transactions

and convert them into a clear view of the business's financial health.

API Specification
Get Financial Dashboard
http://localhost:3080/api/report/financial/dashboard?startDate=2026-10-01&endDate=2026-10-31&locationId=1&targetType=MONTHLY
Response:
```
{
    "period": {
        "startDate": "2026-10-01",
        "endDate": "2026-10-31",
        "previousStartDate": "2026-08-31",
        "previousEndDate": "2026-09-30"
    },
    "cards": {
        "revenue": {
            "amount": 0,
            "previousAmount": 0,
            "changePercent": 0
        },
        "grossProfit": {
            "amount": 0,
            "previousAmount": 0,
            "changePercent": 0,
            "margin": 0
        },
        "operatingExpenses": {
            "amount": 5070,
            "previousAmount": 0,
            "changePercent": 100
        },
        "netProfit": {
            "amount": -5070,
            "previousAmount": 0,
            "changePercent": 100,
            "margin": 0
        },
        "cashAvailable": 0,
        "accountsReceivable": 28776.24,
        "accountsPayable": 228,
        "inventoryValue": 1125,
        "investmentRecovery": {
            "recovered": 0,
            "remaining": null,
            "progress": null,
            "note": "Initial investment is not configured in the current data model, so recovery is based on period net profit only."
        }
    },
    "revenuePerformance": {
        "currentRevenue": 0,
        "previousRevenue": 0,
        "revenueGrowth": 0,
        "orders": 0,
        "previousOrders": 0,
        "orderGrowth": 0,
        "averageTransactionValue": 0,
        "dailyAverage": 0,
        "monthlyAverage": 0,
        "salesTarget": 50000,
        "targetAchievement": 0,
        "revenueForecast": 0
    },
    "profitability": {
        "revenue": 0,
        "cogs": 0,
        "grossProfit": 0,
        "operatingExpenses": 5070,
        "netProfit": -5070,
        "grossMargin": 0,
        "netMargin": 0,
        "trend": [
            {
                "month": "2026-10",
                "grossMargin": 0,
                "netMargin": 0
            }
        ]
    },
    "cashFlow": {
        "openingCash": null,
        "cashReceived": 0,
        "cashPaid": 5070,
        "netCashMovement": -5070,
        "closingCash": 0,
        "cashRunwayMonths": 0,
        "accountsReceivable": 28776.24,
        "accountsPayable": 228,
        "upcomingPayments": 0
    },
    "expenses": {
        "total": 5070,
        "items": [
            {
                "name": "Demo Staff Salary - Oct 2026",
                "amount": 2800,
                "percentOfRevenue": 0
            },
            {
                "name": "Demo Office Rent - Oct 2026",
                "amount": 1200,
                "percentOfRevenue": 0
            },
            {
                "name": "Demo Marketing Ads - Oct 2026",
                "amount": 650,
                "percentOfRevenue": 0
            },
            {
                "name": "Demo Utilities - Oct 2026",
                "amount": 420,
                "percentOfRevenue": 0
            }
        ]
    },
    "inventory": {
        "inventoryValue": 1125
    },
    "receivables": {
        "total": 28776.24,
        "count": 19
    },
    "payables": {
        "total": 228,
        "upcoming": 0,
        "count": 111
    },
    "insights": [
        {
            "title": "Profitability",
            "message": "The business is reporting a net loss for this period.",
            "consideration": "Compare gross margin and operating expenses to identify where profit is leaking."
        },
        {
            "title": "Cash Collection",
            "message": "Accounts receivable is higher than accounts payable.",
            "consideration": "Follow up unpaid invoices to improve cash availability."
        },
        {
            "title": "Inventory Impact",
            "message": "Inventory value is higher than current-period revenue.",
            "consideration": "Review slow-moving stock and purchasing plans because cash may be tied up in inventory."
        },
        {
            "title": "Cash Runway",
            "message": "Estimated cash runway is 0 months based on recent cash outflow.",
            "consideration": "Treat this as an estimate and review upcoming expenses, payables, and expected collections."
        }
    ]
}

Get Financial Summary

http://localhost:3080/api/report/financial/summaries?startDate=2026-10-01&endDate=2026-10-31&locationId=1&targetType=MONTHLY

Response:
{
    "data": {
        "incomes": [],
        "cogs": [
            {
                "name": "Cost of Goods Sold",
                "amount": 0
            }
        ],
        "expenses": [
            {
                "name": "Demo Staff Salary - Oct 2026",
                "amount": 2800,
                "percentOfRevenue": 0
            },
            {
                "name": "Demo Office Rent - Oct 2026",
                "amount": 1200,
                "percentOfRevenue": 0
            },
            {
                "name": "Demo Marketing Ads - Oct 2026",
                "amount": 650,
                "percentOfRevenue": 0
            },
            {
                "name": "Demo Utilities - Oct 2026",
                "amount": 420,
                "percentOfRevenue": 0
            }
        ],
        "totalIncome": 0,
        "totalRevenue": 0,
        "totalExpense": 5070,
        "grossProfit": 0,
        "netIncome": -5070,
        "grossMargin": 0,
        "netMargin": 0
    }
}

---

# 2. Core Business Questions

The Financial Report should answer several important questions.

### Business Performance

**Are we selling enough?**

- Total sales
- Sales growth
- Average daily/monthly sales
- Sales target vs actual
- Number of transactions
- Average transaction value

### Profitability

**Are we actually making money?**

- Revenue
- Cost of Goods Sold
- Gross Profit
- Operating Expenses
- Net Profit
- Gross Profit Margin
- Net Profit Margin

### Investment Recovery

**Have we recovered what we invested into the business?**

Track:

- Initial business investment
- Additional capital injected
- Owner withdrawals
- Cumulative net profit
- Investment recovered
- Remaining investment to recover

Important distinction:

> Revenue should not be compared directly with investment.

A business can generate $100,000 in revenue while still not recovering a $50,000 investment if its costs and expenses are high.

Therefore MarketChain should show **investment recovery based on accumulated profit/cash position**, depending on the accounting model being used.

---

# 3. Financial Health Dashboard

The first page should provide a simple financial health overview.

## Key Financial Cards

### Revenue

**$125,500**

Compared with previous period:

**+12.5%**

---

### Gross Profit

**$42,300**

Gross Margin:

**33.7%**

---

### Operating Expenses

**$27,800**

---

### Net Profit

**$14,500**

Net Margin:

**11.6%**

---

### Cash Available

**$21,400**

---

### Accounts Receivable

**$8,200**

---

### Accounts Payable

**$12,600**

---

### Inventory Value

**$35,000**

---

### Investment Recovery

**68%**

Initial investment:

**$50,000**

Recovered:

**$34,000**

Remaining:

**$16,000**

---

# 4. Business Health Overview

Instead of showing only numbers, MarketChain should summarize the current condition.

For example:

### Financial Position

**Revenue is growing, but operating expenses are also increasing.**

Sales increased by 12.5% compared with the previous period, while operating expenses increased by 18%.

This means the business is generating more sales, but the additional revenue is not translating proportionally into profit.

### What this means

The owner may need to review:

- Operating expenses
- Product margins
- Supplier pricing
- Selling prices
- Low-margin products

This should be presented as an **explanation**, not as an automatic command.

---

# 5. Revenue Performance

The report should help answer:

> “Is my business generating the amount of sales I expected?”

## Revenue Metrics

Track:

- Current period revenue
- Previous period revenue
- Revenue growth
- Monthly average
- Daily average
- Sales target
- Target achievement
- Revenue forecast

Example:

| Metric | Current | Previous | Change |
|---|---:|---:|---:|
| Revenue | $125,500 | $111,500 | +12.6% |
| Orders | 2,450 | 2,210 | +10.9% |
| Avg. Order Value | $51.22 | $50.45 | +1.5% |

### Sales Target

Target:

**$150,000**

Actual:

**$125,500**

Achievement:

**83.7%**

The system can explain:

> “Current revenue is 83.7% of the monthly target.”

---

# 6. Profitability Analysis

Revenue alone does not tell whether the business is healthy.

MarketChain should show the progression:

**Revenue**

↓

**Cost of Goods Sold**

↓

**Gross Profit**

↓

**Operating Expenses**

↓

**Net Profit**

Example:

```text
Revenue                         $125,500
        ↓
Cost of Goods Sold              $83,200
        ↓
Gross Profit                    $42,300
        ↓
Operating Expenses              $27,800
        ↓
Net Profit                      $14,500
```

This gives the owner a simple understanding of where the money goes.

---

# 7. Profit Margin Monitoring

MarketChain should monitor margins over time.

### Gross Margin

```text
Gross Profit / Revenue × 100
```

Example:

```text
42,300 / 125,500 × 100
= 33.7%
```

### Net Profit Margin

```text
Net Profit / Revenue × 100
```

Example:

```text
14,500 / 125,500 × 100
= 11.6%
```

The report should show trends rather than only the current number.

Example:

```text
Jan    9.2%
Feb   10.1%
Mar   11.4%
Apr   10.8%
May   11.6%
```

This helps identify whether profitability is improving or deteriorating.

---

# 8. Cash Flow & Survival

One of the most important sections for SMEs is:

> **“Can my business survive?”**

A profitable business can still run out of cash.

Therefore MarketChain should separate:

### Profitability

from

### Cash Position

Track:

- Opening cash
- Cash received
- Cash paid
- Net cash movement
- Closing cash
- Accounts receivable
- Accounts payable
- Upcoming payments

Example:

```text
Opening Cash                    $18,000

Cash In                         +$35,000
Cash Out                        -$28,000

Net Cash Flow                    +$7,000

Closing Cash                    $25,000
```

---

# 9. Business Survival Indicator

MarketChain can calculate an estimated **Cash Runway**.

For example:

```text
Available Cash / Average Monthly Net Cash Outflow
```

If the business has:

```text
Available Cash       = $20,000
Average Monthly Burn = $5,000
```

Estimated runway:

```text
20,000 / 5,000 = 4 months
```

The report could display:

### Estimated Cash Runway

**4.0 months**

And explain:

> “Based on recent cash movement, current available cash could cover approximately 4 months of net cash requirements.”

This should be presented as an estimate, because future sales and expenses can change.

---

# 10. Investment Recovery

This is an important feature for business owners.

MarketChain should allow the owner to define:

### Initial Investment

Example:

```text
Business Investment       $50,000
```

Then track:

```text
Additional Investment     $10,000
Owner Withdrawal          $5,000
Cumulative Profit         $34,000
```

The system can show:

### Capital Recovery

```text
Initial Investment        $50,000
Recovered                 $34,000
Remaining                 $16,000

Recovery Progress         68%
```

And:

> “The business has accumulated profit equivalent to approximately 68% of the initial investment.”

This is more meaningful than saying:

> “Revenue has exceeded investment.”

---

# 11. Expense Analysis

The owner needs to know:

> “Where is my money going?”

Break expenses into categories:

- Rent
- Salaries
- Utilities
- Marketing
- Transportation
- Software
- Maintenance
- Banking/payment fees
- Other operating expenses

Example:

| Expense | Amount | % of Revenue |
|---|---:|---:|
| Salary | $10,000 | 8.0% |
| Rent | $5,000 | 4.0% |
| Marketing | $3,500 | 2.8% |
| Utilities | $2,100 | 1.7% |
| Other | $7,200 | 5.7% |

Then show trends.

For example:

> “Operating expenses increased 18% compared with the previous period.”

---

# 12. Inventory & Financial Impact

Inventory should be connected directly to financial reporting.

The system should answer:

> “How much money is currently tied up in inventory?”

Show:

- Inventory value
- Inventory turnover
- Stock age
- Slow-moving inventory
- Dead stock
- Inventory investment
- COGS
- Estimated days of inventory

Example:

```text
Inventory Value          $35,000
Slow-moving Stock        $8,500
Dead Stock               $3,200
```

This tells the owner that part of their cash is currently locked in inventory.

---

# 13. Receivables & Payables

### Accounts Receivable

Show:

- Total receivables
- Current
- Overdue
- Aging

Example:

```text
Total Receivable         $15,000

0–30 days                 $8,000
31–60 days                $4,000
61–90 days                $2,000
90+ days                  $1,000
```

### Accounts Payable

Show:

```text
Total Payable            $18,000

Due this week             $4,000
Due this month            $8,000
Later                      $6,000
```

This becomes especially important for the survival calculation.

---

# 14. Break-Even Analysis

Another important question:

> **“How much do I need to sell just to survive?”**

MarketChain can calculate:

### Monthly Fixed Costs

Example:

```text
Rent                     $3,000
Salary                   $8,000
Utilities                $1,000
Other                    $2,000

Total Fixed Cost        $14,000
```

If average gross margin is 35%:

```text
Break-even Revenue

14,000 / 35%
= $40,000
```

Therefore:

> “The business needs approximately $40,000 in monthly revenue to cover current fixed costs at the current gross margin.”

This is a very useful number for an SME owner.

---

# 15. Sales Target & Break-Even Together

MarketChain can show:

```text
Monthly Revenue Target       $60,000
Break-even Revenue           $40,000
Current Revenue              $48,000
```

This gives three different perspectives:

**$40K** → survival/break-even

**$48K** → current performance

**$60K** → business target

That is much more useful than a single “profit” number.

---

# 16. Business Trend

The report should show historical trends.

### Monthly

```text
             Revenue   Profit   Expenses
Jan           $40K      $5K      $35K
Feb           $43K      $6K      $37K
Mar           $46K      $7K      $39K
Apr           $48K      $8K      $40K
May           $52K      $9K      $43K
```

Charts should allow:

- 7 days
- 30 days
- 3 months
- 6 months
- 12 months
- Custom period

---

# 17. Financial Alerts

MarketChain should identify important changes automatically.

Examples:

### Revenue Alert

> Revenue is 15% below the current target.

### Expense Alert

> Operating expenses increased 22% compared with the previous month.

### Margin Alert

> Gross margin decreased from 36% to 31%.

### Cash Alert

> Expected payments in the next 30 days are higher than projected cash inflows.

### Inventory Alert

> $8,500 of inventory has been classified as slow-moving.

### Receivable Alert

> $4,200 of customer receivables are overdue by more than 30 days.

These are **decision signals**, not automatic decisions.

---

# 18. “What Should I Look At Next?”

This should become one of the most valuable MarketChain features.

Instead of simply displaying:

> Net Profit = $14,500

MarketChain could provide a section called:

## Business Attention

For example:

### 1. Monitor Operating Expenses

Operating expenses increased 18% while revenue increased 12%.

**Review:** expense categories and recent changes.

### 2. Review Slow-Moving Inventory

$8,500 is currently tied up in slow-moving inventory.

**Review:** stock age and product sales velocity.

### 3. Monitor Receivables

$4,200 is overdue.

**Review:** customers with outstanding balances.

### 4. Review Product Margins

Several high-volume products have margins below the business average.

**Review:** product profitability.

The system should show **why the item appeared** and link directly to the relevant ERP screen.

---

# 19. Financial Health Score — Optional Future Feature

A future version could calculate a financial health indicator from several measurable dimensions:

```text
Revenue Performance
        +
Profitability
        +
Cash Position
        +
Expense Control
        +
Inventory Efficiency
        +
Receivables
        +
Debt/Payables
```

However, the system should avoid presenting an unexplained score.

Instead, if a score is introduced, the owner should be able to see exactly how it was calculated.

For example:

```text
Financial Health
────────────────────────

Revenue Performance      Healthy
Profitability            Stable
Cash Position            Watch
Inventory                Attention
Receivables              Watch
Expenses                 Attention
```

The underlying metrics should always be visible.

---

# 20. Recommended Report Structure

The overall MarketChain Financial Report could be structured as:

```text
FINANCIAL OVERVIEW
│
├── 1. Executive Summary
│
├── 2. Revenue Performance
│
├── 3. Profitability
│
├── 4. Cash Flow
│
├── 5. Investment Recovery
│
├── 6. Expenses
│
├── 7. Inventory Financial Impact
│
├── 8. Accounts Receivable
│
├── 9. Accounts Payable
│
├── 10. Break-Even Analysis
│
├── 11. Business Trends
│
└── 12. Business Attention / Insights
```

---

# 21. The Most Important Concept

MarketChain should evolve from:

> **ERP = Record what happened**

into:

> **ERP = Understand what happened + understand what is happening + help the owner decide what to investigate next.**

For example:

### Traditional ERP

```text
Revenue:       $125,500
Expense:        $27,800
Profit:         $14,500
```

### MarketChain

```text
Revenue
$125,500
↑ 12.6%

Profit
$14,500
Margin 11.6%

Cash
$21,400

Investment Recovery
68%

Break-even
$40,000/month

Cash Runway
~4 months

Attention
────────────────────────
⚠ Expenses growing faster
  than revenue

⚠ $8,500 inventory is
  slow-moving

⚠ $4,200 receivables
  are overdue

✓ Revenue is above
  break-even level
```

This is much closer to what a business owner actually needs.

---

# 22. Long-Term Vision

The long-term vision for MarketChain Financial Reporting should be:

> **“Turn business data into business understanding.”**

The ERP collects the raw operational data.

The Financial Report converts that data into financial information.

The Insight Layer explains what changed.

The Decision Support Layer helps the owner investigate possible actions.

The flow becomes:

```text
Business Transactions
        ↓
MarketChain ERP
        ↓
Financial Calculations
        ↓
Financial Reports
        ↓
Business Insights
        ↓
Areas Requiring Attention
        ↓
Owner Makes Decision
```

The owner remains the decision maker.

MarketChain's job is to make the owner's decision **more informed, faster, and based on the actual business data**.