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
  Tabs,
  Alert,
  message
} from "antd";
import { Translate } from "react-localize-redux";
import history from "../../../../common/router/history";
import Util from "../../../../common/util";
import LocationService from "@services/LocationService";
import ProductService from "../../../services/report/ProductService";
import ItemService from "@services/ItemService";
import CategoryService from "@services/CategoryService";
import BrandService from "@services/BrandService";
import { getPricingDraftPreview, getPricingColumns, getPricingVariantId } from "./pricing-management";
import "./index.css";

const { Option } = Select;
const { Search } = Input;
const { TabPane } = Tabs;
const util = new Util();
const pathName = "/reports/product";
const sortableFields = ["itemName", "sku", "unitCost", "salesPrice", "marketPrice", "marginPercent", "quantityOnHand", "expectedProfit"];
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
const getPricingMoney = value => getNumber(value).toLocaleString("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 4
});
const getEmpty = value => (value === null || value === undefined || value === "" ? "-" : value);
const getFirstValue = (...values) => values.find(value => value !== null && value !== undefined && value !== "");

const getInitialFilters = (pricingManagement = false) => {
  const params = new URLSearchParams(document.location.search);
  const sortBy = params.get("sortBy");
  const sortOrder = (params.get("sortOrder") || "").toUpperCase();
  const validSort = sortableFields.includes(sortBy) && ["ASC", "DESC"].includes(sortOrder);
  return {
    ...defaultFilters,
    keyword: params.get("keyword") || params.get("search") || "",
    locationId: params.get("locationId") || "",
    categoryId: params.get("categoryId") || "",
    brandId: params.get("brandId") || "",
    status: pricingManagement ? "" : params.get("status") || "",
    needsAttention: !pricingManagement && params.get("needsAttention") === "true" ? true : "",
    lowStock: pricingManagement ? "" : params.get("lowStock") || "",
    pricing: pricingManagement ? "" : params.get("pricing") || "",
    profitable: pricingManagement ? "" : params.get("profitable") || "",
    loss: pricingManagement ? "" : params.get("loss") || "",
    page: Number(params.get("page") || params.get("current")) || defaultFilters.page,
    limit: Number(params.get("limit")) || defaultFilters.limit,
    sortBy: validSort ? sortBy : "",
    sortOrder: validSort ? sortOrder : ""
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

export default function ReportProduct({ pricingManagement = false, routePath = pathName }) {
  const initialFilters = getInitialFilters(pricingManagement);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [pricingDrafts, setPricingDrafts] = React.useState({});
  const [savingPriceId, setSavingPriceId] = React.useState(null);
  const [priceErrors, setPriceErrors] = React.useState({});
  const [filters, setFilters] = React.useState(initialFilters);
  const [quickFilter, setQuickFilter] = React.useState(getQuickFilterKey(initialFilters));
  const [data, setData] = React.useState([]);
  const [summary, setSummary] = React.useState({});
  const [total, setTotal] = React.useState(0);
  const [locations, setLocations] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const [brands, setBrands] = React.useState([]);
  const [selectedProduct, setSelectedProduct] = React.useState(null);
  const timerRef = useRef(null);
  const filtersRef = useRef(filters);
  const requestIdRef = useRef(0);
  const priceSaveRef = useRef(null);
  const mountedRef = useRef(true);

  const updateURL = nextFilters => {
    const params = new URLSearchParams();
    Object.keys(cleanRequestParams(nextFilters)).forEach(key => params.set(key, nextFilters[key]));
    history.push({ pathname: routePath, search: `?${params.toString()}` });
  };

  const fetchReport = nextFilters => {
    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError("");
    return ProductService.getInventoryStockReport(cleanRequestParams(nextFilters))
      .then(response => {
        if (requestId !== requestIdRef.current) return;
        const report = normalizeReportResponse(response);
        setSummary(report.summary);
        setData(report.items);
        setTotal(report.pagination.total);
        const resolvedFilters = {
          ...filtersRef.current,
          page: report.pagination.page,
          limit: report.pagination.limit
        };
        filtersRef.current = resolvedFilters;
        setFilters(resolvedFilters);
      })
      .catch(() => {
        if (requestId !== requestIdRef.current) return;
        setError("Unable to load the item report. Please try again.");
        setData([]);
        setSummary({});
        setTotal(0);
      })
      .finally(() => {
        if (requestId === requestIdRef.current) setLoading(false);
      });
  };

  const applyFilters = nextValues => {
    clearTimeout(timerRef.current);
    const nextFilters = {
      ...filtersRef.current,
      ...nextValues
    };
    filtersRef.current = nextFilters;
    setFilters(nextFilters);
    setQuickFilter(getQuickFilterKey(nextFilters));
    updateURL(nextFilters);
    fetchReport(nextFilters);
  };

  const onChangeSearch = event => {
    const keyword = event.target.value;
    filtersRef.current = { ...filtersRef.current, keyword };
    setFilters(filtersRef.current);
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
    const key = sorter && (sorter.columnKey || sorter.field);
    const activeSort = sortableFields.includes(key) && ["ascend", "descend"].includes(sorter.order);
    const nextSortBy = activeSort ? key : "";
    const nextSortOrder = activeSort ? (sorter.order === "ascend" ? "ASC" : "DESC") : "";
    const current = filtersRef.current;
    const sortChanged = nextSortBy !== current.sortBy || nextSortOrder !== current.sortOrder;

    applyFilters({
      page: sortChanged || pagination.pageSize !== current.limit ? 1 : pagination.current,
      limit: pagination.pageSize,
      sortBy: nextSortBy,
      sortOrder: nextSortOrder
    });
  };

  React.useEffect(() => {
    mountedRef.current = true;
    fetchReport(initialFilters);

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

    return () => {
      clearTimeout(timerRef.current);
      requestIdRef.current += 1;
      mountedRef.current = false;
    };
    //eslint-disable-next-line
  }, []);

  const sortedInfo = {
    field: filters.sortBy,
    order: filters.sortOrder === "ASC" ? "ascend" : filters.sortOrder === "DESC" ? "descend" : undefined
  };
  const selectedStatusValue = statusOptions.some(option => option.value === filters.status) ? filters.status : "";
  const changePricingDraft = (row, changes) => {
    const variantId = getPricingVariantId(row);
    if (priceSaveRef.current === variantId) return;
    setPricingDrafts(previous => ({ ...previous, [variantId]: {
      ...previous[variantId], ...changes,
      expectedSalesPrice: previous[variantId]?.expectedSalesPrice ?? Number(row.salesPrice),
      expectedUnitCost: previous[variantId]?.expectedUnitCost ?? Number(row.unitCost)
    } }));
  };
  const changeMargin = (row, margin) => changePricingDraft(row, { source: "margin", margin });
  const changeSalesPrice = (row, salesPrice) => changePricingDraft(row, { source: "price", salesPrice });
  const resetMargin = variantId => {
    if (priceSaveRef.current === variantId) return;
    setPricingDrafts(previous => {
      const next = { ...previous };
      delete next[variantId];
      return next;
    });
    setPriceErrors(previous => {
      const next = { ...previous };
      delete next[variantId];
      return next;
    });
  };
  const savePrice = async row => {
    const variantId = getPricingVariantId(row);
    const draft = pricingDrafts[variantId];
    if (!variantId || !draft || priceSaveRef.current || priceErrors[variantId]?.conflict) return;
    const preview = getPricingDraftPreview(draft);
    if (preview.error || !Number.isFinite(draft.expectedSalesPrice)) return;
    priceSaveRef.current = variantId;
    setSavingPriceId(variantId);
    setPriceErrors(previous => ({ ...previous, [variantId]: null }));
    try {
      const response = await ItemService.updateSellingPrice(variantId, {
        salesPrice: preview.price,
        expectedSalesPrice: draft.expectedSalesPrice,
        expectedUnitCost: draft.expectedUnitCost
      });
      if (!mountedRef.current) return;
      const saved = response.data.data;
      setData(previous => previous.map(item => getPricingVariantId(item) === variantId ? { ...item, ...saved } : item));
      setPricingDrafts(previous => {
        const next = { ...previous };
        delete next[variantId];
        return next;
      });
      message.success("Selling price saved.");
      await fetchReport(filtersRef.current);
    } catch (saveError) {
      if (!mountedRef.current) return;
      const status = saveError.response?.status;
      const apiError = saveError.response?.data?.error;
      const conflict = status === 409 || apiError?.code === "PRICE_OR_COST_CHANGED";
      const errorMessage = conflict
        ? "Price or cost changed. Refresh the report, then reset this edit before trying again."
        : status === 403 ? "You do not have permission to update this selling price."
        : status === 404 ? "This variant is unavailable or does not belong to your business."
        : apiError?.message || "Unable to save selling price. Please try again.";
      setPriceErrors(previous => ({ ...previous, [variantId]: { message: errorMessage, conflict } }));
      if (conflict) await fetchReport(filtersRef.current);
    } finally {
      priceSaveRef.current = null;
      if (mountedRef.current) setSavingPriceId(null);
    }
  };
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
      sortOrder: sortedInfo.field === "itemName" ? sortedInfo.order : null,
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
      sorter: true,
      sortOrder: sortedInfo.field === "sku" ? sortedInfo.order : null,
      render: getEmpty
    },
    {
      title: "Unit Cost",
      dataIndex: "unitCost",
      key: "unitCost",
      width: 130,
      align: "right",
      sorter: true,
      sortOrder: sortedInfo.field === "unitCost" ? sortedInfo.order : null,
      render: getMoney
    },
    {
      title: "Unit Price",
      dataIndex: "salesPrice",
      key: "salesPrice",
      width: 130,
      align: "right",
      sorter: true,
      sortOrder: sortedInfo.field === "salesPrice" ? sortedInfo.order : null,
      render: getMoney
    },
    {
      title: "Market",
      dataIndex: "marketPrice",
      key: "marketPrice",
      width: 130,
      align: "right",
      sorter: true,
      sortOrder: sortedInfo.field === "marketPrice" ? sortedInfo.order : null,
      render: marketPrice => marketPrice === null || marketPrice === undefined || marketPrice === "" ? "-" : getMoney(marketPrice)
    },
    {
      title: "Margin",
      dataIndex: "marginPercent",
      key: "marginPercent",
      width: 120,
      align: "right",
      sorter: true,
      sortOrder: sortedInfo.field === "marginPercent" ? sortedInfo.order : null,
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
      sortOrder: sortedInfo.field === "quantityOnHand" ? sortedInfo.order : null,
      render: quantityOnHand => getQuantity(quantityOnHand)
    },
    {
      title: "Stock Age",
      dataIndex: "stockAge",
      key: "stockAge",
      width: 130,
      align: "right",
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
    }
  ];

  return (
    <React.Fragment>
      <div id={pricingManagement ? "pricing-management" : "product-report"} style={{ padding: 20 }}>
        <PageHeader
          style={{
            paddingLeft: 0,
            paddingRight: 0,
          }}
          backIcon={""}
          title={pricingManagement ? "Pricing Management" : <Translate id="text_product_report" />}
          subTitle={pricingManagement ? "Set margin or unit price, then save" : "Inventory and pricing insights"}
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
              {!pricingManagement && <Col style={{ display: "none" }}>
                <Tabs activeKey={quickFilter} onChange={onChangeQuickFilter} type="card">
                  {quickFilters.map(filter => (
                    <TabPane tab={filter.label} key={filter.key} />
                  ))}
                </Tabs>
              </Col>}
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
                {!pricingManagement && <Select
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
                </Select>}
              </Col>
            </Row>
          </Col>
          <Col span={24}>
            {pricingManagement && <Button size="small" style={{ marginBottom: 12 }}
              disabled={!Object.keys(pricingDrafts).length || !!savingPriceId}
              onClick={() => { setPricingDrafts({}); setPriceErrors({}); }}>Reset all previews</Button>}
            {error && <Alert type="error" showIcon message={error}
              description={<Button size="small" onClick={() => fetchReport(filtersRef.current)}>Retry</Button>}
              style={{ marginBottom: 12 }} />}
            <Table
              rowKey={record => record.id || record.productVariantId || record.productId || record.sku}
              bordered={true}
              dataSource={data}
              columns={pricingManagement ? getPricingColumns(columns, pricingDrafts, changeMargin, resetMargin, getPricingMoney, sortedInfo, {
                onSave: savePrice, onPriceChange: changeSalesPrice, savingId: savingPriceId, errors: priceErrors
              }) : columns}
              scroll={pricingManagement ? { x: 1200 } : undefined}
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
