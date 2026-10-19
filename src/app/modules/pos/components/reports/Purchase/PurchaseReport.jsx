import React from "react";
import { Alert, PageHeader, Tabs } from "antd";
import moment from "moment";
import history from "../../../../common/router/history";
import PurchaseService from "../../../services/report/PurchaseService";
import { getPurchaseReportOptions } from "./purchaseReportOptions";
import { initialFilters, pathName, rowsOf, sections, unwrap } from "./purchaseReportConfig";
import {
  CostComparisonReference,
  ReportFilters,
  ReportTable,
  SummaryCards
} from "./PurchaseReportParts";
import CostChangesReport from "./CostChangesReport";
import StockRiskReport from "./StockRiskReport";
import PurchaseSalesReport from "./PurchaseSalesReport";
import "../Item/index.css";
import "./index.css";
import "./costChanges.css";
import "./stockRisk.css";
import "./purchaseSales.css";

const { TabPane } = Tabs;
const reportTabClasses = {
  priceIncrease: "cost-changes-tab",
  overstock: "stock-risk-tab",
  purchaseVsSales: "purchase-sales-tab"
};
const dedicatedReports = {
  priceIncrease: CostChangesReport,
  overstock: StockRiskReport,
  purchaseVsSales: PurchaseSalesReport
};

export default function PurchaseReport() {
  const [filters, setFilters] = React.useState(initialFilters);
  const [activeTab, setActiveTab] = React.useState("trend");
  const [summary, setSummary] = React.useState({ data: {}, loading: true, error: "" });
  const [reports, setReports] = React.useState({});
  const [pages, setPages] = React.useState({});
  const [reload, setReload] = React.useState(0);
  const requestId = React.useRef(0);

  React.useEffect(() => {
    const id = ++requestId.current;
    const config = sections[activeTab];
    const { summaryOption, sectionOption } = getPurchaseReportOptions(filters, activeTab);

    setSummary(previous => ({ ...previous, loading: true, error: "" }));
    setReports(previous => ({
      ...previous,
      [activeTab]: {
        rows: previous[activeTab] ? previous[activeTab].rows || [] : [],
        summary: previous[activeTab] ? previous[activeTab].summary || {} : {},
        period: previous[activeTab] ? previous[activeTab].period || null : null,
        loading: true,
        error: ""
      }
    }));

    PurchaseService.getPurchaseSummary(summaryOption)
      .then(response => {
        if (id !== requestId.current) return;
        setSummary({ data: unwrap(response), loading: false, error: "" });
      })
      .catch(() => {
        if (id !== requestId.current) return;
        setSummary(previous => ({
          ...previous,
          loading: false,
          error: "Unable to load purchase summary."
        }));
      });

    config.fetch(sectionOption)
      .then(response => {
        if (id !== requestId.current) return;

        const payload = unwrap(response);
        setReports(previous => ({
          ...previous,
          [activeTab]: {
            rows: rowsOf(payload),
            summary: payload.summary || {},
            period: payload.period || null,
            loading: false,
            error: ""
          }
        }));
      })
      .catch(() => {
        if (id !== requestId.current) return;
        setReports(previous => ({
          ...previous,
          [activeTab]: {
            rows: [],
            summary: {},
            period: null,
            loading: false,
            error: `Unable to load ${config.label.toLowerCase()}. Please try again.`
          }
        }));
      });

    return () => {
      requestId.current += 1;
    };
  }, [filters, activeTab, reload]);

  const applyFilters = changes => {
    const nextFilters = { ...filters, ...changes };
    if (moment(nextFilters.fromDate).isAfter(moment(nextFilters.toDate))) return;

    const params = new URLSearchParams();
    Object.keys(nextFilters).forEach(key => {
      if (nextFilters[key] !== "") params.set(key, nextFilters[key]);
    });

    setPages({});
    setFilters(nextFilters);
    history.push({
      pathname: document.location.pathname || pathName,
      search: `?${params.toString()}`
    });
  };

  const report = reports[activeTab] || {
    rows: [],
    summary: {},
    period: null,
    loading: false,
    error: ""
  };
  const section = sections[activeTab];
  const showPurchaseSummary = ["products", "suppliers"].includes(activeTab);
  const DedicatedReport = dedicatedReports[activeTab];

  const refresh = () => setReload(value => value + 1);
  const changePage = page => setPages(previous => ({ ...previous, [activeTab]: page }));

  return (
    <div id="purchase-report" className="purchase-report-page">
      <div className="purchase-report-header">
        <PageHeader
          title="Purchase Report"
          subTitle="Understand purchasing spend, suppliers, and inventory demand"
        />
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab} className="purchase-report-tabs">
        {Object.keys(sections).map(key => (
          <TabPane
            tab={sections[key].label}
            key={key}
          >
            {key === activeTab && (
              <div className={reportTabClasses[key] || "purchase-overview-tab"}>
                <ReportFilters
                  activeTab={activeTab}
                  filters={filters}
                  loading={report.loading || (showPurchaseSummary && summary.loading)}
                  onChange={applyFilters}
                  onRefresh={refresh}
                />

                {showPurchaseSummary && (
                  <>
                    {summary.error && (
                      <Alert
                        type="error"
                        showIcon
                        message={summary.error}
                        className="purchase-report-error"
                      />
                    )}
                    <SummaryCards summary={summary} />
                  </>
                )}

                <div className="purchase-report-section-heading">
                  <div className="purchase-report-section-title">
                    <h2>{section.label}</h2>
                    {activeTab === "priceIncrease" && (
                      <CostComparisonReference period={report.period} loading={report.loading} />
                    )}
                  </div>
                  <p>{section.description}</p>
                </div>

                {report.error && !DedicatedReport && (
                  <Alert
                    type="error"
                    showIcon
                    message={report.error}
                    className="purchase-report-error"
                  />
                )}

                {DedicatedReport ? (
                  <DedicatedReport report={report} filters={filters} onRefresh={refresh} />
                ) : (
                  <ReportTable
                    key={activeTab}
                    section={section}
                    filters={filters}
                    report={report}
                    page={pages[activeTab] || 1}
                    loading={report.loading}
                    onPageChange={changePage}
                  />
                )}
              </div>
            )}
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
}
