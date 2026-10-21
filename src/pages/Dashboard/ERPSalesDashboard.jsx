import React from "react";
import {
  Alert,
  Button,
  Drawer,
  Select,
  Spin,
  Tooltip,
} from "antd";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Bell,
  Boxes,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  PackageSearch,
  RefreshCw,
  Sparkles,
  Target,
  TrendingUp,
  Wallet,
} from "lucide-react";
import moment from "moment";
import { Link, withRouter } from "react-router-dom";
import Util from "@common/util/index";
import { SelectLocation } from "@components/stateful";
import SaleService from "../../app/modules/pos/services/report/SaleService";
import PurchaseService from "../../app/modules/pos/services/report/PurchaseService";
import LocationService from "@services/LocationService";
import SaleOrderService from "@services/SaleOrderService";
import InventoryService from "@services/report.inventory";
import useDashboardQuery from "./useDashboardQuery";
import { dashboardFilterSearch, readDashboardFilters } from "./dashboardFilters";
import {
  businessDate,
  changePercent,
  chartRows,
  coverageMetrics,
  numberOrNull,
  periodOptions,
  productMetrics,
  resolvePeriod,
  rowsOf,
} from "./dashboardModel";
import "./dashboard.css";

const util = new Util();
const DEFAULT_BUSINESS_TIME_ZONE = "Asia/Phnom_Penh";
const RECENT_ORDER_LIMIT = 8;
const BUSINESS_HEALTH_STATUSES = {
  HEALTHY: { label: "Healthy", tone: "healthy", icon: CheckCircle2, alertType: "success" },
  NEEDS_ATTENTION: { label: "Needs attention", tone: "warning", icon: AlertTriangle, alertType: "warning" },
  CRITICAL: { label: "Critical", tone: "critical", icon: AlertTriangle, alertType: "error" },
  INSUFFICIENT_DATA: { label: "Insufficient data", tone: "neutral", icon: Activity, alertType: "info" },
  NOT_CONFIGURED: { label: "Not configured", tone: "neutral", icon: Activity, alertType: "info" },
};
const businessHealthReasonType = (severity) => ({ ERROR: "error", CRITICAL: "error", WARNING: "warning", SUCCESS: "success" }[severity] || "info");
const reports = {
  sales: "/reports/sales-report",
  financial: "/reports/financial",
  inventory: "/reports/stock",
  purchases: "/reports/purchases",
  catalog: "/inventories/items",
};
const safe = (value) => numberOrNull(value);
const currency = (value) => (value == null ? "—" : util.formatCurrency(value, (util.getSetting() || {}).currency || "", (util.getSetting() || {}).currencyPosition || 0));
const asRows = (response) => rowsOf(response && response.data && response.data.data);
const displayDate = (value) => (value ? moment.utc(value).format("MMM D, YYYY") : "—");
const displayTimestamp = (value, timeZone) => {
  if (!value || !timeZone) return "Date unavailable";
  try {
    return new Intl.DateTimeFormat(undefined, {
      timeZone,
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(value));
  } catch (_) {
    return "Date unavailable";
  }
};
const pctText = (value) => (value == null ? "Unavailable" : `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`);
function WidgetState({ query, children }) {
  if (query.loading)
    return (
      <div className="dash-loading" aria-label="Loading">
        <Spin size="small" />
        <span>Loading this section…</span>
      </div>
    );
  if (query.error)
    return (
      <Alert
        type="error"
        showIcon
        message={query.error}
        action={
          <Button size="small" onClick={query.retry}>
            Retry
          </Button>
        }
      />
    );
  return children(query.data);
}
function SectionTitle({ icon: Icon, title, subtitle, action }) {
  return (
    <div className="dash-section-title">
      <span className="dash-title-icon">
        <Icon size={17} />
      </span>
      <div>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {action && <div className="dash-title-action">{action}</div>}
    </div>
  );
}
function Metric({ title, value, note, icon: Icon, tone = "teal", extra, onClick }) {
  return (
    <article className="dash-card dash-kpi">
      <div className="dash-kpi-top">
        <span>{title}</span>
        <span className={`dash-kpi-icon ${tone}`}>
          <Icon size={18} />
        </span>
      </div>
      <div className={`dash-kpi-value ${tone}`}>{value}</div>
      <div className="dash-kpi-bottom">
        <span>{note}</span>
        {extra}
      </div>
      {onClick}
    </article>
  );
}
function MiniTrend({ values, tone = "teal" }) {
  const points = (values || []).map(numberOrNull).filter((value) => value !== null);
  if (points.length < 2) return <span className="dash-spark-empty" aria-label="Trend unavailable" />;
  const min = Math.min(...points), max = Math.max(...points), range = max - min || 1;
  const path = points.map((value, index) => `${(index / (points.length - 1)) * 68},${25 - ((value - min) / range) * 20}`).join(" ");
  return (
    <svg className={`dash-spark ${tone}`} viewBox="0 0 68 28" role="img" aria-label="Trend for selected period">
      <polyline points={path} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function Comparison({ current, previous, label }) {
  const change = changePercent(current, previous);
  if (change === null) return <span className="dash-muted">Comparison unavailable</span>;
  const positive = change >= 0;
  const Icon = positive ? ArrowUpRight : ArrowDownRight;
  return (
    <span className={`dash-change ${positive ? "positive" : "negative"}`}>
      <Icon size={14} />
      {pctText(change)}{" "}
      <small>
        {label} ({currency(previous)})
      </small>
    </span>
  );
}
function DashboardChartTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="dash-chart-tooltip">
      <b>{displayDate(label)}</b>
      {payload.map((item) => (
        <div key={item.dataKey}>
          <span style={{ color: item.color }}>●</span> {item.name}
          <strong>{currency(item.value)}</strong>
        </div>
      ))}
    </div>
  );
}
function TargetPanel({ locationId, goalQuery }) {
  const goal = goalQuery.data || {};
  const target = goal.target || {};
  const pacing = goal.pacing;
  const targetAmount = safe(target.targetRevenue);
  const actual = safe(target.actualRevenue);
  const achievement = safe(target.achievementPercent);
  const remaining = safe(target.remainingRevenue);
  const pacingVariance = safe(pacing && pacing.varianceAmount);
  const pacingStatus = pacing && pacing.status === "ON_TRACK" ? "On track" : pacing && pacing.status === "BELOW_PACE" ? "Below pace" : null;
  let pacingDetail = "Pacing detail unavailable.";
  if (pacingVariance === 0) pacingDetail = "Sales are exactly on the expected pace.";
  if (pacingVariance !== null && pacingVariance !== 0) {
    const direction = pacingVariance > 0 ? "ahead of" : "behind";
    pacingDetail = `${currency(Math.abs(pacingVariance))} ${direction} expected pace.`;
  }
  return (
    <section className="dash-card dash-panel dash-target-panel">
      <SectionTitle
        icon={Target}
        title="Sales Goal"
        subtitle="Are you on track to reach your target?"
        action={locationId && !goalQuery.loading && !goalQuery.error && targetAmount !== null && targetAmount > 0 ? (
          <Tooltip title={pacingDetail}>
            <span className={`dash-pacing ${pacing && pacing.status === "ON_TRACK" ? "on-track" : pacing && pacing.status === "BELOW_PACE" ? "below-pace" : "unavailable"}`} tabIndex={0}>
              <strong>{pacingStatus || "Pacing unavailable"}</strong>
            </span>
          </Tooltip>
        ) : null}
      />
      {!locationId ? (
        <div className="dash-empty">Sales targets are set per branch. Select a branch above to view or manage its target.</div>
      ) : goalQuery.loading ? (
        <WidgetState query={goalQuery}>{() => null}</WidgetState>
      ) : goalQuery.error ? (
        <WidgetState query={goalQuery}>{() => null}</WidgetState>
      ) : targetAmount === null || targetAmount <= 0 ? (
        <div className="dash-empty">
          <Target size={20} />
          <span>No monthly target is set for this branch.</span>
        </div>
      ) : (
        <>
          <div className="dash-target-progress-header">
            <div className="dash-target-number">
              {achievement === null ? "—" : `${achievement.toFixed(1)}%`} <span>achieved</span>
            </div>
            <span className="dash-target-period">Period · Month to date</span>
          </div>
          <div className="dash-progress">
            <span style={{ width: `${Math.min(100, Math.max(0, achievement || 0))}%` }} />
          </div>
          <div className="dash-target-details">
            <span>
              Monthly Target:<strong>{currency(targetAmount)}</strong>
            </span>
            <span>
              Sales So Far:<strong>{currency(actual)}</strong>
            </span>
            <span className="dash-target-remaining">
              Still Needed:<strong>{currency(remaining)}</strong>
            </span>
          </div>
          <a className="dash-link dash-target-manage" href="#">
            Manage Sales Target →
          </a>
        </>
      )}
    </section>
  );
}

function ERPSalesDashboard({ history, location }) {
  const [autoRefreshInterval, setAutoRefreshInterval] = React.useState("manual");
  const profileLocationId = util.getLocationId();
  const [refreshKey, setRefreshKey] = React.useState(0);
  const [healthVisible, setHealthVisible] = React.useState(false);
  const [contextRetry, setContextRetry] = React.useState(0);
  const [context, setContext] = React.useState({
    loading: true,
    timeZone: null,
    locations: [],
    error: false,
  });
  const [businessToday, setBusinessToday] = React.useState(null);
  const [lastUpdated, setLastUpdated] = React.useState(null);
  const refreshBusyRef = React.useRef(false);
  const authorizedLocations = React.useRef(new Map());
  const { periodKey, locationId } = readDashboardFilters(
    location.search,
    profileLocationId,
    [...context.locations, ...authorizedLocations.current.values()],
  );
  const updateFilters = (changes) => {
    history.push({
      pathname: location.pathname,
      search: dashboardFilterSearch(location.search, { periodKey, locationId, ...changes }),
      hash: location.hash,
      state: location.state,
    });
  };

  React.useEffect(() => {
    context.locations.forEach((row) => authorizedLocations.current.set(String(row.id), row));
  }, [context.locations]);

  const locationAdapter = React.useMemo(
    () => ({
      get: (options) =>
        LocationService.get(options).then((response) => {
          asRows(response).forEach((row) => authorizedLocations.current.set(String(row.id), row));
          return response;
        }),
      getById: (id) => {
        const found = authorizedLocations.current.get(String(id));
        return found ? Promise.resolve({ data: { data: found } }) : Promise.reject(new Error("Location not authorized"));
      },
    }),
    [],
  );
  React.useEffect(() => {
    let active = true;
    setContext((value) => ({ ...value, loading: true, error: false }));
    LocationService.get({ limit: 100, offset: 0 })
      .then((locationsResponse) => {
        const rows = asRows(locationsResponse);
        if (active) {
          setContext({
            loading: false,
            timeZone: DEFAULT_BUSINESS_TIME_ZONE,
            locations: rows,
            error: false,
          });
          setBusinessToday(businessDate(new Date(), DEFAULT_BUSINESS_TIME_ZONE));
        }
      })
      .catch(() => {
        if (active) setContext((value) => ({ ...value, loading: false, error: true }));
      });
    return () => {
      active = false;
    };
  }, [contextRetry, profileLocationId]);
  const dateRange = React.useMemo(() => context.timeZone && resolvePeriod(periodKey, new Date(), context.timeZone), [periodKey, context.timeZone, refreshKey]);
  const base = React.useMemo(
    () =>
      dateRange
        ? {
            fromDate: dateRange.fromDate,
            toDate: dateRange.toDate,
            ...(locationId ? { locationId } : {}),
          }
        : null,
    [dateRange && dateRange.fromDate, dateRange && dateRange.toDate, locationId],
  );
  const prior = React.useMemo(
    () =>
      dateRange
        ? {
            fromDate: dateRange.previousFrom,
            toDate: dateRange.previousTo,
            ...(locationId ? { locationId } : {}),
          }
        : null,
    [dateRange && dateRange.previousFrom, dateRange && dateRange.previousTo, locationId],
  );
  const locationScopeReady = locationId !== undefined;
  const enabled = Boolean(base) && !context.loading && Boolean(businessToday) && locationScopeReady;
  const summary = useDashboardQuery(() => SaleService.getSalesSummary(base), [base && base.fromDate, base && base.toDate, locationId, refreshKey], enabled);
  const previous = useDashboardQuery(() => SaleService.getSalesSummary(prior), [prior && prior.fromDate, prior && prior.toDate, locationId, refreshKey], enabled);
  const trend = useDashboardQuery(() => SaleService.getSalesTrend({ ...base, groupBy: dateRange.groupBy }), [base && base.fromDate, base && base.toDate, dateRange && dateRange.groupBy, locationId, refreshKey], enabled);
  const products = useDashboardQuery(
    () =>
      SaleService.getSalesProducts({
        ...base,
        limit: 10,
        offset: 0,
        sortBy: "salesRevenue",
        sortDirection: "DESC",
      }),
    [base && base.fromDate, base && base.toDate, locationId, refreshKey],
    enabled,
  );
  const performance = useDashboardQuery(() => SaleService.getSalesPerformance({ ...base, targetType: "MONTHLY" }), [base && base.fromDate, base && base.toDate, locationId, refreshKey], enabled);
  const businessHealth = useDashboardQuery(() => SaleService.getBusinessHealth(base), [base && base.fromDate, base && base.toDate, locationId, refreshKey], enabled);
  const mtdRange = dateRange
    ? {
        fromDate: dateRange.monthStart,
        toDate: dateRange.today,
        ...(locationId ? { locationId } : {}),
      }
    : null;
  const goalPerformance = useDashboardQuery(() => SaleService.getSalesPerformance({ ...mtdRange, targetType: "MONTHLY" }), [mtdRange && mtdRange.fromDate, mtdRange && mtdRange.toDate, locationId, refreshKey], enabled && Boolean(locationId));
  const orders = useDashboardQuery(
    () =>
      SaleOrderService.get({
        limit: RECENT_ORDER_LIMIT,
        offset: 0,
        sortField: "registerDate",
        sortOrder: "DESC",
        ...(base || {}),
        start: base.fromDate,
        end: base.toDate,
      }),
    [base && base.fromDate, base && base.toDate, locationId, refreshKey],
    enabled,
  );
  const stock = useDashboardQuery(() => InventoryService.getInventoryDashboard(0), [refreshKey], !locationId && enabled);
  const priceChanges = useDashboardQuery(() => PurchaseService.getPurchasePriceIncrease({ ...base, minChangePercent: 5 }), [base && base.fromDate, base && base.toDate, locationId, refreshKey], enabled);
  const refreshBusy = [summary, previous, trend, products, performance, businessHealth, goalPerformance, orders].some((query) => query.loading);
  refreshBusyRef.current = refreshBusy;
  React.useEffect(() => {
    if (autoRefreshInterval === "manual" || !enabled) return undefined;
    const timer = window.setInterval(() => {
      if (!refreshBusyRef.current) setRefreshKey((value) => value + 1);
    }, Number(autoRefreshInterval) * 1000);
    return () => window.clearInterval(timer);
  }, [autoRefreshInterval, enabled]);
  React.useEffect(() => {
    const dates = [summary.updatedAt, trend.updatedAt, products.updatedAt, businessHealth.updatedAt, goalPerformance.updatedAt].filter(Boolean).map((value) => value.getTime());
    if (dates.length) setLastUpdated(new Date(Math.max(...dates)));
  }, [summary.updatedAt, trend.updatedAt, products.updatedAt, businessHealth.updatedAt, goalPerformance.updatedAt]);

  if (context.loading)
    return (
      <main className="business-dashboard">
        <div className="dash-loading">
          <Spin /> Loading business settings…
        </div>
      </main>
    );
  if (context.error)
    return (
      <main className="business-dashboard">
        <Alert type="error" showIcon message="Business locations could not be loaded." action={<Button onClick={() => setContextRetry((value) => value + 1)}>Retry</Button>} />
      </main>
    );
  const current = summary.data || {};
  const priorSummary = previous.data || {};
  const series = chartRows(trend.data, businessToday || (dateRange && dateRange.today) || "9999-12-31");
  const sales = safe(current.salesRevenue), grossSales = sales === null ? null : sales + (safe(current.discount) || 0);
  const grossProfit = safe(current.grossProfit);
  const orderCount = safe(current.transactionCount);
  const units = safe(current.itemsSold);
  const priorSales = safe(priorSummary.salesRevenue), priorGross = priorSales === null ? null : priorSales + (safe(priorSummary.discount) || 0);
  const priorProfit = safe(priorSummary.grossProfit);
  const expenses = safe(performance.data && performance.data.operatingExpense && performance.data.operatingExpense.amount);
  const coverage = coverageMetrics(grossProfit, expenses);
  const assessment = businessHealth.data || {};
  const healthStatus = BUSINESS_HEALTH_STATUSES[assessment.status] || { label: "Assessment unavailable", tone: "neutral", icon: Activity, alertType: "info" };
  const HealthIcon = healthStatus.icon;
  const healthMetrics = assessment.metrics || {};
  const healthCoverage = safe(healthMetrics.expenseCoveragePercent);
  const healthReasons = rowsOf(assessment.reasons).filter((reason) => reason && reason.message);
  const productData = productMetrics(products.data, sales);
  const productRecords = productData.rows;
  const activeRange = periodOptions.find((item) => item[0] === periodKey);
  const comparisonLabel = periodKey === "today" ? "vs previous day" : "vs previous equal-length period";
  const orderRows = rowsOf(orders.data);
  const stockCounts = rowsOf(stock.data && stock.data.stocks);
  const reorder = stockCounts.find((row) => row.type === "reorder");
  const zero = stockCounts.find((row) => row.type === "stockZero");
  const inventoryAlerts = [safe(reorder && reorder.value), safe(zero && zero.value)].filter((value) => value !== null).reduce((sum, value) => sum + value, 0);
  const priceRows = rowsOf(priceChanges.data && (priceChanges.data.data || priceChanges.data));
  const insights = [];
  if (inventoryAlerts > 0)
    insights.push({
      key: "stock",
      title: `${inventoryAlerts} inventory items need review`,
      body: "Items are at or below inventory alert thresholds across the authorized stock summary.",
      href: reports.inventory,
      label: "Review inventory",
      tone: "red",
      icon: Boxes,
    });
  if (coverage.shortfall > 0)
    insights.push({
      key: "expenses",
      title: "Gross profit is below recorded operating expenses",
      body: `Gross profit is ${currency(coverage.shortfall)} below recorded expenses for this period.`,
      href: reports.financial,
      label: "View financial report",
      tone: "red",
      icon: Wallet,
    });
  const purchaseAlert = priceRows.find((row) => safe(row.changePercent) > 0);
  if (purchaseAlert)
    insights.push({
      key: "purchase",
      title: `${purchaseAlert.itemName || purchaseAlert.productName || "A product"} purchase cost increased`,
      body: `Verified purchase price variance: ${safe(purchaseAlert.changePercent).toFixed(1)}%. Review its cost history.`,
      href: reports.purchases,
      label: "Review purchase prices",
      tone: "amber",
      icon: TrendingUp,
    });
  const goalTarget = goalPerformance.data && goalPerformance.data.target;
  const goalRevenue = safe(goalTarget && goalTarget.targetRevenue);
  const goalPercent = safe(goalTarget && goalTarget.achievementPercent);
  let goalDisplay = "Unavailable";
  if (!locationId) goalDisplay = "Select a branch";
  else if (goalPerformance.loading) goalDisplay = "Loading…";
  else if (!goalPerformance.error && (goalRevenue === null || goalRevenue <= 0)) goalDisplay = "No target set";
  else if (!goalPerformance.error && goalPercent !== null) goalDisplay = `${goalPercent.toFixed(1)}%`;
  const updateText = refreshBusy ? "Updating" : lastUpdated ? `Updated ${moment(lastUpdated).format("h:mm A")}` : "Waiting for data";
  const selectedLocation = locationId ? context.locations.find((row) => String(row.id) === String(locationId)) : null;
  const chartTitle = activeRange ? activeRange[1] : "Selected period";
  const revenueTrend = series.map((row) => row.salesRevenue);
  const profitTrend = series.map((row) => row.grossProfit);
  const orderTrend = series.map((row) => row.transactionCount);
  return (
    <main className="business-dashboard">
      <header className="dash-header">
        <div>
          <div className="dash-heading-line">
            <h1>Business Dashboard</h1>
            <span className={`dash-freshness ${refreshBusy ? "updating" : ""}`}>
              <Activity size={13} />
              {updateText}
            </span>
          </div>
          <p>Your business performance, profitability, and operational health at a glance.</p>
        </div>
        <div className="dash-filters">
          <SelectLocation
            service={locationAdapter}
            value={locationId}
            onChange={(nextLocation) => {
              if (nextLocation && !authorizedLocations.current.has(String(nextLocation))) return;
              updateFilters({ locationId: nextLocation ? String(nextLocation) : "" });
            }}
            allowClear
            allValue=""
            allLabel={`All Branches (${context.locations.length} Locations)`}
            showAll
            defaultValue=""
            placeholder="Select branch"
            width={210}
            selectedItem={selectedLocation}
          />
          <Select value={periodKey} onChange={(nextPeriod) => updateFilters({ periodKey: nextPeriod })} className="dash-select" aria-label="Reporting period">
            {periodOptions.map(([value, label]) => (
              <Select.Option key={value} value={value}>
                {label}
              </Select.Option>
            ))}
          </Select>
          <span className="dash-compare">Compare: {comparisonLabel}</span>
          <Button type="primary" icon={<RefreshCw size={15} className={refreshBusy ? "dash-spin" : ""} />} loading={refreshBusy} onClick={() => setRefreshKey((value) => value + 1)}>
            Refresh
          </Button>
          <Select value={autoRefreshInterval} onChange={setAutoRefreshInterval} className="dash-select dash-refresh-interval" aria-label="Automatic refresh interval">
            <Select.Option value="manual">Manual</Select.Option>
            <Select.Option value="5">5s</Select.Option>
            <Select.Option value="10">10s</Select.Option>
            <Select.Option value="15">15s</Select.Option>
          </Select>
        </div>
      </header>

      <section className={`dash-health dash-card dash-health-${healthStatus.tone}`}>
        <WidgetState query={businessHealth}>
          {() => (
            <>
              <div className="dash-health-icon">
                <HealthIcon size={20} />
              </div>
              <div className="dash-health-copy">
                <div className="dash-heading-line">
                  <h2>How Is Your Business Doing?</h2>
                  <span className="dash-status">{healthStatus.label}</span>
                </div>
                <p>{assessment.summary || "Business health assessment is unavailable."}</p>
              </div>
              <div className="dash-health-metrics">
                <div>
                  <small>Gross Profit</small>
                  <strong>{currency(safe(healthMetrics.grossProfit))}</strong>
                </div>
                <div>
                  <small>Operating Expenses</small>
                  <strong>{currency(safe(healthMetrics.operatingExpenses))}</strong>
                </div>
                <div>
                  <small>Expense Coverage</small>
                  <strong>{healthCoverage === null ? "Unavailable" : `${healthCoverage.toFixed(1)}%`}</strong>
                </div>
              </div>
              <Button type="link" className="dash-health-action" onClick={() => setHealthVisible(true)}>
                View Business Health <ArrowRight size={14} />
              </Button>
            </>
          )}
        </WidgetState>
      </section>

      <div className="dash-kpis">
        <Metric
          title="Gross Sales"
          value={summary.loading ? "Loading…" : currency(grossSales)}
          note={<Comparison current={grossSales} previous={priorGross} label={comparisonLabel} />}
          icon={CircleDollarSign}
          extra={<MiniTrend values={revenueTrend} />}
        />
        <Metric
          title="Gross Profit"
          value={summary.loading ? "Loading…" : currency(grossProfit)}
          note="Revenue less product cost"
          icon={TrendingUp}
          extra={
            <>
              <MiniTrend values={profitTrend} />
              <span className="dash-inline">Margin: {safe(current.grossMargin) === null ? "—" : `${safe(current.grossMargin).toFixed(1)}%`}</span>
            </>
          }
        />
        <Metric
          title="Total Orders"
          value={orderCount == null ? "—" : orderCount.toLocaleString()}
          note={<Comparison current={orderCount} previous={safe(priorSummary.transactionCount)} label={comparisonLabel} />}
          icon={Boxes}
          tone="blue"
          extra={
            <>
              <MiniTrend values={orderTrend} tone="blue" />
              <span className="dash-inline">/ {units == null ? "—" : units.toLocaleString()} units</span>
            </>
          }
        />
        <Metric
          title="Operating Result"
          value={coverage.result === null ? "Unavailable" : currency(coverage.result)}
          note={expenses === null ? "Expense data unavailable" : coverage.result < 0 ? `Shortfall · ${currency(coverage.shortfall)}` : "After recorded operating expenses"}
          icon={Wallet}
          tone={coverage.result !== null && coverage.result < 0 ? "red" : "teal"}
          extra={expenses !== null && <span className="dash-inline">vs {currency(expenses)} opex</span>}
        />
      </div>

      <div className="dash-main-grid">
        <section className="dash-card dash-panel dash-chart-panel">
          <SectionTitle
            icon={TrendingUp}
            title="Revenue vs Cost vs Gross Profit"
            subtitle="Understand how sales and product costs affect your profit."
            action={
              <div className="dash-legend">
                <span>
                  <i className="blue" />
                  Revenue
                </span>
                <span>
                  <i className="teal" />
                  Product Cost
                </span>
                <span>
                  <i className="amber" />
                  Gross Profit
                </span>
              </div>
            }
          />
          <div className="dash-legend">
            <small>{chartTitle} · interval totals</small>
          </div>
          <div className="dash-chart">
            {trend.error ? (
              <WidgetState query={trend}>{() => null}</WidgetState>
            ) : trend.loading ? (
              <WidgetState query={trend}>{() => null}</WidgetState>
            ) : !series.length ? (
              <div className="dash-empty">No sales trend data for this period.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={series} margin={{ top: 12, right: 16, left: 4, bottom: 2 }}>
                  <defs>
                    <linearGradient id="dashRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.14} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="dashCost" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.12} />
                      <stop offset="100%" stopColor="#14b8a6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#e9eef5" vertical={false} />
                  <XAxis dataKey="period" tickFormatter={displayDate} tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} minTickGap={24} />
                  <YAxis
                    tickFormatter={(value) => util.formatCurrency(value, (util.getSetting() || {}).currency || "", (util.getSetting() || {}).currencyPosition || 0)}
                    tick={{ fill: "#64748b", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    width={80}
                  />
                  <ChartTooltip content={<DashboardChartTooltip />} />
                  <Area type="linear" dataKey="salesRevenue" name="Revenue" stroke="#3b82f6" strokeWidth={2.5} fill="url(#dashRevenue)" connectNulls={false} />
                  <Area type="linear" dataKey="salesCost" name="Product Cost" stroke="#14b8a6" strokeWidth={2} fill="url(#dashCost)" connectNulls={false} />
                  <Line type="linear" dataKey="grossProfit" name="Gross Profit" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 2 }} activeDot={{ r: 5 }} connectNulls={false} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="dash-insight">
            <Sparkles size={17} />
            <span>
              <strong>Executive Insight:</strong>{" "}
              {grossProfit === null
                ? "Sales and profit insight is unavailable until the reporting data loads."
                : `Gross profit for ${chartTitle.toLowerCase()} is ${currency(grossProfit)}${safe(current.grossMargin) === null ? "." : ` at a ${safe(current.grossMargin).toFixed(1)}% margin.`}`}
            </span>
            <Link to={reports.sales}>
              View Sales Report <ArrowRight size={13} />
            </Link>
          </div>
        </section>
        <div className="dash-side-stack">
          <TargetPanel locationId={locationId} goalQuery={goalPerformance} />
          <section className="dash-card dash-panel">
            <SectionTitle icon={Wallet} title="Can Your Business Cover Its Expenses?" subtitle="Compare gross profit with recorded operating expenses." />
            <div className="dash-bars">
              <div>
                <div className="dash-bar-label">
                  <span>Gross Profit</span>
                  <strong>{currency(grossProfit)}</strong>
                </div>
                <div className="dash-track">
                  <span className="teal" style={{ width: `${coverage.profitBar}%` }} />
                </div>
              </div>
              <div>
                <div className="dash-bar-label expense">
                  <span>Operating Expenses</span>
                  <strong>{currency(expenses)}</strong>
                </div>
                <div className="dash-track">
                  <span className="expense" style={{ width: `${coverage.expenseBar}%` }} />
                </div>
              </div>
            </div>
            {coverage.result === null ? (
              <div className="dash-summary neutral">Expense coverage cannot be calculated because sales or expense data is unavailable.</div>
            ) : expenses === 0 ? (
              <div className="dash-summary neutral">No operating expenses are recorded for this period; coverage cannot be assessed.</div>
            ) : (
              <div className={`dash-summary ${coverage.result < 0 ? "loss" : "surplus"}`}>
                <strong>{coverage.coverage.toFixed(1)}% of recorded expenses covered</strong>
                <span>{coverage.result < 0 ? `Shortfall: ${currency(coverage.shortfall)}` : `Surplus: ${currency(coverage.result)}`}</span>
              </div>
            )}
            <p className="dash-explanation">
              {coverage.result === null
                ? "Check the financial report for missing inputs."
                : expenses === 0
                  ? "An empty expense total does not confirm profitability."
                  : coverage.result < 0
                    ? `Gross profit is ${currency(coverage.shortfall)} below recorded operating expenses for this period.`
                    : "Gross profit exceeds recorded operating expenses for this period."}
            </p>
            <Link className="dash-link" to={reports.financial}>
              View Financial Report <ArrowRight size={14} />
            </Link>
          </section>
        </div>
      </div>

      <section className="dash-card dash-panel dash-attention">
        <SectionTitle
          icon={Bell}
          title="What Needs Your Attention?"
          subtitle="Important things you may want to review."
          action={
            <Button type="link" onClick={() => setHealthVisible(true)}>
              View All Insights ({insights.length}) <ArrowRight size={14} />
            </Button>
          }
        />
        {insights.length === 0 ? (
          <div className="dash-all-clear">
            <CheckCircle2 size={18} /> No actionable issues were returned by the available dashboard data.
          </div>
        ) : (
          <div className="dash-insight-grid">
            {insights.map((item) => (
              <article key={item.key} className={`dash-alert ${item.tone}`}>
                <div className="dash-alert-head">
                  <item.icon size={17} />
                  <span>{item.tone === "red" ? "HIGH PRIORITY" : "MEDIUM"}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
                <Link to={item.href}>
                  {item.label} <ArrowRight size={13} />
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>

      <div className="dash-bottom-grid">
        <section className="dash-card dash-panel">
          <SectionTitle
            icon={PackageSearch}
            title={`Top Moving Products (${activeRange ? activeRange[1] : "Selected period"})`}
            subtitle="Ranked by gross sales revenue."
            action={
              <Link to={reports.catalog}>
                View Full Catalog <ArrowRight size={14} />
              </Link>
            }
          />
          {products.loading || products.error ? (
            <WidgetState query={products}>{() => null}</WidgetState>
          ) : !productRecords.length ? (
            <div className="dash-empty">No product sales found for this period.</div>
          ) : (
            <div className="dash-table-wrap">
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>Product details</th>
                    <th>Units sold</th>
                    <th>Avg selling price</th>
                    <th>Gross revenue</th>
                    <th className="amount">Margin %</th>
                  </tr>
                </thead>
                <tbody>
                  {productRecords.map((row, index) => {
                    const qty = safe(row.quantitySold), revenue = safe(row.salesRevenue), margin = safe(row.grossMargin);
                    return (
                      <tr key={row.productVariantId || row.productId || index}>
                        <td>
                          <strong>{row.itemName || "Unnamed product"}</strong>
                          {row.variantName && <small>{row.variantName}</small>}
                        </td>
                        <td>{qty === null ? "—" : `${qty} ${row.unitName || "units"}`}</td>
                        <td>{qty > 0 && revenue !== null ? currency(revenue / qty) : "—"}</td>
                        <td className="amount">{currency(revenue)}</td>
                        <td className="amount">
                          {margin === null ? "—" : <span className={`dash-margin-badge ${margin > 0 ? "positive" : "negative"}`}>{margin.toFixed(1)}%</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="dash-table-total">
                <span>
                  {productRecords.length} top product lines
                  {productData.share === null ? " · sales share unavailable" : ` · ${Math.min(productData.share, 100).toFixed(1)}% of eligible sales`}
                </span>
                <strong>Top product revenue: {currency(productData.total)}</strong>
              </div>
              <p className="dash-footnote">SKU and category are not included in the product report response.</p>
            </div>
          )}
        </section>
        <section className="dash-card dash-panel">
          <SectionTitle icon={Clock3} title="Recent Sales Orders" subtitle="Latest orders in the selected date and branch scope." action={<span className="dash-latest">Latest {RECENT_ORDER_LIMIT}</span>} />
          {orders.loading || orders.error ? (
            <WidgetState query={orders}>{() => null}</WidgetState>
          ) : !orderRows.length ? (
            <div className="dash-empty">No sales orders found for this period.</div>
          ) : (
            <div className="dash-orders">
              {orderRows.map((row, index) => {
                const isRetail = String(row.type || "").toUpperCase() === "RETAIL";
                const customerName = row.customerId === "WALK_IN" ? "Walk-in Customer" : [row.firstName, row.lastName].filter(Boolean).join(" ") || "Customer not listed";

                return (
                  <Link className="dash-order" key={row.id || index} to={`/transactions/sale-order/detail/${row.id}`}>
                    <span className="dash-order-type" title={isRetail ? "Retail sale" : "Sales order"} aria-label={isRetail ? "Retail sale" : "Sales order"}>
                      {isRetail ? "POS" : "SO"}
                    </span>
                    <span className="dash-order-copy">
                      <strong>{row.number || (isRetail ? "Retail sale" : "Sales order")}</strong>
                      <small>
                        {customerName} · {row.registerDate ? displayTimestamp(row.registerDate, context.timeZone) : "Date unavailable"}
                      </small>
                    </span>
                    <span className="dash-order-total">
                      {currency(safe(row.total))}
                      <small>{row.status || "Status unavailable"}</small>
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>

      <Drawer title="Business health and available insights" visible={healthVisible} onClose={() => setHealthVisible(false)} width={460}>
        <p>Current metrics follow the selected reporting period and branch. Sales goals use month to date.</p>
        <WidgetState query={businessHealth}>
          {() => (
            <>
              <Alert type={healthStatus.alertType} showIcon message={healthStatus.label} description={assessment.summary || "Business health assessment is unavailable."} />
              <ul className="dash-drawer-list">
                <li><strong>Gross profit:</strong> {currency(safe(healthMetrics.grossProfit))}</li>
                <li><strong>Recorded operating expenses:</strong> {currency(safe(healthMetrics.operatingExpenses))}</li>
                <li><strong>Operating result:</strong> {currency(safe(healthMetrics.operatingResult))}</li>
                <li><strong>Expense coverage:</strong> {healthCoverage === null ? "Unavailable" : `${healthCoverage.toFixed(1)}%`}</li>
                <li><strong>Policy version:</strong> {assessment.policyVersion == null ? "Unavailable" : assessment.policyVersion}</li>
                <li><strong>Evaluated:</strong> {displayTimestamp(assessment.evaluatedAt, context.timeZone)}</li>
              </ul>
              {healthReasons.map((reason, index) => (
                <Alert key={`${reason.code || "reason"}-${index}`} type={businessHealthReasonType(reason.severity)} showIcon message={reason.message} style={{ marginBottom: 10 }} />
              ))}
            </>
          )}
        </WidgetState>
        <p><strong>Other dashboard metrics and insights</strong></p>
        <ul className="dash-drawer-list">
          <li>
            <strong>Gross sales:</strong> {currency(grossSales)}
          </li>
          <li>
            <strong>Sales goal achievement:</strong> {goalDisplay}
          </li>
        </ul>
        {insights.length ? (
          insights.map((item) => <Alert key={item.key} type={item.tone === "red" ? "error" : "warning"} showIcon message={item.title} description={item.body} style={{ marginBottom: 10 }} />)
        ) : (
          <Alert type="info" showIcon message="No additional dashboard insights for this scope." />
        )}
      </Drawer>
    </main>
  );
}

export default withRouter(ERPSalesDashboard);
