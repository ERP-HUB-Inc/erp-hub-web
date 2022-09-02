import React from "react";
import { 
  Row, 
  Col,
  Card,
  Icon,
  Progress,
  Select,
  Radio,
  Table
} from "antd";
import { Translate } from "react-localize-redux";
import * as moment from "moment";
import { Chart, registerables } from "chart.js";
import * as _ from "lodash";
import { Line } from "react-chartjs-2";
import InventoryService from "../../../../pos/services/report/InventoryService";
import SelectDateOption from "../../SelectDateOption";
import "../index.css";
import DashboardService from "../../../services/DashboardService";
import Util from "../../../util";
Chart.register(...registerables);

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
    render: total => (new Util()).formatCurrency(total)
  },
];

const Dashboard = (props) => {
  const [option, setOption] = React.useState("today");
  const [overallSales, setOverallSales] = React.useState({dates: [], currentPeriodSales: [], currentPeriodAmount: 0, growthAsPercentage: 0});
  const [popularProducts, setPopularProducts] = React.useState([]);
  const [loadingPopular, setLoadingPopular] = React.useState(false);
  const [dashboardSummaries, setDashboardSummaries] = React.useState([]);
  const [popularCategories, setPopularCategories] = React.useState([]);
  const [topSellingSize, setTopSellingSize] = React.useState(25);
  const [topSellType, setTopSellType] = React.useState("quantity");

  function onChange(value) {
    setOption(value);
    DashboardService.lists(value)
    .then(response => {
      if (response.data && response.data.data) {
        setDashboardSummaries(response.data.data);
      }
    });
  }

  const fetchPopularProducts = (limit, popularBy) => {
    setLoadingPopular(true);
    InventoryService.getPopularProduct(6, popularBy)
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
    DashboardService.lists(option)
    .then(response => {
      if (response.data && response.data.data) {
        setDashboardSummaries(response.data.data);
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

    DashboardService.getOverallSales(moment().startOf("months").format("YYYY-MM-DD"),moment().endOf("months").format("YYYY-MM-DD"))
    .then(response => {
      setOverallSales(response.data);
    });

    //eslint-disable-next-line
  }, []);


  const getOrCreateTooltip = (chart) => {
    let tooltipEl = chart.canvas.parentNode.querySelector("div");
  
    if (!tooltipEl) {
      tooltipEl = document.createElement("div");
      tooltipEl.style.background = "#0D62AF";
      tooltipEl.style.borderRadius = "5px";
      tooltipEl.style.color = "white";
      tooltipEl.style.opacity = 1;
      tooltipEl.style.pointerEvents = "none";
      tooltipEl.style.position = "absolute";
      tooltipEl.style.transform = "translate(-50%, 0)";
      tooltipEl.style.transition = "all .1s ease";
  
      const table = document.createElement("table");
      table.style.margin = "0px";
  
      tooltipEl.appendChild(table);
      chart.canvas.parentNode.appendChild(tooltipEl);
    }
  
    return tooltipEl;
  };

  const externalTooltipHandler = (context) => {console.log(context);
    // Tooltip Element rgba(255, 99, 132, 0.5)
    const {chart, tooltip} = context;
    const tooltipEl = getOrCreateTooltip(chart);
  
    // Hide if no tooltip
    if (tooltip.opacity === 0) {
      tooltipEl.style.opacity = 0;
      return;
    }
  
    // Set Text
    if (tooltip.body) {
      // const titleLines = tooltip.title || [];
      const bodyLines = tooltip.body.map(b => b.lines);
  
      const tableHead = document.createElement("thead");
  
      const tableBody = document.createElement("tbody");
      bodyLines.forEach((body, i) => {
        const tr = document.createElement("tr");
        tr.style.fontFamily = "'Open Sans','Kantumruy'";
        tr.style.fontWeight = "bold";
        tr.style.backgroundColor = "inherit";
        tr.style.borderWidth = 0;
  
        const td = document.createElement("td");
        td.style.borderWidth = 0;
  
        const text = document.createTextNode(`${tooltip.dataPoints[0].formattedValue}`);
        td.appendChild(text);
        tr.appendChild(td);
        tableBody.appendChild(tr);
      });
  
      const tableRoot = tooltipEl.querySelector("table");
  
      // Remove old children
      while (tableRoot.firstChild) {
        tableRoot.firstChild.remove();
      }
  
      // Add new children
      tableRoot.appendChild(tableHead);
      tableRoot.appendChild(tableBody);
    }
  
    const {offsetLeft: positionX, offsetTop: positionY} = chart.canvas;
  
    // Display, position, and set styles for font
    tooltipEl.style.opacity = 1;
    tooltipEl.style.left = positionX + tooltip.caretX + "px";
    tooltipEl.style.top = positionY + tooltip.caretY + "px";
    tooltipEl.style.font = tooltip.options.bodyFont.string;
    tooltipEl.style.padding = tooltip.options.padding + "px " + tooltip.options.padding + "px";
  };

  const options = {
      responsive: true,
      elements: {
          line: {
            tension: 0.4
          }
      },
      scales: {
        y: {
            min: 0,
            max: 400,
            ticks: {
              stepSize: 70,
              font: {
                  size: 16,
                  family: "'Open Sans','Kantumruy'",
              }
            }
        },
        x: {
            ticks: {
                font: {
                    size: 16,
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
                size: 20,
                family: "'Open Sans','Kantumruy'",
                weight: "bold"
              }
          },
          tooltip: {
            enabled: false,
            position: "nearest",
            external: externalTooltipHandler
          }
      },
  };

  const labels = overallSales["dates"].map(value => value + 1);

  const lineData = {
    labels,
    datasets: [
        {
            label: "ចំណូលខែមិថុនា",
            data: overallSales["currentPeriodSales"],
            borderColor: "rgb(53, 162, 235)",
            backgroundColor: "rgba(53, 162, 235)",
            borderWidth: 2.5,
            borderJoinStyle: "round"
        },
    ],
  };
  
  let revenue = getDashboardValue(0, "value");
  revenue = revenue ? revenue : 0;
  let expense = getDashboardValue(3, "value");
  expense = expense ? expense : 0;
  const revenueRisePercentage = getDashboardValue(0, "diffRevenueFromLAstAsPercentag");
  let discount = getDashboardValue(1, "value");
  discount = discount ? discount : 0;
  const diffSaleAsPercentage = getDashboardValue(0, "diffSaleFromLastAsPercentag");
  const mostPopularCategory = _.maxBy(popularCategories, value => value.total);
  const totalSaleOfPopularCategory = mostPopularCategory ? mostPopularCategory.total : 0;

  return (
    <div id="dashboard">
      <div id="navDaskboard">
        <ul>
          <li className="nav-left">
            <div className="nav-title">
              <h4><Translate id="text_dashboard" /></h4>
              <span>Here’s your analytic detail</span>
            </div>
          </li>
          <li className="nav-right">
            <SelectDateOption 
              onChange={onChange}
              value={option}
              style={{width:165}}
            />
          </li>
        </ul>
      </div>
      <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 20]} className="row-out">
        <Col span={12} className="col-in">
          <Row gutter={[16,16]}>
            <Col span={12} className="item">
              <div id="taskDadhboardFirst">
                <Card bordered={false}>
                  <div className='header-task-item'>
                    <div className="icon-left">
                      <Icon type="shopping-cart" />
                    </div>
                    <div className='menu-right'>
                      <Icon type="ellipsis" />
                    </div>
                  </div>
                  <div className="subtitle">
                    <span><Translate id="text_revenue" /></span>
                  </div>
                  <div className="sub-total">
                    <span>{(new Util()).formatCurrency(revenue)}</span>
                  </div>
                  <div className="total-footer">
                    <span style={revenueRisePercentage > 0 ? {} : {color: "red"}}><Icon type={revenueRisePercentage >= 0 ? "rise" : "fall"} />{Math.abs(revenueRisePercentage)}%</span>
                  </div>
                </Card>
              </div>
            </Col>
            <Col span={12}>
              <div id="taskDadhboardFirst">
                <Card bordered={false}>
                  <div className='header-task-item'>
                    <div className="icon-left">
                    <Icon type="tag" />
                    </div>
                    <div className='menu-right'>
                      <Icon type="ellipsis" />
                    </div>
                  </div>
                  <div className="subtitle">
                    <span><Translate id="text_discount" /></span>
                  </div>
                  <div className="sub-total">
                    <span style={{color: "red"}}>{(new Util()).formatCurrency(discount)}</span>
                  </div>
                </Card>
              </div>
            </Col>
            <Col span={12} className="item">
              <div id="taskDadhboardFirst">
                <Card bordered={false}>
                  <div className='header-task-item'>
                    <div className="icon-left">
                      <Icon type="dollar" />
                    </div>
                    <div className='menu-right'>
                      <Icon type="ellipsis" />
                    </div>
                  </div>
                  <div className="subtitle">
                    <span><Translate id="text_net_sale" /></span>
                  </div>
                  <div className="sub-total">
                    <span>{(new Util()).formatCurrency(revenue - discount)}</span>
                  </div>
                  <div className="total-footer">
                    <span style={diffSaleAsPercentage >= 0 ? {} : {color: "red"}}><Icon type={diffSaleAsPercentage >= 0 ? "rise" : "fall"} />{(new Util()).formatCurrency(Math.abs(diffSaleAsPercentage))}</span>
                  </div>
                </Card>
              </div>
            </Col>
            <Col span={12}>
              <div id="taskDadhboardFirst">
                <Card bordered={false}>
                  <div className='header-task-item'>
                    <div className="icon-left">
                      <Icon type="wallet" />
                    </div>
                    <div className='menu-right'>
                      <Icon type="ellipsis" />
                    </div>
                  </div>
                  <div className="subtitle">
                    <span><Translate id="text_total_expense" /></span>
                  </div>
                  <div className="sub-total">
                    <span>{(new Util()).formatCurrency(expense)}</span>
                  </div>
                  <div className="total-footer">
                    <span style={{color: "red"}}><Icon type="rise" />0%</span>
                  </div>
                </Card>
              </div>
            </Col>
          </Row>
        </Col>
        <Col span={12} className="task-line-chart">
          <div id="mainChart">
            <Card bordered={false}>
              <div className="header-task">
                <div className="pull-left">
                  <h4><Translate id="text_overall_sales" /></h4>
                  <div className='sub-left'>
                    <span className="sub-total">{(new Util()).formatCurrency(overallSales.currentPeriodAmount)}</span>
                    <div className="footer-task" style={overallSales.growthAsPercentage >= 0 ? {} : {color: "red"}}>
                      <Icon type="rise" />{Math.abs(overallSales.growthAsPercentage).toFixed(2)}%
                    </div>
                  </div>
                </div>
                <div className="pull-right">
                  <div className="select-pull-right">
                    <SelectDateOption
                      disabled={true}
                      placeholder="Current Month"
                      style={{width: 150}}
                    />
                  </div>
                </div>
              </div>
              <div id="mainLinChart">
                <div style={{height: 300, padding: 20}}>
                  <Line options={options} data={lineData} height={"90%"} />
                </div>
              </div>
            </Card>
          </div>
        </Col>
        <Col span={6} className="item">
          <div id="mainDashboadCategory">
            <Card bordered={false}>
              <div className="header-category">
                <span className="title-category"><Translate id="text_popular_categories" /></span>
              </div>
              <div className="category-progress">
                <ul>
                  {
                    mostPopularCategory ?
                    <li>
                      <div className="label-progress">
                        <ul>
                          <li className="label-left"><span>{mostPopularCategory.name}</span></li>
                          <li className="label-right"><span>{(new Util()).formatCurrency(totalSaleOfPopularCategory)}</span></li>
                        </ul>
                      </div>
                      <Progress percent={100} status="active" />
                    </li>
                    :
                    ""
                  }
                  {
                    popularCategories.filter(value => value.categoryId !== mostPopularCategory.categoryId).map((popularCategory, key) => 
                      <li key={key}>
                        <div className="label-progress">
                          <ul>
                            <li className="label-left"><span>{popularCategory.name}</span></li>
                            <li className="label-right"><span>{(new Util()).formatCurrency(popularCategory.total)}</span></li>
                          </ul>
                        </div>
                        <Progress percent={(popularCategory.total * 100) / totalSaleOfPopularCategory} status="active" />
                      </li>
                    )
                  }
                </ul>
              </div>    
            </Card>
          </div>
        </Col>
        <Col span={18} className="task-line-chart">
          <div id="mainTableList">
            <Card bordered={false}>
              <div className="header-task">
                <span className="title-task"><Translate id="text_top_selling_products" /></span>
                <div className="btn-header-task">
                  <Radio.Group value={topSellType} onChange={onChangeTopSellingType} style={{ marginBottom: 16 }}>
                    <Radio.Button value="quantity">By Quantity</Radio.Button>
                    <Radio.Button value="totalSale">By Total Sale</Radio.Button>
                  </Radio.Group>
                  <div className="select">
                    <Select 
                    defaultValue={25} 
                    style={{ width: 199, 
                    marginLeft: 15 }} 
                    onChange={onChangeTopSellingSize}>
                      <Option value={25}>Top 25 Selling Products</Option>
                      <Option value={50}>Top 50 Selling Products</Option>
                      <Option value={100}>Top 100 Selling Products</Option>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="table-list-product">
                <Table
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
      </Row>
    </div>
  );
};

export default Dashboard;