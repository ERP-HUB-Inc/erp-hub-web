import React from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  DatePicker,
  Empty,
  PageHeader,
  Progress,
  Row,
  Select,
  Statistic,
  Table,
  Tabs,
  Tag
} from "antd";
import {
  AlertTriangle,
  Banknote,
  BarChart3,
  Boxes,
  CircleDollarSign,
  CreditCard,
  HandCoins,
  Lightbulb,
  PieChart,
  ReceiptText,
  RefreshCw,
  Target,
  TrendingDown,
  TrendingUp,
  Wallet
} from "lucide-react";
import moment from "moment";
import history from "../../../../common/router/history";
import Util from "../../../../common/util";
import NoPermissionV2 from "../../../../common/components/shares/List/NoPermissionV2";
import LocationService from "@services/LocationService";
import PrivilegeService from "../../../services/settings/PrivilegeService";
import FinancialService from "../../../services/report/FinancialService";
import "../Item/index.css";
import "./index.css";

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;

const permission_module_code = "report";
const permission_code = "sales_report";
const util = new Util();
const pathName = document.location.pathname;

const getNumber = value => Number(value || 0);
const getMoney = value => util.formatCurrency(getNumber(value));
const getMoneyOrEmpty = value => value === null || value === undefined ? "-" : getMoney(value);
const getQuantity = value => getNumber(value).toLocaleString();
const getPercent = value => `${getNumber(value).toFixed(2)}%`;
const getPercentOrEmpty = value => value === null || value === undefined ? "-" : getPercent(value);
const getEmpty = value => (value === null || value === undefined || value === "" ? "-" : value);
const getStatus = value => getEmpty(value).toString().replace(/_/g, " ").toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
const getSafePercent = value => Math.max(0, Math.min(getNumber(value), 100));
const getPayload = response => response && response.data && response.data.data ? response.data.data : response && response.data ? response.data : {};
const getChangeColor = value => getNumber(value) < 0 ? "#cf1322" : "#3f8600";
const getChangePrefix = value => getNumber(value) > 0 ? "+" : "";

function FinancialMetricCard({ title, value, helper, changePercent, icon: IconComponent, loading, variant }) {
  return (
    <Col xs={24} sm={12} lg={6} className="sales-performance-kpi-col">
      <Card loading={loading} className={`sales-performance-card sales-performance-kpi-card ${variant || ""}`}>
        <div className="sales-performance-card-header">
          <div>
            <p>{title}</p>
            <h4>{value}</h4>
          </div>
          <span className="sales-performance-card-icon">
            <IconComponent size={18} />
          </span>
        </div>
        <span className="sales-performance-helper">{helper}</span>
        {changePercent !== null && changePercent !== undefined && (
          <strong className="sales-performance-footer" style={{ color: getChangeColor(changePercent) }}>
            {getChangePrefix(changePercent)}{getPercent(changePercent)} vs previous period
          </strong>
        )}
      </Card>
    </Col>
  );
}

function MoneyFlowRow({ label, value, icon: IconComponent, variant }) {
  return (
    <div className={`sales-performance-list-row ${variant || ""}`}>
      <span>
        <i className="sales-performance-row-icon"><IconComponent size={14} /></i>
        {label}
      </span>
      <strong>{value}</strong>
    </div>
  );
}

function InsightCard({ insight }) {
  return (
    <Col xs={24} md={12} key={`${insight.title}-${insight.message}`} className="sales-performance-comparison-col">
      <div className="sales-performance-card">
        <div className="sales-business-insight-title">
          <span className="sales-business-insight-title-icon">
            <Lightbulb size={16} />
          </span>
          <div>
            <p>{insight.title}</p>
            <h4>{insight.message}</h4>
          </div>
        </div>
        <p className="sales-business-insight-note">{insight.consideration}</p>
      </div>
    </Col>
  );
}

