import React from "react";
import {
  PageHeader,
  Card,
  Row,
  Col,
  Icon
} from "antd";
import {
    Link
} from "react-router-dom";
import "./index.css";
import history from "../../../../common/router/history";

export default function SaleReportDashboard() {
    return <div id="sale-report-dashboard">
        <PageHeader
            style={{
                backgroundColor: "#f7f7f7",
                paddingLeft: 0,
                paddingRight: 0
            }}
            onBack={() => history.goBack()}
            title="Sale Report"
            subTitle=""
            />
        <Row gutter={16} style={{marginBottom: 15}}>
            <Col span={8}>
                <Card
                    title={
                        <div>
                            <Icon type="line-chart" style={{fontSize: 20}} />
                            <span style={{marginLeft: 15}}>Sale Summary</span>
                        </div>
                    }
                    bordered={false}>
                    <div className="content">
                        <ul style={{listStyle: "none", paddingLeft: 0}}>
                            <li>- the report generate base selected date</li>
                            <li>- show total revenue</li>
                            <li>- includes cost of goods sold</li>
                            <li>- display gross profit</li>
                            <li>- able to export to csv file</li>
                        </ul>
                    </div>
                    <div className="footer">
                        <Link to="/reports/sale_summaries" className="ant-btn">View</Link>
                    </div>
                </Card>
            </Col>
            <Col span={8}>
                <Card title={<div>
                    <Icon type="line-chart" style={{fontSize: 20}} />
                    <span style={{marginLeft: 15}}>Products</span>
                </div>} bordered={false}>
                    <div className="content">
                        <ul style={{listStyle: "none", paddingLeft: 0}}>
                            <li>- show all sold products</li>
                            <li>- count sold quantity</li>
                            <li>- revenue each sold products</li>
                            <li>- cogs each sold product</li>
                            <li>- gross profit of product</li>
                        </ul>
                    </div>
                    <div className="footer">
                        <Link to="/reports/sold_products" className="ant-btn">View</Link>
                    </div>
                </Card>
            </Col>
            <Col span={8}>
                <Card
                    title={
                        <div>
                            <Icon type="line-chart" style={{fontSize: 20}} />
                            <span style={{marginLeft: 15}}>Categories</span>
                        </div>
                    }
                    bordered={false}>
                    <div className="content">
                        <ul style={{listStyle: "none", paddingLeft: 0}}>
                            <li>- group sold products by category</li>
                            <li>- count sold quantity by category</li>
                            <li>- display revenue by category</li>
                            <li>- include cogs by category</li>
                            <li>- include profit by category</li>
                        </ul>
                    </div>
                    <div className="footer">
                        <Link to="/reports/sold_categories" className="ant-btn">View</Link>
                    </div>
                </Card>
            </Col>
        </Row>
        <Row gutter={16}>
            <Col span={8}>
                <Card
                    title={
                        <div>
                            <Icon type="line-chart" style={{fontSize: 20}} />
                            <span style={{marginLeft: 15}}>Cashiers</span>
                        </div>
                    }
                    bordered={false}>
                    <div className="content">
                        <ul style={{listStyle: "none", paddingLeft: 0}}>
                            <li>- group sold products by category</li>
                            <li>- count sold quantity by category</li>
                            <li>- display revenue by category</li>
                            <li>- include cogs by category</li>
                            <li>- include profit by category</li>
                        </ul>
                    </div>
                    <div className="footer">
                        <Link to="/reports/sold_cashiers" className="ant-btn">View</Link>
                    </div>
                </Card>
            </Col>
            <Col span={8}>
                <Card
                    title={
                        <div>
                            <Icon type="line-chart" style={{fontSize: 20}} />
                            <span style={{marginLeft: 15}}>Customers</span>
                        </div>
                    }
                    bordered={false}>
                    <div className="content">
                        <ul style={{listStyle: "none", paddingLeft: 0}}>
                            <li>- view report base on date</li>
                            <li>- display customer name,phone number,address</li>
                            <li>- include number of order</li>
                            <li>- total sale amount by customer</li>
                            <li>- include cogs by category</li>
                        </ul>
                    </div>
                    <div className="footer">
                        <Link to="/reports/sold_customers" className="ant-btn">View</Link>
                    </div>
                </Card>
            </Col>
            <Col span={8}>
                <Card
                    title={
                        <div>
                            <Icon type="line-chart" style={{fontSize: 20}} />
                            <span style={{marginLeft: 15}}>Locations</span>
                        </div>
                    }
                    bordered={false}>
                    <div className="content">
                        <ul style={{listStyle: "none", paddingLeft: 0}}>
                            <li>- group sold products by category</li>
                            <li>- count sold quantity by category</li>
                            <li>- display revenue by category</li>
                            <li>- include cogs by category</li>
                            <li>- include profit by category</li>
                        </ul>
                    </div>
                    <div className="footer">
                        <Link to="/reports/sold_locations" className="ant-btn">View</Link>
                    </div>
                </Card>
            </Col>
        </Row>
    </div>;
}