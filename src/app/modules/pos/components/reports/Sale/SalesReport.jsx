import React, { useRef } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  DatePicker,
  Icon,
  Input,
  PageHeader,
  Progress,
  Row,
  Select,
  Statistic,
  Table,
  Tabs
} from "antd";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  CircleDollarSign,
  DollarSign,
  Package,
  Percent,
  Target,
  TrendingUp,
  Wallet
} from "lucide-react";
import moment from "moment";
import history from "../../../../common/router/history";
import Util from "../../../../common/util";
import NoPermissionV2 from "../../../../common/components/shares/List/NoPermissionV2";
import LocationService from "@services/LocationService";
import PrivilegeService from "../../../services/settings/PrivilegeService";
import ReportSaleService from "../../../services/report/SaleService";
import "../Item/index.css";

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Search } = Input;
const { TabPane } = Tabs;

const permission_module_code = "report";
const permission_code = "sales_report";
const util = new Util();
const pathName = "/reports/sales-report";
const defaultLimit = 20;

const getNumber = value => Number(value || 0);
const getMoney = value => util.formatCurrency(getNumber(value));
const getMoneyOrEmpty = value => value === null || value === undefined ? "-" : getMoney(value);
const getNegativeMoneyOrEmpty = value => value === null || value === undefined ? "-" : `-${getMoney(value)}`;
const getQuantity = value => getNumber(value).toLocaleString();
const getPercent = value => `${getNumber(value).toFixed(2)}%`;
const getPercentOrEmpty = value => value === null || value === undefined ? "-" : getPercent(value);
const getEmpty = value => (value === null || value === undefined || value === "" ? "-" : value);
const getDate = value => value ? moment(value).format("DD/MM/YYYY") : "-";
const getStatus = value => getEmpty(value).toString().replace(/_/g, " ").toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
const getRoundedPercent = value => `${getNumber(value).toFixed(0)}%`;
const getRoundedPercentOrEmpty = value => value === null || value === undefined ? "-" : getRoundedPercent(value);
const getSafePercent = value => Math.max(0, Math.min(getNumber(value), 100));
const getPayload = response => response && response.data && response.data.data ? response.data.data : response && response.data ? response.data : {};
const getArray = payload => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.items)) return payload.items;
  if (Array.isArray(payload.products)) return payload.products;
  if (Array.isArray(payload.trend)) return payload.trend;
  return [];
};
const getTotal = payload => payload && payload.pagination ? payload.pagination.total : getArray(payload).length;

function ReportStatisticCard({ icon, iconClassName, title, value, valueStyle, loading }) {
  return (
    <Col xs={24} sm={12} md={8} lg={4} className="product-report-stat-col">
      <Card loading={loading} className={`product-report-stat-card ${iconClassName}`} bodyStyle={{ padding: 20 }}>
        <div className="product-report-stat-content">
          <span className={`product-report-stat-icon ${iconClassName}`}>
            <Icon type={icon} />
          </span>
          <Statistic title={title} value={value} valueStyle={valueStyle} className="product-report-statistic" />
        </div>
      </Card>
    </Col>
  );
}

