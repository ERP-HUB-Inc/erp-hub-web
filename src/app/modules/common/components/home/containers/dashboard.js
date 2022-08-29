import React from 'react';
import { 
  Row, 
  Col,
  Card,
  Icon,
  Progress,
  Select,
  Radio,
  Table
} from 'antd';
import "../index.css";
// import { LineChart } from './lineChart';

const { Option } = Select;
const columns = [
  {
    title: 'Product Name',
    dataIndex: 'productName',
    key: 'productName',
  },
  {
    title: 'Barcode',
    dataIndex: 'barcode',
    key: 'barcode',
  },
  {
    title: 'Sold',
    dataIndex: 'sold',
    key: 'sold',
  },
  {
    title: 'Total',
    dataIndex: 'total',
    key: 'total',
  },
];

const data = [
  {
    key: '1',
    productName: 'Sengha Gold 490ml កំប៉ុង​(12) កេស',
    barcode: "8850999016573",
    sold: `500 Box`,
    total: `$527.30$`,
  },
  {
    key: '2',
    productName: 'Meiji Yoghurt ប្រទាល',
    barcode: "8850329351015",
    sold: `50 Box`,
    total: `$230.20$`,
  },
  {
    key: '3',
    productName: 'Koh-Kae 115ml កំប៉ុង',
    barcode: "8850329351015",
    sold: `40 Pcs`,
    total: `$200.00`,
  },
  {
    key: '4',
    productName: 'Koh-Kae 115ml កំប៉ុង',
    barcode: "8852023665870",
    sold: `30 Box`,
    total: `$200.00`,
  },
  {
    key: '5',
    productName: 'Koh-Kae 115ml កំប៉ុង',
    barcode: "8852023665870",
    sold: `25 Box`,
    total: `$200.00`,
  },
];
const Dashboard = () => {
 
  function onChange(value) {
    console.log(`selected ${value}`);
  }

  function onBlur() {
    console.log('blur');
  }

  function onFocus() {
    console.log('focus');
  }

  function onSearch(val) {
    console.log('search:', val);
  }
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
            <Select
                showSearch
                style={{ width: 200 }}
                placeholder="Select loaction"
                optionFilterProp="children"
                onChange={onChange}
                onFocus={onFocus}
                onBlur={onBlur}
                onSearch={onSearch}
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                <Option value="jack">Jack</Option>
                <Option value="lucy">Lucy</Option>
                <Option value="tom">Tom</Option>
              </Select>
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
                      <Icon type="credit-card" />
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
                      <Icon type="environment" />
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
                    <span><Icon type="rise" />12.25%</span>
                  </div>
                </div>
                <div className="pull-right">
                  <div className="select-pull-right">
                    <Select
                      showSearch
                      style={{ width: 200 }}
                      placeholder="Select loaction"
                      optionFilterProp="children"
                      onChange={onChange}
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onSearch={onSearch}
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      <Option value="jack">Jack</Option>
                      <Option value="lucy">Lucy</Option>
                      <Option value="tom">Tom</Option>
                    </Select>
                  </div>
                </div>
              </div>
              <div id="mainLinChart">
                {/* <LineChart /> */}
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
                  <Radio.Group onChange={onChange} defaultValue="a">
                    <Radio.Button value="a">By Quantity</Radio.Button>
                    <Radio.Button value="b">By Total Sale</Radio.Button>
                  </Radio.Group>
                  <div className="select">
                    <Select
                        showSearch
                        style={{ width: 200 }}
                        placeholder="Select loaction"
                        optionFilterProp="children"
                        onChange={onChange}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        onSearch={onSearch}
                        filterOption={(input, option) =>
                          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        <Option value="jack">Jack</Option>
                        <Option value="lucy">Lucy</Option>
                        <Option value="tom">Tom</Option>
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
  )
}

export default Dashboard