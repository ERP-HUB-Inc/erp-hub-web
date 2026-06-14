import React from "react";
import {
  Row,
  Col,
  Card,
  Icon,
  Progress,
  Select,
  Radio,
  Spin,
  Table
} from "antd";
import { Translate } from "react-localize-redux";
import moment from "moment";
import { Chart, registerables } from "chart.js";
import { Line } from "react-chartjs-2";
import * as _ from "lodash";
import Util from "@common/util/index";
import { SelectPeriodOption } from "@components/stateless/select-period-option";
import InventoryService from "@services/report.inventory";
import DashboardService from "@services/dashboard";
import "./index.css"

Chart.register(...registerables);

const util = new Util();
const { Option } = Select;

const columns = [
  {
    title: "Product Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Barcode",
    dataIndex: "barcode",
    key: "barcode",
  },
  {
    title: "Sold",
    dataIndex: "soldQuantity",
    key: "soldQuantity",
    render: (soldQuantity, record) => `${soldQuantity} ${record.unit}`
  },
  {
    title: "Total",
    dataIndex: "total",
    key: "total",
    align: "right",
    render: total => util.formatCurrency(total)
  },
];

const DashboardPage = () => {
  const [option, setOption] = React.useState("today");
  const [overallSales, setOverallSales] = React.useState({
    dates: [],
    currentPeriodSales: [], 
    currentPeriodAmount: 0, 
    growthAsPercentage: 0
  });
  const [popularProducts, setPopularProducts] = React.useState([]);
  const [loadingPopular, setLoadingPopular] = React.useState(false);
  const [dashboardSummaries, setDashboardSummaries] = React.useState([]);
  const [popularCategories, setPopularCategories] = React.useState([]);
  const [topSellingSize, setTopSellingSize] = React.useState(25);
  const [topSellType, setTopSellType] = React.useState("quantity");
  const [loading, setLoading] = React.useState(false);
  const [isHasPermission, setIsHasPermission] = React.useState(true);

  const onChange = (value) => {
    setOption(value);
    DashboardService.getTodayTotal(value).then((response) => {
      if (response.data && response.data) {
        setDashboardSummaries(response.data);
      }
    });
  }

  const fetchPopularProducts = (limit, popularBy) => {
    setLoadingPopular(true);
    InventoryService.getPopularProduct(limit, popularBy)
    .then(response => {
      if (response.data) {
        setPopularProducts(response.data);
      }
    })
    .finally(() => {
      setLoadingPopular(false);
    });
  };

  const onChangeTopSellingType = (e) => {
    setTopSellType(e.target.value);
    fetchPopularProducts(topSellingSize, e.target.value);
  };

  const onChangeTopSellingSize = (value) => {
    setTopSellingSize(value);
    fetchPopularProducts(value, topSellType);
  };

  const getDashboardValue = (index, key) => {
    return dashboardSummaries.length > 0 ? dashboardSummaries[index][key] : 0;
  };

  React.useEffect(() => {
    DashboardService.getTodayTotal(option)
    .then(response => {
      if (response.data) {
        setDashboardSummaries(response.data);
      }
    });

    fetchPopularProducts(topSellingSize);

    InventoryService.getPopularCategories(7)
    .then(response => {
      if (response.data) {
        setPopularCategories(response.data);
      }
    })
    .finally(() => {
      setLoadingPopular(false);
    });
    
    DashboardService.getOverallSales(moment().subtract(30, "days").format("YYYY-MM-DD"), moment().format("YYYY-MM-DD"))
    .then(response => {
      setOverallSales(response.data);
    });
  }, []);


  let maxAxis = overallSales.currentPeriodSales.length > 0 ? Math.max(parseInt(_.maxBy(overallSales.currentPeriodSales)), 200) : 500;
  maxAxis = maxAxis.toString().split("");
  maxAxis[0] = parseInt(maxAxis[0], 10) + 1;
  for (let i = 1; i < maxAxis.length; i++) {
    maxAxis[i] = 0;
  }
  maxAxis = parseInt(maxAxis.join(""), 10);

  const options = {
      maintainAspectRatio: false,
      responsive: true,
      animated: false,
      elements: {
          line: {
            tension: 0.4
          }
      },
      scales: {
        y: {
            min: 0,
            max: maxAxis,
            ticks: {
              count: 5,
              precision: 0,
              font: {
                  size: 14,
                  family: "'Open Sans','Kantumruy'",
              }
            }
        },
        x: {
            ticks: {
                font: {
                    size: 14,
                    family: "'Open Sans','Kantumruy'",
                }
            }
        }
      },
      plugins: {
          legend: {
              display: false,
              position: "top",
              labels: {
                  font: {
                    size: 16,
                    family: "'Open Sans','Kantumruy'",
                    weight: "bold"
                  }
              }
          },
          title: {
              display: false,
              text: "Overal sales",
              font: {
                size: 16,
                family: "'Open Sans','Kantumruy'",
                weight: "bold"
              }
          }
      },
  };

  const labels = overallSales["dates"].map(value => moment().subtract(30, "days").add(value, "days").format("D ddd"));

  const lineData = {
    labels,
    datasets: [
        {
            label: "ចំណូលខែមិថុនា",
            data: overallSales["currentPeriodSales"],
            borderColor: "#1F1F39",
            backgroundColor: "white",
            borderWidth: 2,
            borderJoinStyle: "round"
        },
    ],
  };

  let revenue = getDashboardValue(0, "value") || 0;
  let expense = getDashboardValue(4, "value") || 0;
  const revenueRisePercentage = getDashboardValue(0, "diffRevenueFromLLastAsPercentage") || 0;
  let discount = getDashboardValue(2, "value") || 0;

  const diffSaleAsPercentage = getDashboardValue(0, "diffSaleFromLastAsPercentage") || 0;
  const mostPopularCategory = _.maxBy(popularCategories, value => value.total);
  const totalSaleOfPopularCategory = mostPopularCategory ? mostPopularCategory.total : 0;

  if (loading) return <Spin />; 

  return (
    <React.Fragment>
      <div id="dashboard" style={{ paddingLeft: "40px", paddingRight: "40px", marginTop: "20px" }}>
        <div id="navDaskboard">
          <ul>
            <li className="nav-left">
              <div className="nav-title">
                <h4>
                  <Translate id="text_overview" />
                </h4>
                <span>Here’s your analytic for this:</span>
              </div>
            </li>
            <li className="nav-right">
              <SelectPeriodOption
                onChange={onChange}
                value={option}
                style={{ width: 165 }}
              />
            </li>
          </ul>
        </div>
        <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 20]}>
          <Col lg={24} xs={24}>
            <Row gutter={[16, 16]}>
              <Col lg={6} sm={24}>
                <div id="taskDadhboardFirst">
                  <Card bordered={false}>
                    <div className="header-task-item">
                      <div className="icon-left">
                        <Icon type="shopping-cart" />
                      </div>
                      <div className="menu-right">
                        <Icon type="ellipsis" />
                      </div>
                    </div>
                    <div className="subtitle">
                      <span>
                        <Translate id="text_revenue" />
                      </span>
                    </div>
                    <div className="sub-total">
                      <span>{new Util().formatCurrency(revenue)}</span>
                    </div>
                    <div className="total-footer">
                      <span
                        style={
                          revenueRisePercentage > 0 ? {} : { color: "red" }
                        }
                      >
                        <Icon
                          type={revenueRisePercentage >= 0 ? "rise" : "fall"}
                        />
                        {Math.abs(revenueRisePercentage)}%
                      </span>
                    </div>
                  </Card>
                </div>
              </Col>
              <Col lg={6} sm={24}>
                <div id="taskDadhboardFirst">
                  <Card bordered={false}>
                    <div className="header-task-item">
                      <div className="icon-left">
                        <Icon type="tag" />
                      </div>
                      <div className="menu-right">
                        <Icon type="ellipsis" />
                      </div>
                    </div>
                    <div className="subtitle">
                      <span>
                        <Translate id="text_discount" />
                      </span>
                    </div>
                    <div className="sub-total">
                      <span style={{ color: "red" }}>
                        {new Util().formatCurrency(discount)}
                      </span>
                    </div>
                  </Card>
                </div>
              </Col>
              <Col lg={6} sm={24}>
                <div id="taskDadhboardFirst">
                  <Card bordered={false}>
                    <div className="header-task-item">
                      <div className="icon-left">
                        <Icon type="dollar" />
                      </div>
                      <div className="menu-right">
                        <Icon type="ellipsis" />
                      </div>
                    </div>
                    <div className="subtitle">
                      <span>
                        <Translate id="text_net_sale" />
                      </span>
                    </div>
                    <div className="sub-total">
                      <span>
                        {new Util().formatCurrency(revenue - discount)}
                      </span>
                    </div>
                    <div className="total-footer">
                      <span
                        style={
                          diffSaleAsPercentage >= 0 ? {} : { color: "red" }
                        }
                      >
                        <Icon
                          type={diffSaleAsPercentage >= 0 ? "rise" : "fall"}
                        />
                        {new Util().formatCurrency(
                          Math.abs(diffSaleAsPercentage),
                        )}
                      </span>
                    </div>
                  </Card>
                </div>
              </Col>
              <Col lg={6} sm={24}>
                <div id="taskDadhboardFirst">
                  <Card bordered={false}>
                    <div className="header-task-item">
                      <div className="icon-left">
                        <Icon type="wallet" />
                      </div>
                      <div className="menu-right">
                        <Icon type="ellipsis" />
                      </div>
                    </div>
                    <div className="subtitle">
                      <span>
                        <Translate id="text_total_expense" />
                      </span>
                    </div>
                    <div className="sub-total">
                      <span>{new Util().formatCurrency(expense)}</span>
                    </div>
                    <div className="total-footer">
                      <span style={{ color: "red" }}>
                        <Icon type="rise" />
                        0%
                      </span>
                    </div>
                  </Card>
                </div>
              </Col>
            </Row>
          </Col>
          <Col lg={24} xs={24} id="overall-sales">
            <Card
              title={<Translate id="text_overall_sales" />}
              bordered={false}
              extra={<Icon type="ellipsis" />}
            >
              <div className="header-task">
                <div className="pull-left">
                  <div className="sub-left">
                    <span className="sub-total">
                      {new Util().formatCurrency(
                        overallSales.currentPeriodAmount,
                      )}
                    </span>
                    <div
                      className="footer-task"
                      style={
                        overallSales.growthAsPercentage >= 0
                          ? {}
                          : { color: "red" }
                      }
                    >
                      <Icon type="rise" />
                      {Math.abs(overallSales.growthAsPercentage).toFixed(2)}%
                    </div>
                  </div>
                </div>
                <div className="pull-right hidden">
                  <div className="select-pull-right">
                    <SelectPeriodOption
                      disabled={true}
                      placeholder="Current Month"
                      style={{ width: 150 }}
                    />
                  </div>
                </div>
              </div>
              <div id="mainLinChart">
                <div style={{ height: 350 }}>
                  <Line options={options} data={lineData} />
                </div>
              </div>
            </Card>
          </Col>
          <Col lg={24} xs={24} className="task-line-chart">
            <div id="mainTableList">
              <Card
                title={<Translate id="text_top_selling_products" />}
                bordered={false}
                extra={<Icon type="ellipsis" />}
              >
                <div className="header-task">
                  <div className="btn-header-task">
                    <Radio.Group
                      value={topSellType}
                      onChange={onChangeTopSellingType}
                      style={{ marginBottom: 16 }}
                    >
                      <Radio.Button value="quantity">By Quantity</Radio.Button>
                      <Radio.Button value="totalSale">
                        By Total Sales
                      </Radio.Button>
                    </Radio.Group>
                    <div className="select">
                      <Select
                        defaultValue={25}
                        style={{ width: 199, marginLeft: 15 }}
                        onChange={onChangeTopSellingSize}
                      >
                        <Option value={25}>Top 25 Selling Products</Option>
                        <Option value={50}>Top 50 Selling Products</Option>
                        <Option value={100}>Top 100 Selling Products</Option>
                      </Select>
                    </div>
                  </div>
                </div>
                <div className="table-list-product">
                  <Table
                    bordered={true}
                    rowKey="id"
                    columns={columns}
                    dataSource={popularProducts}
                    pagination={false}
                    loading={loadingPopular}
                  />
                </div>
              </Card>
            </div>
          </Col>
          <Col lg={6} xs={24} className="item" style={{ display: "none" }}>
            <div id="mainDashboadCategory">
              <Card bordered={false}>
                <div className="header-category">
                  <span className="title-category">
                    <Translate id="text_popular_categories" />
                  </span>
                </div>
                <div className="category-progress">
                  <ul>
                    {mostPopularCategory ? (
                      <li>
                        <div className="label-progress">
                          <ul>
                            <li className="label-left">
                              <span>{mostPopularCategory.name}</span>
                            </li>
                            <li className="label-right">
                              <span>
                                {new Util().formatCurrency(
                                  totalSaleOfPopularCategory,
                                )}
                              </span>
                            </li>
                          </ul>
                        </div>
                        <Progress percent={100} status="active" />
                      </li>
                    ) : (
                      ""
                    )}
                    {popularCategories
                      .filter(
                        (value) =>
                          value.categoryId !== mostPopularCategory.categoryId,
                      )
                      .map((popularCategory, key) => (
                        <li key={key}>
                          <div className="label-progress">
                            <ul>
                              <li className="label-left">
                                <span>{popularCategory.name}</span>
                              </li>
                              <li className="label-right">
                                <span>
                                  {new Util().formatCurrency(
                                    popularCategory.total,
                                  )}
                                </span>
                              </li>
                            </ul>
                          </div>
                          <Progress
                            percent={
                              (popularCategory.total * 100) /
                              totalSaleOfPopularCategory
                            }
                            status="active"
                          />
                        </li>
                      ))}
                  </ul>
                </div>
              </Card>
            </div>
          </Col>
        </Row>
      </div>
    </React.Fragment>
  );
};

export default DashboardPage;