export default function SalesReport() {
  const params = new URLSearchParams(document.location.search);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [locations, setLocations] = React.useState([]);
  const [isHasAccessPermission, setIsHasAccessPermission] = React.useState(null);
  const [filters, setFilters] = React.useState({
    fromDate: params.get("fromDate") || moment().startOf("month").format("YYYY-MM-DD"),
    toDate: params.get("toDate") || moment().endOf("month").format("YYYY-MM-DD"),
    locationId: params.get("locationId") || "",
    groupBy: params.get("groupBy") || "DAY",
    targetType: params.get("targetType") || "MONTHLY",
    keyword: params.get("keyword") || "",
    limit: Number(params.get("limit")) || defaultLimit,
    offset: Number(params.get("offset")) || 0,
    sortBy: params.get("sortBy") || "salesRevenue",
    sortDirection: params.get("sortDirection") || "DESC"
  });
  const [summary, setSummary] = React.useState({});
  const [trend, setTrend] = React.useState([]);
  const [products, setProducts] = React.useState([]);
  const [productsTotal, setProductsTotal] = React.useState(0);
  const [performance, setPerformance] = React.useState({});
  const [isPerformanceDetailsVisible, setIsPerformanceDetailsVisible] = React.useState(false);
  const timerRef = useRef(null);

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
    const commonOption = cleanParams({
      fromDate: nextFilters.fromDate,
      toDate: nextFilters.toDate,
      locationId: nextFilters.locationId
    });
    setLoading(true);
    setError("");

    Promise.all([
      ReportSaleService.getSalesSummary(commonOption),
      ReportSaleService.getSalesTrend({ ...commonOption, groupBy: nextFilters.groupBy }),
      ReportSaleService.getSalesProducts(cleanParams({
        ...commonOption,
        keyword: nextFilters.keyword,
        limit: nextFilters.limit,
        offset: nextFilters.offset,
        sortBy: nextFilters.sortBy,
        sortDirection: nextFilters.sortDirection
      })),
      ReportSaleService.getSalesPerformance({ ...commonOption, targetType: nextFilters.targetType })
    ])
      .then(([summaryResponse, trendResponse, productsResponse, performanceResponse]) => {
        const productsPayload = getPayload(productsResponse);
        setSummary(getPayload(summaryResponse));
        setTrend(getArray(getPayload(trendResponse)));
        setProducts(getArray(productsPayload));
        setProductsTotal(getTotal(productsPayload));
        setPerformance(getPayload(performanceResponse));
      })
      .catch(() => setError("Unable to load sales report. Please try again."))
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
    return () => clearTimeout(timerRef.current);
    // eslint-disable-next-line
  }, []);

  const statistics = [
    { title: "Revenue", value: getMoney(summary.totalRevenue || summary.salesRevenue || summary.revenue), icon: "dollar", iconClassName: "is-blue" },
    { title: "Net Sales", value: getMoney(summary.netSales || summary.totalNetSale), icon: "rise", iconClassName: "is-green", valueStyle: { color: "#3f8600" } },
    { title: "Orders", value: getQuantity(summary.totalOrders || summary.orderCount || summary.orders), icon: "shopping-cart", iconClassName: "is-purple" },
    { title: "Items Sold", value: getQuantity(summary.totalQuantity || summary.quantitySold || summary.itemsSold), icon: "inbox", iconClassName: "is-teal" },
    { title: "Discount", value: getMoney(summary.totalDiscount || summary.discount), icon: "tags", iconClassName: "is-orange" },
    { title: "Gross Profit", value: getMoney(summary.grossProfit || summary.totalProfit || summary.profit), icon: "line-chart", iconClassName: "is-red" }
  ];

  const productColumns = [
    { title: "Item", dataIndex: "itemName", key: "itemName", render: (value, record) => getEmpty(value || record.productName || record.name) },
    { title: "Variant", dataIndex: "variantName", key: "variantName", width: 140, render: getEmpty },
    { title: "Qty Sold", dataIndex: "quantitySold", key: "quantitySold", width: 110, align: "right", render: value => getQuantity(value) },
    { title: "Revenue", dataIndex: "salesRevenue", key: "salesRevenue", width: 140, align: "right", sorter: true, render: value => getMoney(value) },
    { title: "Product Cost", dataIndex: "salesCost", key: "salesCost", width: 140, align: "right", render: value => getMoney(value) },
    { title: "Gross Profit", dataIndex: "grossProfit", key: "grossProfit", width: 140, align: "right", render: value => getMoney(value) },
    { title: "Profit Margin", dataIndex: "grossMargin", key: "grossMargin", width: 130, align: "right", render: value => value === null || value === undefined ? "-" : getPercent(value) },
    { title: "Transactions", dataIndex: "transactionCount", key: "transactionCount", width: 125, align: "right", render: value => getQuantity(value) }
  ];

  const trendColumns = [
    { title: "Period", dataIndex: "period", key: "period", width: 140, render: value => getEmpty(value) },
    { title: "Sales Revenue", dataIndex: "salesRevenue", key: "salesRevenue", align: "right", render: value => getMoney(value) },
    { title: "Product Cost", dataIndex: "salesCost", key: "salesCost", align: "right", render: value => getMoney(value) },
    { title: "Gross Profit", dataIndex: "grossProfit", key: "grossProfit", align: "right", render: value => getMoney(value) },
    { title: "Profit Margin", dataIndex: "grossMargin", key: "grossMargin", align: "right", render: value => value === null || value === undefined ? "-" : getPercent(value) },
    { title: "Transactions", dataIndex: "transactionCount", key: "transactionCount", align: "right", render: value => getQuantity(value) },
    { title: "Items Sold", dataIndex: "itemsSold", key: "itemsSold", align: "right", render: value => getQuantity(value) }
  ];

  const performancePeriod = performance.period || {};
  const performanceTarget = performance.target || {};
  const performanceProfitability = performance.profitability || {};
  const performanceExpense = performance.operatingExpense || {};
  const performanceStatus = performance.performance || {};
  const targetRevenue = performanceTarget.targetRevenue;
  const actualRevenue = performanceTarget.actualRevenue;
  const achievementPercent = performanceTarget.achievementPercent;
  const remainingRevenue = performanceTarget.remainingRevenue;
  const salesCost = performanceProfitability.salesCost;
  const grossProfit = performanceProfitability.grossProfit;
  const grossMargin = performanceProfitability.grossMargin;
  const expenseAmount = performanceExpense.amount;
  const estimatedProfit = performanceExpense.surplus;
  const hasSalesTarget = targetRevenue !== null && targetRevenue !== undefined && getNumber(targetRevenue) > 0;
  const hasBusinessExpenses = getNumber(expenseAmount) > 0;
  const canShowExpenseCoverage = performanceExpense.coveragePercent !== null && performanceExpense.coveragePercent !== undefined;
  const isEstimatedProfitNegative = getNumber(estimatedProfit) < 0;
  const progressPercent = getSafePercent(achievementPercent);
  const periodTitle = performancePeriod.fromDate ? moment(performancePeriod.fromDate).format("MMMM YYYY") : "Business Performance";
  const periodDescription = performancePeriod.fromDate && performancePeriod.toDate
    ? `${moment(performancePeriod.fromDate).format("MMM D")} - ${moment(performancePeriod.toDate).format("MMM D, YYYY")}`
    : "Current selected period";
  const targetStatusLabel = !hasSalesTarget
    ? "No Target"
    : performanceStatus.targetStatus === "BELOW_TARGET"
      ? "Behind Target"
      : performanceStatus.targetStatus === "TARGET_REACHED" || performanceStatus.targetStatus === "ACHIEVED"
        ? "Target Reached"
        : performanceStatus.targetStatus === "ABOVE_TARGET" || performanceStatus.targetStatus === "EXCEEDED"
          ? "Target Exceeded"
          : getStatus(performanceStatus.targetStatus);
  const targetStatusClassName = performanceStatus.targetStatus === "BELOW_TARGET"
    ? "is-warning"
    : performanceStatus.targetStatus === "TARGET_REACHED" || performanceStatus.targetStatus === "ACHIEVED" || performanceStatus.targetStatus === "ABOVE_TARGET" || performanceStatus.targetStatus === "EXCEEDED"
      ? "is-success"
      : "is-neutral";
  const StatusIcon = targetStatusClassName === "is-success" ? CheckCircle2 : AlertTriangle;
  const performanceKpis = [
    {
      title: "Sales This Month",
      value: getMoneyOrEmpty(actualRevenue),
      helper: "Total sales generated this month",
      footer: "Sales / Revenue",
      icon: DollarSign,
      variant: "is-sales"
    },
    {
      title: "Gross Profit",
      value: getMoneyOrEmpty(grossProfit),
      helper: "Profit after product cost",
      footer: "Product cost already removed",
      icon: TrendingUp,
      variant: "is-profit"
    },
    {
      title: "Sales Target",
      value: hasSalesTarget ? getPercentOrEmpty(achievementPercent) : "-",
      helper: hasSalesTarget ? `${getMoneyOrEmpty(actualRevenue)} of ${getMoneyOrEmpty(targetRevenue)}` : "No sales target has been set for this period.",
      footer: hasSalesTarget ? `${getMoneyOrEmpty(remainingRevenue)} still needed` : "Target not configured",
      progress: hasSalesTarget ? progressPercent : null,
      icon: Target,
      variant: "is-target"
    },
    {
      title: "Profit Margin",
      value: getPercentOrEmpty(grossMargin),
      helper: "Profit kept from each $100 of sales",
      footer: "Profit Margin",
      icon: Percent,
      variant: "is-margin"
    }
  ];
  const salesGoalRows = [
    { label: "Sales so far", value: getMoneyOrEmpty(actualRevenue) },
    { label: "Monthly target", value: getMoneyOrEmpty(targetRevenue) },
    { label: "Still needed", value: getMoneyOrEmpty(remainingRevenue) }
  ];
  const breakdownRows = [
    { label: "Sales", value: getMoneyOrEmpty(actualRevenue), icon: DollarSign, variant: "is-sales" },
    { label: "Product Cost", value: getNegativeMoneyOrEmpty(salesCost), icon: Package, variant: "is-cost" },
    { label: "Gross Profit", value: getMoneyOrEmpty(grossProfit), icon: TrendingUp, variant: "is-profit" },
    { label: "Business Expenses", value: getNegativeMoneyOrEmpty(expenseAmount), icon: Wallet, variant: "is-expense" },
    { label: "Estimated Profit", value: getMoneyOrEmpty(estimatedProfit), icon: CircleDollarSign, variant: isEstimatedProfitNegative ? "is-loss" : "is-profit", highlight: true }
  ];
  const businessSummary = [
    hasSalesTarget
      ? `Your business generated ${getMoneyOrEmpty(actualRevenue)} in sales this month, reaching ${getPercentOrEmpty(achievementPercent)} of your ${getMoneyOrEmpty(targetRevenue)} sales target.`
      : `Your business generated ${getMoneyOrEmpty(actualRevenue)} in sales this month.`,
    hasSalesTarget && remainingRevenue > 0 ? `You still need ${getMoneyOrEmpty(remainingRevenue)} in sales to reach your target.` : "",
    hasSalesTarget && remainingRevenue <= 0 ? "You have reached your sales target for this period." : "",
    `Your current gross profit is ${getMoneyOrEmpty(grossProfit)} with a ${getPercentOrEmpty(grossMargin)} profit margin.`,
    hasBusinessExpenses
      ? `After ${getMoneyOrEmpty(expenseAmount)} in business expenses, your estimated profit is ${getMoneyOrEmpty(estimatedProfit)}.`
      : "No business expenses recorded for this period."
  ].filter(Boolean);

  const performanceRows = [
    { group: "Period", metric: "Period", value: performancePeriod.fromDate && performancePeriod.toDate ? `${getDate(performancePeriod.fromDate)} - ${getDate(performancePeriod.toDate)}` : "-" },
    { group: "Period", metric: "Target Type", value: getStatus(performancePeriod.targetType) },
    { group: "Target", metric: "Sales Target", value: getMoneyOrEmpty(targetRevenue) },
    { group: "Target", metric: "Sales This Month", value: getMoneyOrEmpty(actualRevenue) },
    { group: "Target", metric: "Target Progress", value: getPercentOrEmpty(achievementPercent) },
    { group: "Target", metric: "Sales Still Needed", value: getMoneyOrEmpty(remainingRevenue) },
    { group: "Profitability", metric: "Product Cost", value: getMoneyOrEmpty(salesCost) },
    { group: "Profitability", metric: "Gross Profit", value: getMoneyOrEmpty(grossProfit) },
    { group: "Profitability", metric: "Profit Margin", value: getPercentOrEmpty(grossMargin) },
    { group: "Operating Expense", metric: "Business Expenses", value: getMoneyOrEmpty(expenseAmount) },
    canShowExpenseCoverage ? { group: "Operating Expense", metric: "Expense Coverage", value: getPercentOrEmpty(performanceExpense.coveragePercent) } : null,
    { group: "Operating Expense", metric: "Estimated Profit", value: getMoneyOrEmpty(estimatedProfit) },
    { group: "Status", metric: "Sales Status", value: targetStatusLabel },
    hasBusinessExpenses ? { group: "Status", metric: "Expense Status", value: getStatus(performanceStatus.expenseCoverageStatus) } : null
  ].filter(Boolean);

  const performanceColumns = [
    { title: "Group", dataIndex: "group", key: "group", width: 180 },
    { title: "Metric", dataIndex: "metric", key: "metric" },
    { title: "Value", dataIndex: "value", key: "value", align: "right", render: getEmpty }
  ];

  const renderDateRangeFilter = () => (
    <RangePicker
      className="sales-report-date-range"
      allowClear={false}
      format="DD/MM/YYYY"
      value={[moment(filters.fromDate), moment(filters.toDate)]}
      onChange={values => applyFilters({ fromDate: values[0].format("YYYY-MM-DD"), toDate: values[1].format("YYYY-MM-DD"), offset: 0 })}
    />
  );

  const renderLocationFilter = () => (
    <Select className="sales-report-store-filter" value={filters.locationId} onChange={value => applyFilters({ locationId: value, offset: 0 })}>
      {[{ id: "", name: "All stores" }].concat(locations).map(location => <Option key={location.id} value={location.id}>{location.name}</Option>)}
    </Select>
  );

  const renderTrendToolbar = () => (
    <div className="sales-report-filter-bar sales-report-tab-toolbar">
      {renderDateRangeFilter()}
      {renderLocationFilter()}
      <Select className="sales-report-small-filter" value={filters.groupBy} onChange={value => applyFilters({ groupBy: value })}>
        {["DAY", "WEEK", "MONTH"].map(value => <Option key={value} value={value}>{value}</Option>)}
      </Select>
    </div>
  );

  const renderProductsToolbar = () => (
    <div className="sales-report-filter-bar sales-report-tab-toolbar">
      {renderDateRangeFilter()}
      {renderLocationFilter()}
      <Search
        className="sales-report-search"
        placeholder="Search product"
        allowClear
        value={filters.keyword}
        onChange={event => {
          const keyword = event.target.value;
          setFilters(prev => ({ ...prev, keyword }));
          clearTimeout(timerRef.current);
          timerRef.current = setTimeout(() => applyFilters({ keyword, offset: 0 }), 500);
        }}
      />
    </div>
  );

  const renderPerformanceToolbar = () => (
    <div className="sales-report-filter-bar sales-report-tab-toolbar">
      {renderDateRangeFilter()}
      {renderLocationFilter()}
      <Select className="sales-report-target-filter" value={filters.targetType} onChange={value => applyFilters({ targetType: value })}>
        {["DAILY", "WEEKLY", "MONTHLY"].map(value => <Option key={value} value={value}>{value}</Option>)}
      </Select>
    </div>
  );

  if (isHasAccessPermission === false) return <NoPermissionV2 />;

  return (
    <div id="sales-report" className="sales-report-page">
      <div className="sales-report-header">
        <PageHeader
          title="Sales Report"
          subTitle="Sales summary, trends, products, and performance intelligence"
        />
      </div>
      {error && <Alert type="error" message={error} showIcon style={{ marginBottom: 15 }} />}
      <Row gutter={16}>{statistics.map(item => <ReportStatisticCard key={item.title} loading={loading} {...item} />)}</Row>
      <Tabs defaultActiveKey="trend" className="sales-report-tabs">
        <TabPane tab="Sales Trend" key="trend">
          {renderTrendToolbar()}
          <Table className="sales-report-table" rowKey={(record, index) => record.id || record.period || record.date || index} size="small" loading={loading} dataSource={trend} columns={trendColumns} pagination={false} scroll={{ x: 920 }} />
        </TabPane>
        <TabPane tab="Best Items" key="products">
          {renderProductsToolbar()}
          <Table
            className="sales-report-table"
            rowKey={(record, index) => record.id || record.productVariantId || record.productId || record.sku || index}
            size="small"
            loading={loading}
            dataSource={products}
            columns={productColumns}
            scroll={{ x: 1100 }}
            pagination={{
              current: Math.floor(filters.offset / filters.limit) + 1,
              pageSize: filters.limit,
              total: productsTotal,
              showSizeChanger: true,
              showTotal: total => `Total ${total} items`
            }}
            onChange={(pagination, tableFilters, sorter) => applyFilters({
              limit: pagination.pageSize,
              offset: (pagination.current - 1) * pagination.pageSize,
              sortBy: sorter && sorter.field ? sorter.field : filters.sortBy,
              sortDirection: sorter && sorter.order === "ascend" ? "ASC" : "DESC"
            })}
          />
        </TabPane>
        <TabPane tab="Business Performance" key="performance">
          {renderPerformanceToolbar()}
          <div className="sales-performance-dashboard">
            <div className="sales-performance-heading">
              <div>
                <h3>Business Performance</h3>
                <p>{periodTitle}</p>
              </div>
              <span>{periodDescription}</span>
            </div>

            <Row gutter={16} className="sales-performance-kpis">
              {performanceKpis.map(item => {
                const KpiIcon = item.icon;
                return (
                  <Col xs={24} sm={12} lg={6} key={item.title} className="sales-performance-kpi-col">
                    <div className={`sales-performance-card sales-performance-kpi-card ${item.variant}`}>
                      <div className="sales-performance-card-header">
                        <div>
                          <p>{item.title}</p>
                          <h4>{item.value}</h4>
                        </div>
                        <span className="sales-performance-card-icon">
                          <KpiIcon size={18} />
                        </span>
                      </div>
                      <span className="sales-performance-helper">{item.helper}</span>
                      <div className="sales-performance-kpi-footer">
                        {item.progress !== null && item.progress !== undefined && <Progress percent={item.progress} showInfo={false} strokeColor="#6c4cff" trailColor="#ebe7f5" />}
                        {item.footer && <strong className="sales-performance-footer">{item.footer}</strong>}
                      </div>
                    </div>
                  </Col>
                );
              })}
            </Row>

            <Row gutter={16}>
              <Col xs={24} lg={12}>
                <div className="sales-performance-card sales-performance-goal-card">
                  <div className="sales-performance-section-header">
                    <div>
                      <p>Sales Goal</p>
                      <h4>{getRoundedPercentOrEmpty(achievementPercent)} reached</h4>
                    </div>
                    <span className={`sales-performance-badge ${targetStatusClassName}`}>
                      <StatusIcon size={14} />
                      {targetStatusLabel}
                    </span>
                  </div>
                  {hasSalesTarget ? (
                    <>
                      <Progress percent={progressPercent} showInfo={false} strokeColor="#6c4cff" trailColor="#ebe7f5" />
                      <p className="sales-performance-copy">You've reached {getPercentOrEmpty(achievementPercent)} of your monthly sales target.</p>
                      <div className="sales-performance-list">
                        {salesGoalRows.map(row => (
                          <div className="sales-performance-list-row" key={row.label}>
                            <span>{row.label}</span>
                            <strong>{row.value}</strong>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <p className="sales-performance-copy">No sales target has been set for this period.</p>
                  )}
                </div>
              </Col>
              <Col xs={24} lg={12}>
                <div className="sales-performance-card">
                  <div className="sales-performance-section-header">
                    <div>
                      <p>Where Your Sales Went</p>
                      <h4>Profit Breakdown</h4>
                    </div>
                    <span className="sales-performance-card-icon">
                      <CircleDollarSign size={18} />
                    </span>
                  </div>
                  <div className="sales-performance-list is-breakdown">
                    {breakdownRows.map(row => {
                      const BreakdownIcon = row.icon;
                      return (
                        <div className={`sales-performance-list-row ${row.variant} ${row.highlight ? "is-highlight" : ""}`} key={row.label}>
                          <span>
                            <i className="sales-performance-row-icon"><BreakdownIcon size={14} /></i>
                            {row.label}
                          </span>
                          <strong>{row.value}</strong>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Col>
            </Row>

            <div className="sales-performance-card sales-performance-summary-card">
              <div className="sales-performance-section-header">
                <div>
                  <p>Business Summary</p>
                  <h4>Quick Insight</h4>
                </div>
              </div>
              {businessSummary.map(text => <p className="sales-performance-copy" key={text}>{text}</p>)}
            </div>

            <div className="sales-performance-details">
              <Button className="sales-performance-details-button" type="link" onClick={() => setIsPerformanceDetailsVisible(!isPerformanceDetailsVisible)}>
                {isPerformanceDetailsVisible ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                View details
              </Button>
              {isPerformanceDetailsVisible && (
                <Table
                  className="sales-report-table"
                  rowKey="metric"
                  size="small"
                  pagination={false}
                  loading={loading}
                  dataSource={performanceRows}
                  columns={performanceColumns}
                />
              )}
            </div>
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
}
