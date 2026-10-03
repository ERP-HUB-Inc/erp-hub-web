import React from "react";
import {
  Alert,
  Card,
  Col,
  DatePicker,
  Icon,
  InputNumber,
  PageHeader,
  Row,
  Select,
  Statistic,
  Table,
  Tabs
} from "antd";
import moment from "moment";
import history from "../../../../common/router/history";
import Util from "../../../../common/util";
import NoPermissionV2 from "../../../../common/components/shares/List/NoPermissionV2";
import LocationService from "@services/LocationService";
import SupplierService from "../../../../inventory/services/stock/SupplierService";
import PrivilegeService from "../../../services/settings/PrivilegeService";
import PurchaseService from "../../../services/report/PurchaseService";
import "../Item/index.css";

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;

const permission_module_code = "report";
const permission_code = "purchase_report";
const util = new Util();
const pathName = "/reports/purchase-report";

const getNumber = value => Number(value || 0);
const getMoney = value => util.formatCurrency(getNumber(value));
const getQuantity = value => getNumber(value).toLocaleString();
const getPercent = value => `${getNumber(value).toFixed(2)}%`;
const getEmpty = value => (value === null || value === undefined || value === "" ? "-" : value);
const getPayload = response => response && response.data && response.data.data ? response.data.data : response && response.data ? response.data : {};
const getArray = payload => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.items)) return payload.items;
  if (Array.isArray(payload.products)) return payload.products;
  if (Array.isArray(payload.suppliers)) return payload.suppliers;
  if (Array.isArray(payload.trend)) return payload.trend;
  return [];
};

