import React from "react";
import { Alert, PageHeader, Tabs } from "antd";
import moment from "moment";
import history from "../../../../common/router/history";
import LocationService from "@services/LocationService";
import SupplierService from "@services/VendorService";
import PurchaseService from "../../../services/report/PurchaseService";
import { getPurchaseReportOptions } from "./purchaseReportOptions";
import { initialFilters, pathName, rowsOf, sections, unwrap } from "./purchaseReportConfig";
import {
  ActivitySummary,
  CostComparisonReference,
  ReportFilters,
  ReportTable,
  SummaryCards
} from "./PurchaseReportParts";
import CostChangesReport from "./CostChangesReport";
import StockRiskReport from "./StockRiskReport";
import "../Item/index.css";
import "./index.css";
import "./costChanges.css";
import "./stockRisk.css";

const { TabPane } = Tabs;
const reportTabClasses = { priceIncrease: "cost-changes-tab", overstock: "stock-risk-tab" };

export default function PurchaseReport() {
  const [filters, setFilters] = React.useState(initialFilters);
  const [activeTab, setActiveTab] = React.useState("trend");
  const [locations, setLocations] = React.useState([]);
  const [suppliers, setSuppliers] = React.useState([]);
  const [summary, setSummary] = React.useState({ data: {}, loading: true, error: "" });
  const [reports, setReports] = React.useState({});
  const [pages, setPages] = React.useState({});
  const [reload, setReload] = React.useState(0);
  const requestId = React.useRef(0);

  React.useEffect(() => {
    let mounted = true;

    LocationService.get({ limit: 500 })
      .then(response => {
        if (mounted && response.data && Array.isArray(response.data.data)) {
          setLocations(response.data.data);
        }
      })
      .catch(() => {});

    SupplierService.get({ limit: 100 })
      .then(response => {
        if (mounted && response.data && Array.isArray(response.data.data)) {
          setSuppliers(response.data.data);
        }
      })
      .catch(() => {});

    return () => { mounted = false; };
  }, []);

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
  const hasDedicatedReport = activeTab === "priceIncrease" || activeTab === "overstock";

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
              <div className={reportTabClasses[key] || ""}>
                <ReportFilters
                  activeTab={activeTab}
                  filters={filters}
                  locations={locations}
                  suppliers={suppliers}
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

                {report.error && !hasDedicatedReport && (
                  <Alert
                    type="error"
                    showIcon
                    message={report.error}
                    className="purchase-report-error"
                  />
                )}

                {activeTab === "purchaseVsSales" && (
                  <ActivitySummary summary={report.summary} />
                )}

                {activeTab === "priceIncrease" ? (
                  <CostChangesReport report={report} filters={filters} onRefresh={refresh} />
                ) : activeTab === "overstock" ? (
                  <StockRiskReport report={report} filters={filters} onRefresh={refresh} />
                ) : (
                  <ReportTable
                    section={section}
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
