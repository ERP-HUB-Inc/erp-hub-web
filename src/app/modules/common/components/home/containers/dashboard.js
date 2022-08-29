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
import { Chart, registerables } from "chart.js";
import { Line } from "react-chartjs-2";
import "../index.css";
import InventoryService from "../../../../pos/services/report/InventoryService";
import SelectDateOption from "../../SelectDateOption";
Chart.register(...registerables);

const { Option } = Select;
const columns = [
  {
    title: "Product Name",
    dataIndex: "productName",
    key: "productName",
  },
  {
    title: "Barcode",
    dataIndex: "barcode",
    key: "barcode",
  },
  {
    title: "Sold",
    dataIndex: "sold",
    key: "sold",
  },
  {
    title: "Total",
    dataIndex: "total",
    key: "total",
  },
];

const data = [
  {
    key: "1",
    productName: "Sengha Gold 490ml កំប៉ុង​(12) កេស",
    barcode: "8850999016573",
    sold: "500 Box",
    total: "$527.30$",
  },
  {
    key: "2",
    productName: "Meiji Yoghurt ប្រទាល",
    barcode: "8850329351015",
    sold: "50 Box",
    total: "$230.20$",
  },
  {
    key: "3",
    productName: "Koh-Kae 115ml កំប៉ុង",
    barcode: "8850329351015",
    sold: "40 Pcs",
    total: "$200.00",
  },
  {
    key: "4",
    productName: "Koh-Kae 115ml កំប៉ុង",
    barcode: "8852023665870",
    sold: "30 Box",
    total: "$200.00",
  },
  {
    key: "5",
    productName: "Koh-Kae 115ml កំប៉ុង",
    barcode: "8852023665870",
    sold: "25 Box",
    total: "$200.00",
  },
];
const Dashboard = (props) => {
  const [topSellingSize, setTopSellingSize] = React.useState(25);
  const [topSellType, setTopSellType] = React.useState("quantity");
  function onChange(value) {
    console.log(`selected ${value}`);
  }


  const fetchPopularProducts = (limit, popularBy) => {
    InventoryService.getPopularProduct(limit, popularBy)
    .then(response => {
      if (response.data) {
        //
      }
    })
  };
  const onChangeTopSellingType = (e) => {
    setTopSellType(e.target.value);
    fetchPopularProducts(topSellingSize, e.target.value);
  };

  const onChangeTopSellingSize = (value) => {
    setTopSellingSize(value);
    fetchPopularProducts(value, topSellType);
  };

  React.useEffect(() => {
    InventoryService.getInventoryDashboard()
    .then(response => {
      if (response.data) {
        //
      }
    });

    fetchPopularProducts(topSellingSize);

    InventoryService.getTodayPurchase()
    .then(response => {
      if (response.data) {
        //
      }
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
            max: 500,
            ticks: {
                font: {
                    // size: 14,
                    family: "'Open Sans','Kantumruy'",
                }
            }
        },
        x: {
            ticks: {
                font: {
                    // size: 14,
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

  const labels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];

  const lineData = {
    labels,
    datasets: [
        {
            label: "ចំណូលខែឧសភា",
            data: [
              172.347,
              202.002,
              278.034,
              120.85,
              220.207,
              219.429,
              334.08,
              140.837,
              177.412,
              361.489,
              170.374,
              194.366,
              394.283,
              341.333,
              189.794,
              138.535,
              205.48,
              247.891,
              221.407,
              201.536,
              72.2175,
              202.61,
              172.98,
              246.562,
              192.045,
              239.33,
              223.706,
              90.8725,
              131.39,
              278.301,
              0
            ],
            borderColor: "#f0f0f0",
            backgroundColor: "#f0f0f0",
            borderWidth: 2.5,
            borderDash: [5, 3],
            borderJoinStyle: "round"
        },
        {
            label: "ចំណូលខែមិថុនា",
            data: [
              220.652,
              148.26,
              192.574,
              0,
              0,
              284.59,
              196.06,
              192.65,
              167.167,
              221.936,
              247.721,
              92.21,
              119.903,
              107.327,
              95.6275,
              67.66,
              112.841,
              89.84,
              27.55,
              7.9515,
              54.16,
              139.67,
              76.2659,
              170.28,
              178.729,
              91.85,
              186.985,
              116.48,
              128.4,
              196.13
            ],
            borderColor: "rgb(53, 162, 235)",
            backgroundColor: "rgba(53, 162, 235)",
            borderWidth: 2.5,
            borderJoinStyle: "round"
        },
    ],
  };

  return (
    <div id="dashboard">
      <div id="navDaskboard">
        <ul>
          <li className="nav-left">
            <div className="nav-title">
              <h4>Dashboard</h4>
              <span>Here’s your analytic detail</span>
            </div>
          </li>
          <li className="nav-right">
            <SelectDateOption 
              onChange={onChange}
              placeholder="Select Location"
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
                    <span>Revenue</span>
                  </div>
                  <div className="sub-total">
                    <span>$360.98</span>
                  </div>
                  <div className="total-footer">
                    <span><Icon type="rise" />12.25%</span>
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
                    <span>Discount</span>
                  </div>
                  <div className="sub-total">
                    <span>$150.70</span>
                  </div>
                  <div className="total-footer">
                    <span><Icon type="rise" />12.25%</span>
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
                    <span>Nets Sales</span>
                  </div>
                  <div className="sub-total">
                    <span>$8.44</span>
                  </div>
                  <div className="total-footer">
                    <span><Icon type="rise" />12.25%</span>
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
                    <span>Total Expense</span>
                  </div>
                  <div className="sub-total">
                    <span>$234.40</span>
                  </div>
                  <div className="total-footer">
                    <span style={{color: "red"}}><Icon type="fall" />12.25%</span>
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
                  <h4>Overall Sales</h4>
                  <div className='sub-left'>
                    <span className="sub-total">$1560.98</span>
                    <div className="footer-task">
                      <Icon type="rise" />12.25%
                    </div>
                  </div>
                </div>
                <div className="pull-right">
                  <div className="select-pull-right">
                    <SelectDateOption 
                      placeholder="Current Month"
                      style={{width: 150}}
                    />
                  </div>
                </div>
              </div>
              <div id="mainLinChart">
                <div style={{height: 300, padding: 20}}>
                  <Line options={options} data={lineData} />
                </div>
              </div>
            </Card>
          </div>
        </Col>
        <Col span={6} className="item">
          <div id="mainDashboadCategory">
            <Card bordered={false}>
              <div className="header-category">
                <span className="title-category">Popular Category</span>
              </div>
              <div className="category-progress">
                <ul>
                  <li>
                    <div className="label-progress">
                      <ul>
                        <li className="label-left"><span>Beer</span></li>
                        <li className="label-right"><span>$734.40</span></li>
                      </ul>
                    </div>
                    <Progress percent={10} status="active" />
                  </li>
                  <li>
                    <div className="label-progress">
                      <ul>
                        <li className="label-left"><span>Drink</span></li>
                        <li className="label-right"><span>$734.40</span></li>
                      </ul>
                    </div>
                    <Progress percent={30} status="active" />
                  </li>
                  <li>
                    <div className="label-progress">
                      <ul>
                        <li className="label-left"><span>Milk</span></li>
                        <li className="label-right"><span>$734.40</span></li>
                      </ul>
                    </div>
                    <Progress percent={20} status="active" />
                  </li>
                  <li>
                    <div className="label-progress">
                      <ul>
                        <li className="label-left"><span>Care</span></li>
                        <li className="label-right"><span>$734.40</span></li>
                      </ul>
                    </div>
                    <Progress percent={40} status="active" />
                  </li>
                  <li>
                    <div className="label-progress">
                      <ul>
                        <li className="label-left"><span>Food</span></li>
                        <li className="label-right"><span>$734.40</span></li>
                      </ul>
                    </div>
                    <Progress percent={60} status="active" />
                  </li>
                  <li>
                    <div className="label-progress">
                      <ul>
                        <li className="label-left"><span>Tea</span></li>
                        <li className="label-right"><span>$734.40</span></li>
                      </ul>
                    </div>
                    <Progress percent={70} status="active" />
                  </li>
                  <li>
                    <div className="label-progress">
                      <ul>
                        <li className="label-left"><span>Coffee</span></li>
                        <li className="label-right"><span>$734.40</span></li>
                      </ul>
                    </div>
                    <Progress percent={80} status="active" />
                  </li>
                </ul>
              </div>    
            </Card>
          </div>
        </Col>
        <Col span={18} className="task-line-chart">
          <div id="mainTableList">
            <Card bordered={false}>
              <div className="header-task">
                <span className="title-task">Top Salling Products</span>
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
                <Table columns={columns} dataSource={data} pagination={false}/>
              </div>
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;