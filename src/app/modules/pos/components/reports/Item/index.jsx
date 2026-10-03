import React, { useRef } from "react";
import {
  Statistic,
  PageHeader,
  Table,
  Select,
  Card,
  Row,
  Col,
  Input,
  Button,
  Drawer,
  Icon,
  Tag,
  Tabs
} from "antd";
import { Translate } from "react-localize-redux";
import history from "../../../../common/router/history";
import Util from "../../../../common/util";
import LocationService from "@services/LocationService";
import ProductService from "../../../services/report/ProductService";
import CategoryService from "@services/CategoryService";
import BrandService from "@services/BrandService";
import PrivilegeService from "../../../services/settings/PrivilegeService";
import "./index.css";

const { Option } = Select;
const { Search } = Input;
const { TabPane } = Tabs;

const permission_module_code = "report";
const permission_code = "product_report";
const util = new Util();
const pathName = "/reports/product";
const defaultFilters = {
  keyword: "",
  locationId: "",
  categoryId: "",
  brandId: "",
  status: "",
  needsAttention: "",
  lowStock: "",
  pricing: "",
  profitable: "",
  loss: "",
  page: 1,
  limit: 20,
  sortBy: "",
  sortOrder: ""
};

const inventoryStatusLabels = {
  HEALTHY: "Healthy",
  LOW_STOCK: "Low Stock",
  OUT_OF_STOCK: "Out of Stock",
  OVERSTOCK: "Overstock"
};

const pricingStatusLabels = {
  PROFITABLE: "Profitable",
  BELOW_TARGET_MARGIN: "Below Target Margin",
  SELLING_BELOW_COST: "Selling Below Cost",
  PRICING_OPPORTUNITY: "Pricing Opportunity",
  NO_PRICING_DATA: "No Pricing Data"
};

const quickFilters = [
  { key: "all", label: "All", status: "" },
  { key: "needsAttention", label: "Needs Attention", status: true },
  { key: "lowStock", label: "Low Stock", status: "LOW_STOCK,OUT_OF_STOCK" },
  { key: "pricing", label: "Pricing", status: "BELOW_TARGET_MARGIN,SELLING_BELOW_COST,PRICING_OPPORTUNITY,NO_PRICING_DATA" },
  { key: "profitable", label: "Profitable", status: "PROFITABLE" },
  { key: "loss", label: "Loss", status: "LOSS" }
];
const quickFilterParamKeys = quickFilters.filter(filter => filter.key !== "all").map(filter => filter.key);

const statusOptions = [
  { label: "Healthy", value: "HEALTHY" },
  { label: "Low Stock", value: "LOW_STOCK" },
  { label: "Out of Stock", value: "OUT_OF_STOCK" },
  { label: "Needs Attention", value: "needsAttention" },
  { label: "Profitable", value: "PROFITABLE", key: "pricingStatus" },
  { label: "Below Target Margin", value: "BELOW_TARGET_MARGIN" },
  { label: "Selling Below Cost", value: "SELLING_BELOW_COST" },
  { label: "Pricing Opportunity", value: "PRICING_OPPORTUNITY" },
  { label: "No Pricing Setup", value: "NO_PRICING_DATA" }
];

const getNumber = value => Number(value || 0);
const getQuantity = value => getNumber(value).toLocaleString();
const getMoney = value => util.formatCurrency(getNumber(value));
const getEmpty = value => (value === null || value === undefined || value === "" ? "-" : value);
const getFirstValue = (...values) => values.find(value => value !== null && value !== undefined && value !== "");

const getInitialFilters = () => {
  const params = new URLSearchParams(document.location.search);
  return {
    ...defaultFilters,
    keyword: params.get("keyword") || params.get("search") || "",
    locationId: params.get("locationId") || "",
    categoryId: params.get("categoryId") || "",
    brandId: params.get("brandId") || "",
    status: params.get("status") || "",
    needsAttention: params.get("needsAttention") === "true" ? true : "",
    lowStock: params.get("lowStock") || "",
    pricing: params.get("pricing") || "",
    profitable: params.get("profitable") || "",
    loss: params.get("loss") || "",
    page: Number(params.get("page") || params.get("current")) || defaultFilters.page,
    limit: Number(params.get("limit")) || defaultFilters.limit,
    sortBy: params.get("sortBy") || "",
    sortOrder: params.get("sortOrder") || ""
  };
};

