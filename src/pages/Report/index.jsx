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
import { Translate } from "@redux/index";

export default function SaleReportCenter() {
    return (
        <React.Fragment>
            <div id="sale-report-center">
                <PageHeader
                    style={{
                        paddingLeft: 0,
                        paddingRight: 0
                    }}
                    title={<Translate id="text_sale_report_center" />}
                    subTitle=""
                />
                <Row gutter={25} style={{ marginBottom: 15 }}>
                    <Col
                        xs={{ span: 24 }}
                        sm={{ span: 24 }}
                        md={{ span: 12 }}
                        lg={{ span: 12 }}
                        style={{ marginBottom: 25 }}
                    >
                        <Card
                            title={
                                <div>
                                    <Icon type="line-chart" style={{ fontSize: 20 }} />
                                    <span style={{ marginLeft: 15 }}><Translate id="text_sale_summary" /></span>
                                </div>
                            }
                            bordered={false}>
                            <div className="content">
                                <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                                    <li>- the report generate base selected date</li>
                                    <li>- show total revenue</li>
                                    <li>- includes cost of goods sold</li>
                                    <li>- display gross profit</li>
                                    <li>- able to export to csv file</li>
                                </ul>
                            </div>
                            <div className="footer">
                                <Link to="/reports/sale_summaries" className="ant-btn">
                                    <Translate id="text_view" />
                                </Link>
                            </div>
                        </Card>
                    </Col>
                    <Col
                        xs={{ span: 24 }}
                        sm={{ span: 24 }}
                        md={{ span: 12 }}
                        lg={{ span: 12 }}
                        style={{ marginBottom: 25 }}
                    >
                        <Card title={<div>
                            <Icon type="line-chart" style={{ fontSize: 20 }} />
                            <span style={{ marginLeft: 15 }}>
                                <Translate id="text_sale_product_summary" />
                            </span>
                        </div>} bordered={false}>
                            <div className="content">
                                <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                                    <li>- show all sold products</li>
                                    <li>- count sold quantity</li>
                                    <li>- revenue each sold products</li>
                                    <li>- cogs each sold product</li>
                                    <li>- gross profit of product</li>
                                </ul>
                            </div>
                            <div className="footer">
                                <Link to="/reports/sold_products" className="ant-btn">
                                    <Translate id="text_view" />
                                </Link>
                            </div>
                        </Card>
                    </Col>
                    <Col
                        xs={{ span: 24 }}
                        sm={{ span: 24 }}
                        md={{ span: 12 }}
                        lg={{ span: 12 }}
                        style={{ marginBottom: 25 }}
                    >
                        <Card title={<div>
                            <Icon type="line-chart" style={{ fontSize: 20 }} />
                            <span style={{ marginLeft: 15 }}>
                                <Translate id="text_sales_receipt" />
                            </span>
                        </div>} bordered={false}>
                            <div className="content">
                                <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                                    <li>- show all sold products</li>
                                    <li>- count sold quantity</li>
                                    <li>- revenue each sold products</li>
                                    <li>- cogs each sold product</li>
                                    <li>- gross profit of product</li>
                                </ul>
                            </div>
                            <div className="footer">
                                <Link to="/reports/sales-report-receipt" className="ant-btn">
                                    <Translate id="text_view" />
                                </Link>
                            </div>
                        </Card>
                    </Col>
                    <Col
                        xs={{ span: 24 }}
                        sm={{ span: 24 }}
                        md={{ span: 12 }}
                        lg={{ span: 12 }}
                        style={{ marginBottom: 25 }}
                    >
                        <Card
                            title={
                                <div>
                                    <Icon type="line-chart" style={{ fontSize: 20 }} />
                                    <span style={{ marginLeft: 15 }}><Translate id="text_sale_categories_summary" /></span>
                                </div>
                            }
                            bordered={false}>
                            <div className="content">
                                <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                                    <li>- group sold products by category</li>
                                    <li>- count sold quantity by category</li>
                                    <li>- display revenue by category</li>
                                    <li>- include cogs by category</li>
                                    <li>- include profit by category</li>
                                </ul>
                            </div>
                            <div className="footer">
                                <Link to="/reports/sold_categories" className="ant-btn">
                                    <Translate id="text_view" />
                                </Link>
                            </div>
                        </Card>
                    </Col>
                    <Col
                        xs={{ span: 24 }}
                        sm={{ span: 24 }}
                        md={{ span: 12 }}
                        lg={{ span: 12 }}
                        style={{ marginBottom: 25 }}
                    >
                        <Card
                            title={
                                <div>
                                    <Icon type="line-chart" style={{ fontSize: 20 }} />
                                    <span style={{ marginLeft: 15 }}><Translate id="text_sale_cashiers_summary" /></span>
                                </div>
                            }
                            bordered={false}>
                            <div className="content">
                                <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                                    <li>- group sold products by cashier</li>
                                    <li>- count sold quantity by cashier</li>
                                    <li>- display revenue by cashier</li>
                                    <li>- include cogs by cashier</li>
                                    <li>- include profit by cashier</li>
                                </ul>
                            </div>
                            <div className="footer">
                                <Link to="/reports/sold_cashiers" className="ant-btn">
                                    <Translate id="text_view" />
                                </Link>
                            </div>
                        </Card>
                    </Col>
                    <Col
                        xs={{ span: 24 }}
                        sm={{ span: 24 }}
                        md={{ span: 12 }}
                        lg={{ span: 12 }}
                        style={{ marginBottom: 25 }}
                    >
                        <Card
                            title={
                                <div>
                                    <Icon type="line-chart" style={{ fontSize: 20 }} />
                                    <span style={{ marginLeft: 15 }}><Translate id="text_sale_customers_summary" /></span>
                                </div>
                            }
                            bordered={false}>
                            <div className="content">
                                <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                                    <li>- view report base on date</li>
                                    <li>- display customer name,phone number,address</li>
                                    <li>- include number of order</li>
                                    <li>- total sale amount by customer</li>
                                    <li>- include cogs by category</li>
                                </ul>
                            </div>
                            <div className="footer">
                                <Link to="/reports/sold_customers" className="ant-btn">
                                    <Translate id="text_view" />
                                </Link>
                            </div>
                        </Card>
                    </Col>
                    <Col
                        xs={{ span: 24 }}
                        sm={{ span: 24 }}
                        md={{ span: 12 }}
                        lg={{ span: 12 }}
                        xl={{ span: 12 }}
                        style={{ marginBottom: 25 }}
                    >
                        <Card
                            title={
                                <div>
                                    <Icon type="line-chart" style={{ fontSize: 20 }} />
                                    <span style={{ marginLeft: 15 }}><Translate id="text_sale_locations_summary" /></span>
                                </div>
                            }
                            bordered={false}>
                            <div className="content">
                                <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                                    <li>- group sold products by location</li>
                                    <li>- count sold quantity by location</li>
                                    <li>- display revenue by location</li>
                                    <li>- include cogs by location</li>
                                    <li>- include profit by location</li>
                                </ul>
                            </div>
                            <div className="footer">
                                <Link to="/reports/sold_locations" className="ant-btn">
                                    <Translate id="text_view" />
                                </Link>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        </React.Fragment>
    );
}