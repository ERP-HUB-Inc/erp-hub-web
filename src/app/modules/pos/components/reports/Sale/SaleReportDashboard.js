import React, {useEffect} from "react";
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
import { Translate } from "react-localize-redux";
import Util from "../../../../common/util";
import NoPermissionV2 from "../../../../common/components/shares/List/NoPermissionV2";
import PrivilegeService from "../../../services/settings/PrivilegeService";

const permission_module_code    = "report";
const permission_code           = "sales_report";
const util                      = new Util();

export default function SaleReportDashboard() {

    const [isHasAccessPermission, setIsHasAccessPermission] = React.useState(null);

    useEffect(()=>{
        if (isHasAccessPermission == null){
            PrivilegeService.checkPermission(permission_module_code, permission_code)
                .then(({data}) => setIsHasAccessPermission(data))
                .catch(() => setIsHasAccessPermission(false));
        }
    }, [isHasAccessPermission]);

    return (
        <React.Fragment>
            {util.isNotCheckingPermissionV2(isHasAccessPermission) &&
                (isHasAccessPermission ?
                    <div id="sale-report-dashboard">
                        <PageHeader
                            style={{
                                backgroundColor: "#f7f7f7",
                                paddingLeft: 0,
                                paddingRight: 0
                            }}
                            onBack={() => history.goBack()}
                            title={<Translate id="text_sale_report" />}
                            subTitle=""
                        />
                        <Row gutter={16} style={{marginBottom: 15}}>
                            <Col span={8}>
                                <Card
                                    title={
                                        <div>
                                            <Icon type="line-chart" style={{fontSize: 20}}/>
                                            <span style={{marginLeft: 15}}><Translate id="text_sale_summary"/></span>
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
                                        <Link to="/reports/sale_summaries" className="ant-btn">
                                            <Translate id="text_view"/>
                                        </Link>
                                    </div>
                                </Card>
                            </Col>
                            <Col span={8}>
                                <Card title={<div>
                                    <Icon type="line-chart" style={{fontSize: 20}}/>
                                    <span style={{marginLeft: 15}}>
                    <Translate id="text_sale_product_summary"/>
                </span>
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
                                        <Link to="/reports/sold_products" className="ant-btn">
                                            <Translate id="text_view"/>
                                        </Link>
                                    </div>
                                </Card>
                            </Col>
                            <Col span={8}>
                                <Card
                                    title={
                                        <div>
                                            <Icon type="line-chart" style={{fontSize: 20}}/>
                                            <span style={{marginLeft: 15}}><Translate id="text_sale_categories_summary"/></span>
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
                                        <Link to="/reports/sold_categories" className="ant-btn">
                                            <Translate id="text_view"/>
                                        </Link>
                                    </div>
                                </Card>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={8}>
                                <Card
                                    title={
                                        <div>
                                            <Icon type="line-chart" style={{fontSize: 20}}/>
                                            <span style={{marginLeft: 15}}><Translate id="text_sale_cashiers_summary"/></span>
                                        </div>
                                    }
                                    bordered={false}>
                                    <div className="content">
                                        <ul style={{listStyle: "none", paddingLeft: 0}}>
                                            <li>- group sold products by cashier</li>
                                            <li>- count sold quantity by cashier</li>
                                            <li>- display revenue by cashier</li>
                                            <li>- include cogs by cashier</li>
                                            <li>- include profit by cashier</li>
                                        </ul>
                                    </div>
                                    <div className="footer">
                                        <Link to="/reports/sold_cashiers" className="ant-btn">
                                            <Translate id="text_view"/>
                                        </Link>
                                    </div>
                                </Card>
                            </Col>
                            <Col span={8}>
                                <Card
                                    title={
                                        <div>
                                            <Icon type="line-chart" style={{fontSize: 20}}/>
                                            <span style={{marginLeft: 15}}><Translate id="text_sale_customers_summary"/></span>
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
                                        <Link to="/reports/sold_customers" className="ant-btn">
                                            <Translate id="text_view"/>
                                        </Link>
                                    </div>
                                </Card>
                            </Col>
                            <Col span={8}>
                                <Card
                                    title={
                                        <div>
                                            <Icon type="line-chart" style={{fontSize: 20}}/>
                                            <span style={{marginLeft: 15}}><Translate id="text_sale_locations_summary"/></span>
                                        </div>
                                    }
                                    bordered={false}>
                                    <div className="content">
                                        <ul style={{listStyle: "none", paddingLeft: 0}}>
                                            <li>- group sold products by location</li>
                                            <li>- count sold quantity by location</li>
                                            <li>- display revenue by location</li>
                                            <li>- include cogs by location</li>
                                            <li>- include profit by location</li>
                                        </ul>
                                    </div>
                                    <div className="footer">
                                        <Link to="/reports/sold_locations" className="ant-btn">
                                            <Translate id="text_view"/>
                                        </Link>
                                    </div>
                                </Card>
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