const cleanRequestParams = filters => {
  const option = {};
  Object.keys(filters).forEach(key => {
    if (filters[key] !== "" && filters[key] !== null && filters[key] !== undefined) {
      option[key] = filters[key];
    }
  });
  return option;
};

const normalizeReportResponse = response => {
  const payload = response && response.data ? response.data : {};
  const wrapped = payload.data && !Array.isArray(payload.data) ? payload.data : payload;
  const items = wrapped.items || wrapped.data || payload.items || payload.data || [];
  const pagination = wrapped.pagination || payload.pagination || {};

  return {
    summary: wrapped.summary || payload.summary || {},
    items: Array.isArray(items) ? items : [],
    pagination: {
      page: pagination.page || pagination.current || 1,
      limit: pagination.limit || 20,
      total: pagination.total || 0
    }
  };
};

const getTagColor = status => {
  if (["LOW_STOCK", "BELOW_TARGET_MARGIN", "PRICING_OPPORTUNITY"].includes(status)) {
    return "orange";
  }
  if (["OUT_OF_STOCK", "SELLING_BELOW_COST"].includes(status)) {
    return "red";
  }
  if (["HEALTHY", "PROFITABLE"].includes(status)) {
    return "green";
  }
  return "default";
};

const renderStatusTag = (status, labels) => {
  if (!status) {
    return "-";
  }
  return <Tag color={getTagColor(status)}>{labels[status] || status}</Tag>;
};

const getQuickFilterKey = filters => {
  const found = quickFilters.find(filter => filter.key !== "all" && filters[filter.key] === filter.status);
  return found ? found.key : "all";
};

function DetailRow({ label, children }) {
  return (
    <Row style={{ marginBottom: 12 }}>
      <Col span={10} style={{ color: "#777" }}>{label}</Col>
      <Col span={14}>{children}</Col>
    </Row>
  );
}

function ReportStatisticCard({ icon, iconClassName, title, value, valueStyle, loading }) {
  return (
    <Col xs={24} sm={12} md={8} lg={4} className="product-report-stat-col">
      <Card loading={loading} className="product-report-stat-card" bodyStyle={{ padding: 16 }}>
        <div className="product-report-stat-content">
          <span className={`product-report-stat-icon ${iconClassName}`}>
            <Icon type={icon} />
          </span>
          <Statistic
            title={title}
            value={value}
            valueStyle={valueStyle}
            className="product-report-statistic"
          />
        </div>
      </Card>
    </Col>
  );
}

