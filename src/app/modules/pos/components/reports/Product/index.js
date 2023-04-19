import React from "react";
import {
  Statistic,
  PageHeader,
  Table,
  Select,
  Card,
  Row,
  Col,
  Input
} from "antd";
import { Translate } from "react-localize-redux";
import ExportForm from "./ExportForm";
import history from "../../../../common/router/history";
import Util from "../../../../common/util";
import Enum from "../../../../inventory/enums";
import InventoryUtil from "../../../../inventory/utils"; 
import LocationService from "../../../services/settings/LocationService";
import ProductService from "../../../services/report/ProductService";
import NoPermissionV2 from "../../../../common/components/shares/List/NoPermissionV2";
import PrivilegeService from "../../../services/settings/PrivilegeService";

const { Option } = Select;
const permission_module_code = "report";
const permission_code = "product_report";
const util = new Util();

export default function ReportProduct() {
  const queryparam = new URLSearchParams(document.location.search);
  const [loading, setLoading] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState(queryparam.get("search"));
  const [data, setData] = React.useState(null);
  const [locations, setLocations] = React.useState([]);
  const [pagination, setPagination] = React.useState({pageSize: 50, defaultCurrent: 1, total: 0});
  const [locationId, setLocationId] = React.useState(queryparam.get("locationId"));
  const [currentPage, setCurrentPage] = React.useState(1);
  const [summary, setSummary] = React.useState(null);
  const [isHasAccessPermission, setIsHasAccessPermission] = React.useState(null);
  const { Search } = Input;
  const pathName = "/reports/product";

  const onChangeSearch = (event) => {
    const viewStock = queryparam.get("viewStock");
    const conditionId = queryparam.get("conditionId");
    const similarSearch = event.target.value;

    if (similarSearch) {

      queryparam.set("search", similarSearch);

      util.pushParamsToURL(pathName, queryparam.toString());

    } else {
      queryparam.delete("search");
    }

    queryparam.delete("limit");
    queryparam.delete("offset");

    history.push({pathname: "/reports/product", search: `?${queryparam.toString()}`});

    setSearchValue(similarSearch);

    fetchReport(50, 0, viewStock, similarSearch, null, conditionId);
  };

  const onChangeLocation = (selectLocationId) => {
    const params = new URLSearchParams(document.location.search);
    setLocationId(selectLocationId);
    const limit = queryparam.get("limit");
    const offset = queryparam.get("offset");
    const viewStock = queryparam.get("viewStock");
    const conditionId = queryparam.get("conditionId");
    params.set("locationId", selectLocationId);
    history.push({pathname: "/reports/product", search: `?${params.toString()}`});
    fetchReport(limit, offset, viewStock, searchValue, selectLocationId, conditionId);
  };

  const onChangePagination = (current, pageSize) => {
    const params = new URLSearchParams(document.location.search);
    const viewStock = params.get("viewStock");
    const similarSearch = params.get("search");
    const conditionId = params.get("conditionId");
    const offset = (current - 1) * pageSize;
    params.set("current", current);
    params.set("offset", offset);
    history.push({pathname: "/reports/product", search: `?${params.toString()}`});
    fetchReport(pageSize, offset, viewStock, similarSearch, conditionId);
  };

  const fetchReport = (limit, offset, viewStock, search, locationId, conditionId) => {
    let current = queryparam.get("current");

    limit = limit ? limit : 50;
    offset = offset ? offset : (currentPage - 1) * limit;

    search = search ? search : "";

    if (current) {
      current = parseInt(current);
      setCurrentPage(current);
    } else {
      current = currentPage;
    }

    const option = {limit, offset, viewStock, search, locationId};
    if (conditionId) {
      option["conditionId"] = conditionId;
    }

    setLoading(true);
    ProductService.getProductReport(option)
      .then((response) => {
        if (response.data && response.data.data) {
          const data = response.data;
          setSummary(data.summary);
          setData([...data.data]);
          setPagination(prev => ({...prev, current, total: data.pagination.total, showTotal: total => `Total ${total} items`}));
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  React.useEffect(() => {
    const queryparam = new URLSearchParams(document.location.search);
    const viewStock = queryparam.get("viewStock");
    const search = queryparam.get("search");
    const conditionId = queryparam.get("conditionId");
    const locationId = parseInt(queryparam.get("locationId"));
    const limit = queryparam.get("limit");
    const offset = queryparam.get("offset");

    if (isHasAccessPermission == null){
      PrivilegeService.checkPermission(permission_module_code, permission_code)
      .then(({data}) => setIsHasAccessPermission(data))
      .catch(() => setIsHasAccessPermission(false));
    }

    fetchReport(
      limit,
      offset,
      viewStock,
      search,
      locationId,
      conditionId
    );

    LocationService.lists(50)
    .then(response => {
      if (response.data && response.data.data) {
        setLocations(response.data.data);
      }
    });
    //eslint-disable-next-line
  }, [isHasAccessPermission]);

  let currentStockValueByCost = 0;
  let currentStockValueByPrice = 0;
  let expectedProfit = 0;
  let expectedMargin = 0;

  if (summary) {
    currentStockValueByCost = summary.currentStockValueByCost;
    currentStockValueByPrice = summary.currentStockValueByPrice;
    expectedProfit = summary.expectedProfit;
    expectedMargin = summary.expectedMargin;
  }

  const viewStock = queryparam.get("viewStock");

  return (
      <React.Fragment>
        {util.isNotCheckingPermissionV2(isHasAccessPermission) &&
          (isHasAccessPermission ?
              <div id="report-sale">
                <PageHeader
                    style={{
                      backgroundColor: "#f7f7f7",
                      paddingLeft: 0,
                      paddingRight: 0,
                    }}
                    backIcon={""}
                    title={<Translate id="text_product_report" />}
                    subTitle=""
                    extra={[
                      <div key={1}>
                        <Search
                            placeholder="Search product by name,barcode"
                            onChange={onChangeSearch}
                            style={{ width: "280px" }}
                            allowClear={true}
                            defaultValue={searchValue ? searchValue : ""}
                        />
                        <Select
                            name="locationId"
                            style={{ width: 200 , marginLeft: 15}}
                            defaultValue={locationId ? parseInt(locationId) : 0}
                            onChange={onChangeLocation}
                        >
                          {[{name: <Translate id="text_all_store"/>, id: 0}].concat(locations).map((value, key) => (
                              <Option key={key} value={value.id}>
                                {value.name}
                              </Option>
                          ))}
                        </Select>
                      </div>
                    ]}
                />
                <Row gutter={16}>
                  <Col span={6}>
                    <Card>
                      <Statistic
                          title="Current Stock Value (By purchase price)"
                          value={currentStockValueByCost.toFixed(2)}
                          precision={2}
                      />
                    </Card>
                  </Col>
                  <Col span={6}>
                    <Card>
                      <Statistic
                          title="Current Stock Value (By selling price)"
                          value={currentStockValueByPrice.toFixed(2)}
                          precision={2}
                      />
                    </Card>
                  </Col>
                  <Col span={6}>
                    <Card>
                      <Statistic
                          title="Expected Gross Profit"
                          valueStyle={{ color: "#3f8600" }}
                          value={expectedProfit.toFixed(2)}
                          precision={2}
                      />
                    </Card>
                  </Col>
                  <Col span={6}>
                    <Card>
                      <Statistic
                          title={<Translate id="text_margin" />}
                          value={expectedMargin ? expectedMargin.toFixed(2) : 0}
                          precision={2}
                          suffix="%"
                      />
                    </Card>
                  </Col>
                  <Col span={24}>
                    <ExportForm locationId={locationId} viewStock={viewStock} />
                  </Col>
                  <Col span={24}>
                    <Table
                        rowKey="id"
                        bordered={true}
                        dataSource={data ? data : []}
                        columns={[
                          {
                            title: <Translate id="text_product_name" />,
                            dataIndex: "name",
                            key: "name",
                            render: (text, record) => {
                              let variantName = "";
                              if (record.product && record.product.productOption === Enum.PRODUCT_VARIANT) {
                                variantName = ` / ${record.name}`;
                              }
                              return InventoryUtil.getProductNameV2(record.product) + variantName;
                            }
                          },
                          {
                            title: <Translate id="text_barcode" />,
                            dataIndex: "barcode",
                            key: "barcode"
                          },
                          {
                            title: <Translate id="text_quantity" />,
                            dataIndex: "quantity",
                            width: 150,
                            key: "quantity",
                            render: (quantity, record) => {
                              quantity = record.quantity;
                              if ("productLocations" in record) {
                                quantity = InventoryUtil.getProductQTYLocation(record["productLocations"]);
                              } else if ("productVariants" in record) {
                                quantity = InventoryUtil.getProductQTYLocation(record["productVariants"]);
                              }

                              return `${quantity} ${record.product.unit.name}`;
                            }
                          },
                          {
                            title: <Translate id="text_cost" />,
                            dataIndex: "cost",
                            width: 150,
                            align: "right",
                            key: "cost",
                            render: cost => (new Util()).formatCurrency(cost)
                          },
                          {
                            title: <Translate id="text_product_total_cost" />,
                            dataIndex: "totalCost",
                            width: 150,
                            align: "right",
                            key: "totalCost",
                            render: (text, record) => {
                              return (new Util()).formatCurrency(record.cost * record.quantity);
                            }
                          },
                          {
                            title: <Translate id="text_retail_price" />,
                            dataIndex: "price",
                            width: 150,
                            align: "right",
                            key: "price",
                            render: price => (new Util()).formatCurrency(price)
                          },
                          {
                            title: <Translate id="text_total_price" />,
                            dataIndex: "price",
                            width: 150,
                            align: "right",
                            key: "totalPrice",
                            render: (price, record) => {
                              return (new Util()).formatCurrency(price * record.quantity);
                            }
                          },
                          {
                            title: <Translate id="text_margin" />,
                            dataIndex: "price",
                            width: 150,
                            align: "right",
                            key: "margin",
                            render: (price, record) => {
                              const quantity = Math.max(record.quantity, 1);
                              const totalPrice = price * quantity;
                              const totalCost = record.cost * quantity;
                              const margin = ((totalPrice - totalCost) / totalPrice) * 100;

                              return `${margin.toFixed(2)}%`;
                            }
                          }
                        ]}
                        pagination={{...pagination, onChange: (page, pageSize) => onChangePagination(page, pageSize)}}
                        loading={loading}
                    />
                  </Col>
                </Row>
              </div>
              :
              <NoPermissionV2/>
          )
        }
      </React.Fragment>
  );
}