export default function FinancialReport() {
  const params = new URLSearchParams(document.location.search);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [locations, setLocations] = React.useState([]);
  const [isHasAccessPermission, setIsHasAccessPermission] = React.useState(null);
  const [filters, setFilters] = React.useState({
    startDate: params.get("startDate") || moment().startOf("month").format("YYYY-MM-DD"),
    endDate: params.get("endDate") || moment().endOf("month").format("YYYY-MM-DD"),
    locationId: params.get("locationId") || "",
    targetType: params.get("targetType") || "MONTHLY"
  });
  const [dashboard, setDashboard] = React.useState({});
  const [summary, setSummary] = React.useState({});

  const cleanParams = values => Object.keys(values).reduce((result, key) => {
    if (values[key] !== "" && values[key] !== null && values[key] !== undefined) {
      result[key] = values[key];
    }
    return result;
  }, {});

  const updateURL = nextFilters => {
    const nextParams = new URLSearchParams();
    Object.keys(cleanParams(nextFilters)).forEach(key => nextParams.set(key, nextFilters[key]));
    history.push({ pathname: pathName, search: `?${nextParams.toString()}` });
  };

  const fetchReport = nextFilters => {
    const option = cleanParams({
      startDate: nextFilters.startDate,
      endDate: nextFilters.endDate,
      locationId: nextFilters.locationId,
      targetType: nextFilters.targetType
    });

    setLoading(true);
    setError("");

    Promise.all([
      FinancialService.getDashboard(option),
      FinancialService.getSummary(option)
    ])
      .then(([dashboardResponse, summaryResponse]) => {
        setDashboard(getPayload(dashboardResponse));
        setSummary(getPayload(summaryResponse));
      })
      .catch(() => setError("Unable to load financial report. Please try again."))
      .finally(() => setLoading(false));
  };

  const applyFilters = nextValues => {
    const nextFilters = { ...filters, ...nextValues };
    setFilters(nextFilters);
    updateURL(nextFilters);
    fetchReport(nextFilters);
  };

  React.useEffect(() => {
    PrivilegeService.checkPermission(permission_module_code, permission_code)
      .then(({ data }) => {
        setIsHasAccessPermission(data);
        if (data) fetchReport(filters);
      })
      .catch(() => setIsHasAccessPermission(false));

    LocationService.get({ limit: 500 }).then(response => {
      if (response.data && response.data.data) setLocations(response.data.data);
    });

    updateURL(filters);
    // eslint-disable-next-line
  }, []);

  const cards = dashboard.cards || {};
  const revenuePerformance = dashboard.revenuePerformance || {};
  const profitability = dashboard.profitability || {};
  const cashFlow = dashboard.cashFlow || {};
  const expenses = dashboard.expenses || {};
  const inventory = dashboard.inventory || {};
  const receivables = dashboard.receivables || {};
  const payables = dashboard.payables || {};
  const insights = Array.isArray(dashboard.insights) ? dashboard.insights : [];
  const investmentRecovery = cards.investmentRecovery || {};
  const summaryRows = [
    { section: "Income", name: "Total Revenue", amount: summary.totalRevenue },
    { section: "Income", name: "Total Income", amount: summary.totalIncome },
    ...(Array.isArray(summary.incomes) ? summary.incomes.map(item => ({ section: "Income", ...item })) : []),
    ...(Array.isArray(summary.cogs) ? summary.cogs.map(item => ({ section: "Cost of Goods Sold", ...item })) : []),
    ...(Array.isArray(summary.expenses) ? summary.expenses.map(item => ({ section: "Expense", ...item })) : []),
    { section: "Result", name: "Gross Profit", amount: summary.grossProfit },
    { section: "Result", name: "Net Income", amount: summary.netIncome }
  ];
  const hasDashboardData = Object.keys(dashboard).length > 0;

  const overviewCards = [
    {
      title: "Revenue",
      value: getMoney(cards.revenue && cards.revenue.amount),
      helper: "Sales generated in the selected period",
      changePercent: cards.revenue && cards.revenue.changePercent,
      icon: CircleDollarSign,
      variant: "is-sales"
    },
    {
      title: "Gross Profit",
      value: getMoney(cards.grossProfit && cards.grossProfit.amount),
      helper: `Gross margin ${getPercentOrEmpty(cards.grossProfit && cards.grossProfit.margin)}`,
      changePercent: cards.grossProfit && cards.grossProfit.changePercent,
      icon: TrendingUp,
      variant: "is-profit"
    },
    {
      title: "Operating Expenses",
      value: getMoney(cards.operatingExpenses && cards.operatingExpenses.amount),
      helper: "Business expenses recorded this period",
      changePercent: cards.operatingExpenses && cards.operatingExpenses.changePercent,
      icon: ReceiptText,
      variant: "is-expense"
    },
    {
      title: "Net Profit",
      value: getMoney(cards.netProfit && cards.netProfit.amount),
      helper: `Net margin ${getPercentOrEmpty(cards.netProfit && cards.netProfit.margin)}`,
      changePercent: cards.netProfit && cards.netProfit.changePercent,
      icon: Wallet,
      variant: getNumber(cards.netProfit && cards.netProfit.amount) < 0 ? "is-loss" : "is-profit"
    },
    {
      title: "Cash Available",
      value: getMoney(cards.cashAvailable),
      helper: "Estimated available cash",
      icon: Banknote,
      variant: "is-target"
    },
    {
      title: "Accounts Receivable",
      value: getMoney(cards.accountsReceivable),
      helper: "Customer balances to collect",
      icon: HandCoins,
      variant: "is-sales"
    },
    {
      title: "Accounts Payable",
      value: getMoney(cards.accountsPayable),
      helper: "Supplier and vendor obligations",
      icon: CreditCard,
      variant: "is-cost"
    },
    {
      title: "Inventory Value",
      value: getMoney(cards.inventoryValue),
      helper: "Money currently tied up in stock",
      icon: Boxes,
      variant: "is-margin"
    }
  ];

  const revenueRows = [
    { metric: "Current Revenue", current: getMoney(revenuePerformance.currentRevenue), previous: getMoney(revenuePerformance.previousRevenue), change: getPercent(revenuePerformance.revenueGrowth) },
    { metric: "Orders", current: getQuantity(revenuePerformance.orders), previous: getQuantity(revenuePerformance.previousOrders), change: getPercent(revenuePerformance.orderGrowth) },
    { metric: "Average Transaction Value", current: getMoney(revenuePerformance.averageTransactionValue), previous: "-", change: "-" },
    { metric: "Daily Average", current: getMoney(revenuePerformance.dailyAverage), previous: "-", change: "-" },
    { metric: "Monthly Average", current: getMoney(revenuePerformance.monthlyAverage), previous: "-", change: "-" },
    { metric: "Revenue Forecast", current: getMoney(revenuePerformance.revenueForecast), previous: "-", change: "-" }
  ];
  const profitabilityRows = [
    { label: "Revenue", value: getMoney(profitability.revenue), icon: CircleDollarSign, variant: "is-sales" },
    { label: "Cost of Goods Sold", value: `-${getMoney(profitability.cogs)}`, icon: Boxes, variant: "is-cost" },
    { label: "Gross Profit", value: getMoney(profitability.grossProfit), icon: TrendingUp, variant: "is-profit" },
    { label: "Operating Expenses", value: `-${getMoney(profitability.operatingExpenses)}`, icon: ReceiptText, variant: "is-expense" },
    { label: "Net Profit", value: getMoney(profitability.netProfit), icon: getNumber(profitability.netProfit) < 0 ? TrendingDown : Wallet, variant: getNumber(profitability.netProfit) < 0 ? "is-loss" : "is-profit" }
  ];
  const cashRows = [
    { label: "Opening Cash", value: getMoneyOrEmpty(cashFlow.openingCash), icon: Banknote },
    { label: "Cash Received", value: getMoney(cashFlow.cashReceived), icon: TrendingUp, variant: "is-profit" },
    { label: "Cash Paid", value: `-${getMoney(cashFlow.cashPaid)}`, icon: TrendingDown, variant: "is-expense" },
    { label: "Net Cash Movement", value: getMoney(cashFlow.netCashMovement), icon: BarChart3, variant: getNumber(cashFlow.netCashMovement) < 0 ? "is-loss" : "is-profit" },
    { label: "Closing Cash", value: getMoney(cashFlow.closingCash), icon: Wallet }
  ];

  const expenseColumns = [
    { title: "Expense", dataIndex: "name", key: "name", render: getEmpty },
    { title: "Amount", dataIndex: "amount", key: "amount", width: 160, align: "right", render: getMoney },
    { title: "% of Revenue", dataIndex: "percentOfRevenue", key: "percentOfRevenue", width: 140, align: "right", render: getPercent }
  ];
  const revenueColumns = [
    { title: "Metric", dataIndex: "metric", key: "metric" },
    { title: "Current", dataIndex: "current", key: "current", align: "right" },
    { title: "Previous", dataIndex: "previous", key: "previous", align: "right" },
    { title: "Change", dataIndex: "change", key: "change", align: "right" }
  ];
  const trendColumns = [
    { title: "Month", dataIndex: "month", key: "month", render: getEmpty },
    { title: "Gross Margin", dataIndex: "grossMargin", key: "grossMargin", align: "right", render: getPercent },
    { title: "Net Margin", dataIndex: "netMargin", key: "netMargin", align: "right", render: getPercent }
  ];
  const summaryColumns = [
    { title: "Section", dataIndex: "section", key: "section", width: 170 },
    { title: "Name", dataIndex: "name", key: "name", render: getEmpty },
    { title: "Amount", dataIndex: "amount", key: "amount", width: 160, align: "right", render: getMoney }
  ];

  const renderDateRangeFilter = () => (
    <RangePicker
      className="sales-report-date-range"
      allowClear={false}
      format="DD/MM/YYYY"
      value={[moment(filters.startDate), moment(filters.endDate)]}
      onChange={values => applyFilters({ startDate: values[0].format("YYYY-MM-DD"), endDate: values[1].format("YYYY-MM-DD") })}
    />
  );

  const renderLocationFilter = () => (
    <Select className="sales-report-store-filter" value={filters.locationId} onChange={value => applyFilters({ locationId: value })}>
      {[{ id: "", name: "All stores" }].concat(locations).map(location => <Option key={location.id} value={location.id}>{location.name}</Option>)}
    </Select>
  );

  const renderReportToolbar = () => (
    <div className="sales-report-filter-bar sales-report-tab-toolbar">
      {renderDateRangeFilter()}
      {renderLocationFilter()}
      <Select className="sales-report-target-filter" value={filters.targetType} onChange={value => applyFilters({ targetType: value })}>
        {["DAILY", "WEEKLY", "MONTHLY"].map(value => <Option key={value} value={value}>{getStatus(value)}</Option>)}
      </Select>
      <Button className="sales-report-refresh-button" onClick={() => fetchReport(filters)} loading={loading}>
        {!loading && <RefreshCw size={14} />}
        Refresh
      </Button>
    </div>
  );

  const renderOverview = () => (
    <>
      <Row gutter={16} className="financial-report-overview-grid">
        {overviewCards.map(item => <FinancialMetricCard key={item.title} loading={loading} {...item} />)}
      </Row>
      <Row gutter={16} type="flex" className="sales-performance-comparison-row">
        <Col xs={24} lg={12} className="sales-performance-comparison-col">
          <div className="sales-performance-card">
            <div className="sales-performance-section-header">
              <div>
                <p>Sales Target</p>
                <h4>{getRoundedTargetLabel()}</h4>
              </div>
              <span className="sales-performance-card-icon"><Target size={18} /></span>
            </div>
            <Progress percent={getSafePercent(revenuePerformance.targetAchievement)} showInfo={false} strokeColor="#6c4cff" trailColor="#ebe7f5" />
            <div className="sales-performance-list">
              <MoneyFlowRow label="Sales Target" value={getMoney(revenuePerformance.salesTarget)} icon={Target} />
              <MoneyFlowRow label="Current Revenue" value={getMoney(revenuePerformance.currentRevenue)} icon={CircleDollarSign} variant="is-sales" />
              <MoneyFlowRow label="Achievement" value={getPercent(revenuePerformance.targetAchievement)} icon={BarChart3} variant="is-profit" />
            </div>
          </div>
        </Col>
        <Col xs={24} lg={12} className="sales-performance-comparison-col">
          <div className="sales-performance-card">
            <div className="sales-performance-section-header">
              <div>
                <p>Investment Recovery</p>
                <h4>{getPercentOrEmpty(investmentRecovery.progress)}</h4>
              </div>
              <span className="sales-performance-card-icon"><PieChart size={18} /></span>
            </div>
            {investmentRecovery.progress !== null && investmentRecovery.progress !== undefined && (
              <Progress percent={getSafePercent(investmentRecovery.progress)} showInfo={false} strokeColor="#16a34a" trailColor="#e8f5e9" />
            )}
            <div className="sales-performance-list">
              <MoneyFlowRow label="Recovered" value={getMoney(investmentRecovery.recovered)} icon={TrendingUp} variant="is-profit" />
              <MoneyFlowRow label="Remaining" value={getMoneyOrEmpty(investmentRecovery.remaining)} icon={Wallet} />
            </div>
            {investmentRecovery.note && <p className="sales-business-insight-note">{investmentRecovery.note}</p>}
          </div>
        </Col>
      </Row>
      <Row gutter={16} type="flex" className="sales-performance-comparison-row">
        {insights.length ? insights.map(insight => <InsightCard key={`${insight.title}-${insight.message}`} insight={insight} />) : (
          <Col span={24}><Empty description="No financial insights are available for this period." /></Col>
        )}
      </Row>
    </>
  );

  const getRoundedTargetLabel = () => `${getNumber(revenuePerformance.targetAchievement).toFixed(0)}% reached`;

  if (isHasAccessPermission === false) return <NoPermissionV2 />;

  return (
    <div id="sales-report" className="sales-report-page">
      <div className="sales-report-header">
        <PageHeader
          title="Financial Report"
          subTitle="Financial health, profitability, cash flow, and decision insights"
        />
      </div>
      {error && <Alert type="error" message={error} showIcon style={{ marginBottom: 15 }} />}
      {renderReportToolbar()}
      {!loading && !hasDashboardData ? (
        <Card><Empty description="No financial data is available for this period." /></Card>
      ) : (
        <Tabs defaultActiveKey="overview" className="sales-report-tabs financial-report-tabs">
          <TabPane tab="Financial Overview" key="overview">
            {renderOverview()}
          </TabPane>
          <TabPane tab="Revenue Performance" key="revenue">
            <Table className="sales-report-table" rowKey="metric" size="small" loading={loading} dataSource={revenueRows} columns={revenueColumns} pagination={false} />
          </TabPane>
          <TabPane tab="Profitability" key="profitability">
            <Row gutter={16} type="flex" className="sales-performance-comparison-row">
              <Col xs={24} lg={12} className="sales-performance-comparison-col">
                <div className="sales-performance-card">
                  <div className="sales-performance-section-header">
                    <div>
                      <p>Profit Flow</p>
                      <h4>Revenue to Net Profit</h4>
                    </div>
                    <Tag color={getNumber(profitability.netProfit) < 0 ? "red" : "green"}>{getPercent(profitability.netMargin)} Net Margin</Tag>
                  </div>
                  <div className="sales-performance-list is-breakdown">
                    {profitabilityRows.map(row => <MoneyFlowRow key={row.label} {...row} />)}
                  </div>
                </div>
              </Col>
              <Col xs={24} lg={12} className="sales-performance-comparison-col">
                <Table className="sales-report-table" rowKey="month" size="small" loading={loading} dataSource={Array.isArray(profitability.trend) ? profitability.trend : []} columns={trendColumns} pagination={false} />
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="Cash Flow & Survival" key="cash">
            <Row gutter={16} type="flex" className="sales-performance-comparison-row">
              <Col xs={24} lg={12} className="sales-performance-comparison-col">
                <div className="sales-performance-card">
                  <div className="sales-performance-section-header">
                    <div>
                      <p>Cash Flow</p>
                      <h4>{getMoney(cashFlow.netCashMovement)} Net Movement</h4>
                    </div>
                    <span className="sales-performance-card-icon"><Wallet size={18} /></span>
                  </div>
                  <div className="sales-performance-list is-breakdown">
                    {cashRows.map(row => <MoneyFlowRow key={row.label} {...row} />)}
                  </div>
                </div>
              </Col>
              <Col xs={24} lg={12} className="sales-performance-comparison-col">
                <div className="sales-performance-card">
                  <div className="sales-performance-section-header">
                    <div>
                      <p>Survival Indicator</p>
                      <h4>{getNumber(cashFlow.cashRunwayMonths).toFixed(1)} months runway</h4>
                    </div>
                    <span className="sales-performance-card-icon"><AlertTriangle size={18} /></span>
                  </div>
                  <div className="sales-performance-list">
                    <MoneyFlowRow label="Accounts Receivable" value={getMoney(cashFlow.accountsReceivable)} icon={HandCoins} variant="is-sales" />
                    <MoneyFlowRow label="Accounts Payable" value={getMoney(cashFlow.accountsPayable)} icon={CreditCard} variant="is-cost" />
                    <MoneyFlowRow label="Upcoming Payments" value={getMoney(cashFlow.upcomingPayments)} icon={ReceiptText} variant="is-expense" />
                  </div>
                  <p className="sales-business-insight-note">Cash runway is an estimate based on recent cash movement and may change with future sales, expenses, and collections.</p>
                </div>
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="Expenses" key="expenses">
            <Alert type="info" showIcon message={`Operating expenses total ${getMoney(expenses.total)} for the selected period.`} style={{ marginBottom: 15 }} />
            <Table className="sales-report-table" rowKey={(record, index) => record.name || index} size="small" loading={loading} dataSource={Array.isArray(expenses.items) ? expenses.items : []} columns={expenseColumns} pagination={false} />
          </TabPane>
          <TabPane tab="Inventory, AR & AP" key="balance">
            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Card loading={loading}>
                  <Statistic title="Inventory Value" value={getMoney(inventory.inventoryValue)} prefix={<Boxes size={16} />} />
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card loading={loading}>
                  <Statistic title="Accounts Receivable" value={getMoney(receivables.total)} prefix={<HandCoins size={16} />} suffix={`${getQuantity(receivables.count)} invoices`} />
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card loading={loading}>
                  <Statistic title="Accounts Payable" value={getMoney(payables.total)} prefix={<CreditCard size={16} />} suffix={`${getQuantity(payables.count)} bills`} />
                </Card>
              </Col>
            </Row>
            <Alert type="warning" showIcon message={`Upcoming payables: ${getMoney(payables.upcoming)}`} style={{ marginTop: 15 }} />
          </TabPane>
          <TabPane tab="Financial Summary" key="summary">
            <Table className="sales-report-table" rowKey={(record, index) => `${record.section}-${record.name}-${index}`} size="small" loading={loading} dataSource={summaryRows} columns={summaryColumns} pagination={false} />
          </TabPane>
        </Tabs>
      )}
    </div>
  );
}