export default function ReportProduct() {
  const initialFilters = getInitialFilters();
  const [loading, setLoading] = React.useState(false);
  const [filters, setFilters] = React.useState(initialFilters);
  const [quickFilter, setQuickFilter] = React.useState(getQuickFilterKey(initialFilters));
  const [data, setData] = React.useState([]);
  const [summary, setSummary] = React.useState({});
  const [total, setTotal] = React.useState(0);
  const [locations, setLocations] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const [brands, setBrands] = React.useState([]);
  const [selectedProduct, setSelectedProduct] = React.useState(null);
  const [isHasAccessPermission, setIsHasAccessPermission] = React.useState(null);
  const timerRef = useRef(null);

  const updateURL = nextFilters => {
    const params = new URLSearchParams();
    Object.keys(cleanRequestParams(nextFilters)).forEach(key => params.set(key, nextFilters[key]));
    history.push({ pathname: pathName, search: `?${params.toString()}` });
  };

  const fetchReport = nextFilters => {
    setLoading(true);
    ProductService.getInventoryStockReport(cleanRequestParams(nextFilters))
      .then(response => {
        const report = normalizeReportResponse(response);
        setSummary(report.summary);
        setData(report.items);
        setTotal(report.pagination.total);
        setFilters(prev => ({
          ...prev,
          page: report.pagination.page,
          limit: report.pagination.limit
        }));
      })
      .finally(() => setLoading(false));
  };

  const applyFilters = nextValues => {
    const nextFilters = {
      ...filters,
      ...nextValues
    };
    setFilters(nextFilters);
    setQuickFilter(getQuickFilterKey(nextFilters));
    updateURL(nextFilters);
    fetchReport(nextFilters);
  };

  const onChangeSearch = event => {
    const keyword = event.target.value;
    setFilters(prev => ({ ...prev, keyword }));
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      applyFilters({ keyword, page: 1 });
    }, 500);
  };

  const onChangeFilter = (key, value) => {
    applyFilters({ [key]: value, page: 1 });
  };

  const onChangeQuickFilter = key => {
    const found = quickFilters.find(filter => filter.key === key) || quickFilters[0];
    const nextFilters = quickFilterParamKeys.reduce((values, filterKey) => ({
      ...values,
      [filterKey]: ""
    }), {});
    setQuickFilter(key);
    applyFilters({
      ...nextFilters,
      ...(found.key === "all" ? {} : { [found.key]: found.status }),
      page: 1
    });
  };

  const onChangeTable = (pagination, tableFilters, sorter) => {
    const nextSortBy = sorter && sorter.field ? sorter.field : filters.sortBy;
    const nextSortOrder = sorter && sorter.order ? (sorter.order === "ascend" ? "ASC" : "DESC") : filters.sortOrder;

    applyFilters({
      page: pagination.current,
      limit: pagination.pageSize,
      sortBy: nextSortBy,
      sortOrder: nextSortOrder
    });
  };

  React.useEffect(() => {
    PrivilegeService.checkPermission(permission_module_code, permission_code)
      .then(({ data }) => {
        setIsHasAccessPermission(data);
        if (data) {
          fetchReport(initialFilters);
        }
      })
      .catch(() => setIsHasAccessPermission(false));

    LocationService.get({ limit: 500 })
      .then(response => {
        if (response.data && response.data.data) {
          setLocations(response.data.data);
        }
      });

    CategoryService.get({ limit: 500 })
      .then(response => {
        if (response.data && response.data.data) {
          setCategories(response.data.data);
        }
      });

    BrandService.get({ limit: 500 })
      .then(response => {
        if (response.data && response.data.data) {
          setBrands(response.data.data);
        }
      });

    return () => clearTimeout(timerRef.current);
    //eslint-disable-next-line
  }, []);

  const sortedInfo = {
    field: filters.sortBy,
    order: filters.sortOrder === "ASC" ? "ascend" : filters.sortOrder === "DESC" ? "descend" : undefined
  };
  const selectedStatusValue = statusOptions.some(option => option.value === filters.status) ? filters.status : "";
  const statistics = [
    {
      title: "Total Products",
      value: getQuantity(summary.totalProducts),
      icon: "inbox",
      iconClassName: "is-blue"
    },
    {
      title: "Inventory Cost",
      value: getMoney(summary.inventoryCost),
      icon: "wallet",
      iconClassName: "is-green"
    },
    {
      title: "Sales Value",
      value: getMoney(summary.salesValue),
      icon: "shopping-cart",
      iconClassName: "is-purple"
    },
    {
      title: "Expected Profit",
      value: getMoney(summary.expectedProfit),
      icon: "rise",
      iconClassName: "is-teal",
      valueStyle: { color: "#3f8600" }
    },
    {
      title: "Low Stock",
      value: getQuantity(summary.lowStock),
      icon: "warning",
      iconClassName: "is-orange"
    },
    {
      title: "Pricing Issues",
      value: getQuantity(summary.pricingIssues),
      icon: "tags",
      iconClassName: "is-red"
    }
  ];

  const columns = [
    {
      title: "Item Name",
      dataIndex: "itemName",
      key: "itemName",
      sorter: true,
      sortOrder: sortedInfo.field === "itemName" && sortedInfo.order,
      render: (itemName, record) => (
        `${record.productName}${record.variantName ? " - " + record.variantName : ""}`
        // getEmpty(itemName)
      )
    },
    {
      title: "SKU",
      dataIndex: "sku",
      key: "sku",
      width: 140,
      render: getEmpty
    },
    {
      title: "Unit Cost",
      dataIndex: "unitCost",
      key: "unitCost",
      width: 130,
      align: "right",
      sorter: true,
      sortOrder: sortedInfo.field === "unitCost" && sortedInfo.order,
      render: getMoney
    },
    {
      title: "Unit Price",
      dataIndex: "salesPrice",
      key: "salesPrice",
      width: 130,
      align: "right",
      sorter: true,
      sortOrder: sortedInfo.field === "salesPrice" && sortedInfo.order,
      render: getMoney
    },
    {
      title: "Market",
      dataIndex: "marketPrice",
      key: "marketPrice",
      width: 130,
      align: "right",
      sorter: true,
      sortOrder: sortedInfo.field === "marketPrice" && sortedInfo.order,
      render: marketPrice => marketPrice === null || marketPrice === undefined || marketPrice === "" ? "-" : getMoney(marketPrice)
    },
    {
      title: "Margin",
      dataIndex: "marginPercent",
      key: "marginPercent",
      width: 120,
      align: "right",
      sorter: true,
      sortOrder: sortedInfo.field === "marginPercent" && sortedInfo.order,
      render: (marginPercent, record) => (
        <span style={{ color: record.pricingStatus === "SELLING_BELOW_COST" ? "#cf1322" : record.pricingStatus === "BELOW_TARGET_MARGIN" ? "#fa8c16" : undefined }}>
          {marginPercent === null || marginPercent === undefined ? "-" : `${getNumber(marginPercent).toFixed(1)}%`}
        </span>
      )
    },
    {
      title: "Stock",
      dataIndex: "quantityOnHand",
      key: "quantityOnHand",
      width: 130,
      align: "right",
      sorter: true,
      sortOrder: sortedInfo.field === "quantityOnHand" && sortedInfo.order,
      render: quantityOnHand => getQuantity(quantityOnHand)
    },
    {
      title: "Stock Age",
      dataIndex: "stockAge",
      key: "stockAge",
      width: 130,
      align: "right",
      sorter: true,
      sortOrder: sortedInfo.field === "stockAge" && sortedInfo.order,
      render: (stockAge) => {
        if (stockAge == null) return "-";

        if (stockAge < 30) {
          return `${stockAge}d`;
        }

        if (stockAge < 365) {
          return `${(stockAge / 30).toFixed(1)}mo`;
        }

        return `${(stockAge / 365).toFixed(1)}yr`;
      }
    },
    // {
    //   title: <Translate id="text_action" />,
    //   key: "action",
    //   width: 110,
    //   align: "center",
    //   render: (text, record) => (
    //     <Button size="small" onClick={() => setSelectedProduct(record)}>
    //       View
    //     </Button>
    //   )
    // }
  ];

  return (
    <React.Fragment>
      <div id="product-report" style={{ padding: 20 }}>
        <PageHeader
          style={{
            paddingLeft: 0,
            paddingRight: 0,
          }}
          backIcon={""}
          title={<Translate id="text_product_report" />}
          subTitle="Inventory and pricing insights"
        />
        <Row gutter={16}>
          {statistics.map(statistic => (
            <ReportStatisticCard
              key={statistic.title}
              loading={loading}
              {...statistic}
            />
          ))}
          <Col span={24}>
            <Row type="flex" justify="space-between" align="middle" style={{ marginTop: 15, marginBottom: 15 }}>
              <Col style={{ display: "none" }}>
                <Tabs activeKey={quickFilter} onChange={onChangeQuickFilter} type="card">
                  {quickFilters.map(filter => (
                    <TabPane tab={filter.label} key={filter.key} />
                  ))}
                </Tabs>
              </Col>
              <Col>
                <Search
                  placeholder="Search item, SKU or barcode"
                  onChange={onChangeSearch}
                  style={{ width: 260 }}
                  allowClear={true}
                  value={filters.keyword}
                />
                <Select
                  name="locationId"
                  style={{ width: 170, marginLeft: 10 }}
                  value={filters.locationId}
                  onChange={value => onChangeFilter("locationId", value)}
                >
                  {[{ name: <Translate id="text_all_store" />, id: "" }].concat(locations).map((value, key) => (
                    <Option key={key} value={value.id}>
                      {value.name}
                    </Option>
                  ))}
                </Select>
                <Select
                  name="categoryId"
                  style={{ width: 170, marginLeft: 10 }}
                  value={filters.categoryId}
                  onChange={value => onChangeFilter("categoryId", value)}
                >
                  {[{ name: <Translate id="text_all_category" />, id: "" }].concat(categories).map((value, key) => (
                    <Option key={key} value={value.id}>
                      {value.name}
                    </Option>
                  ))}
                </Select>
                <Select
                  name="brandId"
                  style={{ width: 170, marginLeft: 10 }}
                  value={filters.brandId}
                  onChange={value => onChangeFilter("brandId", value)}
                >
                  {[{ name: <Translate id="text_all_brand" />, id: "" }].concat(brands).map((value, key) => (
                    <Option key={key} value={value.id}>
                      {value.name}
                    </Option>
                  ))}
                </Select>
                <Select
                  name="status"
                  style={{ width: 190, marginLeft: 10 }}
                  value={selectedStatusValue}
                  onChange={value => onChangeFilter("status", value)}
                >
                  {[{ label: "All status", value: "" }].concat(statusOptions).map((value, key) => (
                    <Option key={key} value={value.value}>
                      {value.label}
                    </Option>
                  ))}
                </Select>
              </Col>
            </Row>
          </Col>
          <Col span={24}>
            <Table
              rowKey={record => record.id || record.productVariantId || record.productId || record.sku}
              bordered={true}
              dataSource={data}
              columns={columns}
              size="small"
              pagination={{
                current: filters.page,
                pageSize: filters.limit,
                total,
                showSizeChanger: true,
                showTotal: total => `Total ${total} items`
              }}
              loading={loading}
              onChange={onChangeTable}
            />
          </Col>
        </Row>
        <Drawer
          title={selectedProduct ? selectedProduct.itemName : "Product Detail"}
          width={420}
          closable={true}
          onClose={() => setSelectedProduct(null)}
          visible={!!selectedProduct}
        >
          {selectedProduct &&
            <div>
              <DetailRow label="Barcode">{getEmpty(selectedProduct.barcode)}</DetailRow>
              <DetailRow label="Upcoming Qty">{getQuantity(getFirstValue(selectedProduct.upcomingQty, selectedProduct.upcomingQuantity, 0))}</DetailRow>
              <DetailRow label="Total Cost">{getMoney(selectedProduct.totalCost)}</DetailRow>
              <DetailRow label="Total Sales Value">{getMoney(selectedProduct.totalSalesValue)}</DetailRow>
              <DetailRow label="Expected Profit">{getMoney(selectedProduct.expectedProfit)}</DetailRow>
              <DetailRow label="Expected Loss">{getMoney(selectedProduct.expectedLoss)}</DetailRow>
              <DetailRow label="Inventory Status">
                {renderStatusTag(selectedProduct.inventoryStatus, inventoryStatusLabels)}
              </DetailRow>
              <DetailRow label="Pricing Status">
                {renderStatusTag(selectedProduct.pricingStatus, pricingStatusLabels)}
              </DetailRow>
            </div>
          }
        </Drawer>
      </div>
    </React.Fragment>
  );
}
