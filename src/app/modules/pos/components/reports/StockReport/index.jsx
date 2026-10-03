import React, { useRef } from "react";
import {
  Statistic,
  PageHeader,
  Table,
  Select,
  Card,
  Icon,
  Row,
  Col,
  Input
} from "antd";
import { Translate } from "react-localize-redux";
import ExportForm from "./ExportForm";
import history from "../../../../common/router/history";
import Util from "../../../../common/util";
import LocationService from "@services/LocationService";
import StockService from "../../../services/report/StockService";
import ProductsTypeService from "@services/CategoryService";
import PrivilegeService from "../../../services/settings/PrivilegeService";
import CategoryService from "@services/CategoryService";

const { Option } = Select;
const { Search } = Input;
const permission_module_code = "report";
const permission_code = "stock_report";
const util = new Util();
const pathName = "/reports/stock-report";
const defaultPage = 1;
const defaultLimit = 20;
const defaultSortBy = "quantityOnHand";
const defaultSortOrder = "DESC";

const getNumber = (value) => Number(value || 0);

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

export default function StockReport() {
  const getNumber = value => Number(value || 0);
  const getQuantity = value => getNumber(value).toLocaleString();
  const getMoney = value => util.formatCurrency(getNumber(value));
  const initialParams = new URLSearchParams(document.location.search);
  const [loading, setLoading] = React.useState(false);
  const [keyword, setKeyword] = React.useState(initialParams.get("keyword") || "");
  const [data, setData] = React.useState([]);
  const [locations, setLocations] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const [locationId, setLocationId] = React.useState(initialParams.get("locationId") || "");
  const [categoryId, setCategoryId] = React.useState(initialParams.get("categoryId") || "");
  const [currentPage, setCurrentPage] = React.useState(Number(initialParams.get("page")) || defaultPage);
  const [pageSize, setPageSize] = React.useState(Number(initialParams.get("limit")) || defaultLimit);
  const [sortBy, setSortBy] = React.useState(initialParams.get("sortBy") || defaultSortBy);
  const [sortOrder, setSortOrder] = React.useState(initialParams.get("sortOrder") || defaultSortOrder);
  const [summary, setSummary] = React.useState({});
  const [total, setTotal] = React.useState(0);
  const [isHasAccessPermission, setIsHasAccessPermission] = React.useState(null);
  const timerRef = useRef(null);

  const updateURL = (option) => {
    const params = new URLSearchParams();
    Object.keys(option).forEach((key) => {
      if (option[key] !== "" && option[key] !== null && option[key] !== undefined) {
        params.set(key, option[key]);
      }
    });
    history.push({ pathname: pathName, search: `?${params.toString()}` });
  };

  const fetchReport = (option = {}) => {
    const requestOption = {
      keyword,
      locationId,
      categoryId,
      page: currentPage,
      limit: pageSize,
      sortBy,
      sortOrder,
      ...option
    };

    setLoading(true);
    StockService.getStockReport(requestOption)
      .then((response) => {
        if (response.data) {
          const responseData = response.data;
          setSummary(responseData.summary || {});
          setData(responseData.data || []);
          setTotal(responseData.pagination ? responseData.pagination.total : 0);
          setCurrentPage(responseData.pagination ? responseData.pagination.current : requestOption.page);
          setPageSize(responseData.pagination ? responseData.pagination.limit : requestOption.limit);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleFetch = (option = {}) => {
    const nextOption = {
      keyword,
      locationId,
      categoryId,
      page: currentPage,
      limit: pageSize,
      sortBy,
      sortOrder,
      ...option
    };

    updateURL(nextOption);
    fetchReport(nextOption);
  };

  const onChangeSearch = (event) => {
    const nextKeyword = event.target.value;
    setKeyword(nextKeyword);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      handleFetch({ keyword: nextKeyword, page: defaultPage });
    }, 500);
  };

  const onChangeLocation = (nextLocationId) => {
    setLocationId(nextLocationId);
    handleFetch({ locationId: nextLocationId, page: defaultPage });
  };

  const onChangeCategory = (nextCategoryId) => {
    setCategoryId(nextCategoryId);
    handleFetch({ categoryId: nextCategoryId, page: defaultPage });
  };

  const onChangeTable = (nextPagination, filters, sorter) => {
    const nextSortBy = sorter && sorter.field ? sorter.field : sortBy;
    const nextSortOrder = sorter && sorter.order === "ascend" ? "ASC" : "DESC";

    setCurrentPage(nextPagination.current);
    setPageSize(nextPagination.pageSize);
    setSortBy(nextSortBy);
    setSortOrder(nextSortOrder);
    handleFetch({
      page: nextPagination.current,
      limit: nextPagination.pageSize,
      sortBy: nextSortBy,
      sortOrder: nextSortOrder
    });
  };

  React.useEffect(() => {
    const params = new URLSearchParams(document.location.search);
    const requestOption = {
      keyword: params.get("keyword") || "",
      locationId: params.get("locationId") || "",
      categoryId: params.get("categoryId") || "",
      page: Number(params.get("page")) || defaultPage,
      limit: Number(params.get("limit")) || defaultLimit,
      sortBy: params.get("sortBy") || defaultSortBy,
      sortOrder: params.get("sortOrder") || defaultSortOrder
    };

    setKeyword(requestOption.keyword);
    setLocationId(requestOption.locationId);
    setCategoryId(requestOption.categoryId);
    setCurrentPage(requestOption.page);
    setPageSize(requestOption.limit);
    setSortBy(requestOption.sortBy);
    setSortOrder(requestOption.sortOrder);

    PrivilegeService.checkPermission(permission_module_code, permission_code)
      .then(({ data }) => {
        setIsHasAccessPermission(data);
        if (data) {
          fetchReport(requestOption);
        }
      })
      .catch(() => setIsHasAccessPermission(false));

    LocationService.get({ limit: 500 })
      .then(response => {
        if (response.data && response.data.data) {
          setLocations(response.data.data);
        }
      });

    CategoryService.get()
      .then(response => {
        if (response.data && response.data.data) {
          setCategories(response.data.data);
        }
      });

    return () => clearTimeout(timerRef.current);
    //eslint-disable-next-line
  }, []);

  const sortedInfo = {
    field: sortBy,
    order: sortOrder === "ASC" ? "ascend" : "descend"
  };

  const statistics = [
    {
      title: "On Hand",
      value: getQuantity(summary.totalQuantityOnHand),
      icon: "inbox",
      iconClassName: "is-blue"
    },
    {
      title: "Upcoming",
      value: getQuantity(summary.totalUpcomingQuantity),
      icon: "wallet",
      iconClassName: "is-green"
    },
    {
      title: "Inventory Cost",
      value: getMoney(summary.totalInventoryCost),
      icon: "shopping-cart",
      iconClassName: "is-purple"
    },
    {
      title: "Sales Value",
      value: getMoney(summary.totalSalesValue),
      icon: "rise",
      iconClassName: "is-teal",
      valueStyle: { color: "#3f8600" }
    },
    {
      title: "Expected Profit",
      value: getQuantity(summary.totalExpectedProfit),
      icon: "warning",
      iconClassName: "is-orange"
    },
    {
      title: "Expected Loss",
      value: getMoney(summary.totalExpectedLoss),
      icon: "tags",
      iconClassName: "is-red"
    }
  ];

  const columns = [
    {
      title: <Translate id="text_item_name" />,
      dataIndex: "itemName",
      key: "itemName",
      sorter: true,
      sortOrder: sortedInfo.field === "itemName" && sortedInfo.order,
      render: (itemName, record) => record.variantName ? `${itemName} / ${record.variantName}` : itemName
    },
    {
      title: "SKU",
      dataIndex: "sku",
      key: "sku",
      width: 130
    },
    {
      title: <Translate id="text_barcode" />,
      dataIndex: "barcode",
      key: "barcode",
      width: 150
    },
    {
      title: "On Hand",
      dataIndex: "quantityOnHand",
      key: "quantityOnHand",
      width: 120,
      align: "right",
      sorter: true,
      sortOrder: sortedInfo.field === "quantityOnHand" && sortedInfo.order
    },
    {
      title: "Upcoming",
      dataIndex: "upcomingQuantity",
      key: "upcomingQuantity",
      width: 120,
      align: "right",
      sorter: true,
      sortOrder: sortedInfo.field === "upcomingQuantity" && sortedInfo.order
    },
    {
      title: <Translate id="text_unit_cost" />,
      dataIndex: "unitCost",
      key: "unitCost",
      width: 130,
      align: "right",
      sorter: true,
      sortOrder: sortedInfo.field === "unitCost" && sortedInfo.order,
      render: unitCost => util.formatCurrency(unitCost)
    },
    {
      title: <Translate id="text_retail_price" />,
      dataIndex: "salesPrice",
      key: "salesPrice",
      width: 130,
      align: "right",
      sorter: true,
      sortOrder: sortedInfo.field === "salesPrice" && sortedInfo.order,
      render: salesPrice => util.formatCurrency(salesPrice)
    },
    {
      title: "Total Cost",
      dataIndex: "totalCost",
      key: "totalCost",
      width: 140,
      align: "right",
      sorter: true,
      sortOrder: sortedInfo.field === "totalCost" && sortedInfo.order,
      render: totalCost => util.formatCurrency(totalCost)
    },
    {
      title: "Sales Value",
      dataIndex: "totalSalesValue",
      key: "totalSalesValue",
      width: 140,
      align: "right",
      sorter: true,
      sortOrder: sortedInfo.field === "totalSalesValue" && sortedInfo.order,
      render: totalSalesValue => util.formatCurrency(totalSalesValue)
    },
    {
      title: "Expected Profit",
      dataIndex: "expectedProfit",
      key: "expectedProfit",
      width: 150,
      align: "right",
      sorter: true,
      sortOrder: sortedInfo.field === "expectedProfit" && sortedInfo.order,
      render: expectedProfit => util.formatCurrency(expectedProfit)
    },
    {
      title: "Expected Loss",
      dataIndex: "expectedLoss",
      key: "expectedLoss",
      width: 140,
      align: "right",
      sorter: true,
      sortOrder: sortedInfo.field === "expectedLoss" && sortedInfo.order,
      render: expectedLoss => util.formatCurrency(expectedLoss)
    }
  ];

  return (<div id="report-sale" style={{ padding: 20 }}>
        <PageHeader
          style={{
            paddingLeft: 0,
            paddingRight: 0,
          }}
          backIcon={""}
          title={<Translate id="text_stock_report" />}
          subTitle="Stock levels, value, and performance"
        />
        <Row gutter={16}>
          {statistics.map(statistic => (
            <ReportStatisticCard
              key={statistic.title}
              loading={loading}
              {...statistic}
            />
          ))}
          {/* <Col span={4}>
            <Card>
              <Statistic
                title="On Hand"
                value={getNumber(summary.totalQuantityOnHand)}
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic
                title="Upcoming"
                value={getNumber(summary.totalUpcomingQuantity)}
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic
                title="Inventory Cost"
                value={util.formatCurrency(getNumber(summary.totalInventoryCost))}
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic
                title="Sales Value"
                value={util.formatCurrency(getNumber(summary.totalSalesValue))}
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic
                title="Expected Profit"
                valueStyle={{ color: "#3f8600" }}
                value={util.formatCurrency(getNumber(summary.totalExpectedProfit))}
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic
                title="Expected Loss"
                valueStyle={{ color: getNumber(summary.totalExpectedLoss) > 0 ? "#cf1322" : undefined }}
                value={util.formatCurrency(getNumber(summary.totalExpectedLoss))}
              />
            </Card>
          </Col> */}
          <Col span={24}>
            <Row type="flex" justify="space-between" align="middle" style={{ marginTop: 15, marginBottom: 15 }}>
              <Col lg={20}>
                <Search
                  placeholder="Search item by name, barcode or SKU"
                  onChange={onChangeSearch}
                  style={{ width: 300 }}
                  allowClear={true}
                  value={keyword}
                />
                <Select
                  name="locationId"
                  style={{ width: 200, marginLeft: 15 }}
                  value={locationId}
                  onChange={onChangeLocation}
                >
                  {[{ name: <Translate id="text_all_store" />, id: "" }].concat(locations).map((value, key) => (
                    <Option key={key} value={value.id}>
                      {value.name}
                    </Option>
                  ))}
                </Select>
                <Select
                  name="categoryId"
                  style={{ width: 200, marginLeft: 15 }}
                  value={categoryId}
                  onChange={onChangeCategory}
                >
                  {[{ name: <Translate id="text_all_category" />, id: "" }].concat(categories).map((value, key) => (
                    <Option key={key} value={value.id}>
                      {value.name}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col lg={4} style={{ display: "flex", justifyContent: "flex-end" }}>
                <ExportForm
                  keyword={keyword}
                  locationId={locationId}
                  categoryId={categoryId}
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                />
              </Col>
            </Row>
          </Col>
          <Col span={24}>
            <Table
              rowKey={record => `${record.productId}-${record.productVariantId || record.sku}`}
              bordered={true}
              size="small"
              dataSource={data}
              columns={columns}
              pagination={{
                current: currentPage,
                pageSize,
                total,
                showSizeChanger: true,
                showTotal: total => `Total ${total} items`
              }}
              loading={loading}
              onChange={onChangeTable}
            />
          </Col>
        </Row>
      </div>
  );
}