function ReportStatisticCard({ icon, iconClassName, title, value, valueStyle, loading }) {
  return (
    <Col xs={24} sm={12} md={8} lg={4} className="product-report-stat-col">
      <Card loading={loading} className="product-report-stat-card" bodyStyle={{ padding: 16 }}>
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

export default function PurchaseReport() {
  const params = new URLSearchParams(document.location.search);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [locations, setLocations] = React.useState([]);
  const [suppliers, setSuppliers] = React.useState([]);
  const [isHasAccessPermission, setIsHasAccessPermission] = React.useState(null);
  const [filters, setFilters] = React.useState({
    fromDate: params.get("fromDate") || moment().startOf("month").format("YYYY-MM-DD"),
    toDate: params.get("toDate") || moment().endOf("month").format("YYYY-MM-DD"),
    locationId: params.get("locationId") || "",
    supplierId: params.get("supplierId") || "",
    minChangePercent: Number(params.get("minChangePercent")) || 5,
    thresholdDays: Number(params.get("thresholdDays")) || 30
  });
  const [summary, setSummary] = React.useState({});
  const [trend, setTrend] = React.useState([]);
  const [products, setProducts] = React.useState([]);
  const [supplierRows, setSupplierRows] = React.useState([]);
  const [priceIncrease, setPriceIncrease] = React.useState([]);
  const [overstock, setOverstock] = React.useState([]);
  const [purchaseVsSales, setPurchaseVsSales] = React.useState([]);

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
      locationId: nextFilters.locationId,
      supplierId: nextFilters.supplierId
    });
    const locationOnlyOption = cleanParams({
      fromDate: nextFilters.fromDate,
      toDate: nextFilters.toDate,
      locationId: nextFilters.locationId
    });

    setLoading(true);
    setError("");

    Promise.all([
      PurchaseService.getPurchaseSummary(commonOption),
      PurchaseService.getPurchaseTrend(commonOption),
      PurchaseService.getPurchaseProducts(commonOption),
      PurchaseService.getPurchaseSuppliers(locationOnlyOption),
      PurchaseService.getPurchasePriceIncrease({ ...commonOption, minChangePercent: nextFilters.minChangePercent }),
      PurchaseService.getPurchaseOverstock({ ...commonOption, thresholdDays: nextFilters.thresholdDays }),
      PurchaseService.getPurchaseVsSales(commonOption)
    ])
      .then(([summaryResponse, trendResponse, productsResponse, suppliersResponse, priceIncreaseResponse, overstockResponse, purchaseVsSalesResponse]) => {
        setSummary(getPayload(summaryResponse));
        setTrend(getArray(getPayload(trendResponse)));
        setProducts(getArray(getPayload(productsResponse)));
        setSupplierRows(getArray(getPayload(suppliersResponse)));
        setPriceIncrease(getArray(getPayload(priceIncreaseResponse)));
        setOverstock(getArray(getPayload(overstockResponse)));
        setPurchaseVsSales(getArray(getPayload(purchaseVsSalesResponse)));
      })
      .catch(() => setError("Unable to load purchase report. Please try again."))
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

    SupplierService.lists(500, 0).then(response => {
      if (response && response.data && Array.isArray(response.data.data)) setSuppliers(response.data.data);
    });

    updateURL(filters);
    // eslint-disable-next-line
  }, []);

  const statistics = [
    { title: "Purchase Total", value: getMoney(summary.totalPurchase || summary.purchaseTotal || summary.totalAmount), icon: "shopping-cart", iconClassName: "is-blue" },
    { title: "Orders", value: getQuantity(summary.totalOrders || summary.orderCount || summary.purchaseCount), icon: "profile", iconClassName: "is-green" },
    { title: "Products", value: getQuantity(summary.totalProducts || summary.productCount), icon: "inbox", iconClassName: "is-purple" },
    { title: "Quantity", value: getQuantity(summary.totalQuantity || summary.quantity), icon: "database", iconClassName: "is-teal" },
    { title: "Suppliers", value: getQuantity(summary.totalSuppliers || summary.supplierCount), icon: "team", iconClassName: "is-orange" },
    { title: "Avg Cost", value: getMoney(summary.averageCost || summary.avgCost), icon: "line-chart", iconClassName: "is-red" }
  ];

  const productColumns = [
    { title: "Product", dataIndex: "productName", key: "productName", render: (value, record) => getEmpty(value || record.itemName || record.name) },
    { title: "SKU", dataIndex: "sku", key: "sku", width: 130, render: getEmpty },
    { title: "Supplier", dataIndex: "supplierName", key: "supplierName", render: getEmpty },
    { title: "Qty", dataIndex: "quantity", key: "quantity", width: 110, align: "right", render: value => getQuantity(value) },
    { title: "Unit Cost", dataIndex: "unitCost", key: "unitCost", width: 130, align: "right", render: value => getMoney(value) },
    { title: "Total", dataIndex: "totalAmount", key: "totalAmount", width: 140, align: "right", render: value => getMoney(value) }
  ];

  const supplierColumns = [
    { title: "Supplier", dataIndex: "supplierName", key: "supplierName", render: (value, record) => getEmpty(value || record.name) },
    { title: "Orders", dataIndex: "orderCount", key: "orderCount", align: "right", render: value => getQuantity(value) },
    { title: "Products", dataIndex: "productCount", key: "productCount", align: "right", render: value => getQuantity(value) },
    { title: "Quantity", dataIndex: "quantity", key: "quantity", align: "right", render: value => getQuantity(value) },
    { title: "Total", dataIndex: "totalAmount", key: "totalAmount", align: "right", render: value => getMoney(value) }
  ];

  const trendColumns = [
    { title: "Period", dataIndex: "period", key: "period", render: (value, record) => getEmpty(value || record.date || record.label) },
    { title: "Purchase", dataIndex: "totalAmount", key: "totalAmount", align: "right", render: value => getMoney(value) },
    { title: "Orders", dataIndex: "orderCount", key: "orderCount", align: "right", render: value => getQuantity(value) },
    { title: "Quantity", dataIndex: "quantity", key: "quantity", align: "right", render: value => getQuantity(value) }
  ];

  const intelligenceColumns = [
    { title: "Product", dataIndex: "productName", key: "productName", render: (value, record) => getEmpty(value || record.itemName || record.name) },
    { title: "Supplier", dataIndex: "supplierName", key: "supplierName", render: getEmpty },
    { title: "Current Cost", dataIndex: "currentCost", key: "currentCost", align: "right", render: value => getMoney(value) },
    { title: "Previous Cost", dataIndex: "previousCost", key: "previousCost", align: "right", render: value => getMoney(value) },
    { title: "Change", dataIndex: "changePercent", key: "changePercent", align: "right", render: value => value === null || value === undefined ? "-" : getPercent(value) }
  ];

  if (isHasAccessPermission === false) return <NoPermissionV2 />;

  return (
    <div id="purchase-report" style={{ padding: 20 }}>
      <PageHeader
        style={{ paddingLeft: 0, paddingRight: 0 }}
        onBack={() => history.push("/reports/purchase_dashboard")}
        title="Purchase Report"
        subTitle="Purchase summary, suppliers, products, and purchasing intelligence"
      />
      {error && <Alert type="error" message={error} showIcon style={{ marginBottom: 15 }} />}
      <Row gutter={16}>{statistics.map(item => <ReportStatisticCard key={item.title} loading={loading} {...item} />)}</Row>
      <Row type="flex" align="middle" style={{ marginTop: 4, marginBottom: 15 }}>
        <Col>
          <RangePicker
            allowClear={false}
            format="DD/MM/YYYY"
            value={[moment(filters.fromDate), moment(filters.toDate)]}
            onChange={values => applyFilters({ fromDate: values[0].format("YYYY-MM-DD"), toDate: values[1].format("YYYY-MM-DD") })}
          />
          <Select style={{ width: 180, marginLeft: 10 }} value={filters.locationId} onChange={value => applyFilters({ locationId: value })}>
            {[{ id: "", name: "All stores" }].concat(locations).map(location => <Option key={location.id} value={location.id}>{location.name}</Option>)}
          </Select>
          <Select style={{ width: 200, marginLeft: 10 }} value={filters.supplierId} onChange={value => applyFilters({ supplierId: value })}>
            {[{ id: "", name: "All suppliers" }].concat(suppliers).map(supplier => <Option key={supplier.id} value={supplier.id}>{supplier.name}</Option>)}
          </Select>
          <InputNumber min={0} style={{ width: 150, marginLeft: 10 }} value={filters.minChangePercent} formatter={value => `${value}%`} parser={value => value.replace("%", "")} onChange={value => applyFilters({ minChangePercent: value || 0 })} />
          <InputNumber min={0} style={{ width: 150, marginLeft: 10 }} value={filters.thresholdDays} formatter={value => `${value} days`} parser={value => value.replace(" days", "")} onChange={value => applyFilters({ thresholdDays: value || 0 })} />
        </Col>
      </Row>
      <Tabs defaultActiveKey="trend">
        <TabPane tab="Trend" key="trend">
          <Table rowKey={(record, index) => record.id || record.period || record.date || index} bordered size="small" loading={loading} dataSource={trend} columns={trendColumns} pagination={false} />
        </TabPane>
        <TabPane tab="Products" key="products">
          <Table rowKey={(record, index) => record.id || record.productVariantId || record.productId || record.sku || index} bordered size="small" loading={loading} dataSource={products} columns={productColumns} />
        </TabPane>
        <TabPane tab="Suppliers" key="suppliers">
          <Table rowKey={(record, index) => record.id || record.supplierId || record.supplierName || index} bordered size="small" loading={loading} dataSource={supplierRows} columns={supplierColumns} />
        </TabPane>
        <TabPane tab="Price Increase" key="priceIncrease">
          <Table rowKey={(record, index) => record.id || record.productVariantId || record.productId || index} bordered size="small" loading={loading} dataSource={priceIncrease} columns={intelligenceColumns} />
        </TabPane>
        <TabPane tab="Overstock" key="overstock">
          <Table
            rowKey={(record, index) => record.id || record.productVariantId || record.productId || index}
            bordered
            size="small"
            loading={loading}
            dataSource={overstock}
            columns={[
              { title: "Product", dataIndex: "productName", key: "productName", render: (value, record) => getEmpty(value || record.itemName || record.name) },
              { title: "Supplier", dataIndex: "supplierName", key: "supplierName", render: getEmpty },
              { title: "Stock", dataIndex: "quantityOnHand", key: "quantityOnHand", align: "right", render: value => getQuantity(value) },
              { title: "Days", dataIndex: "stockDays", key: "stockDays", align: "right", render: value => getQuantity(value) },
              { title: "Value", dataIndex: "stockValue", key: "stockValue", align: "right", render: value => getMoney(value) }
            ]}
          />
        </TabPane>
        <TabPane tab="Purchase vs Sales" key="purchaseVsSales">
          <Table
            rowKey={(record, index) => record.id || record.productVariantId || record.productId || index}
            bordered
            size="small"
            loading={loading}
            dataSource={purchaseVsSales}
            columns={[
              { title: "Product", dataIndex: "productName", key: "productName", render: (value, record) => getEmpty(value || record.itemName || record.name) },
              { title: "Purchased", dataIndex: "purchaseQuantity", key: "purchaseQuantity", align: "right", render: value => getQuantity(value) },
              { title: "Sold", dataIndex: "salesQuantity", key: "salesQuantity", align: "right", render: value => getQuantity(value) },
              { title: "Purchase Amount", dataIndex: "purchaseAmount", key: "purchaseAmount", align: "right", render: value => getMoney(value) },
              { title: "Sales Revenue", dataIndex: "salesRevenue", key: "salesRevenue", align: "right", render: value => getMoney(value) }
            ]}
          />
        </TabPane>
      </Tabs>
    </div>
  );
}
