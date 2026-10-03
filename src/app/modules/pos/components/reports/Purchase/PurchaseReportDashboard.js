import React, {useEffect} from "react";
import { connect } from "react-redux";
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
import Util from "../../../../common/util";
import NoPermissionV2 from "../../../../common/components/shares/List/NoPermission";
import PrivilegeService from "../../../services/settings/PrivilegeService";

const permission_module_code = "report";
const permission_code        = "purchase_report";
const util                   = new Util();

function PurchaseReportDashboard() {
    
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
                    <div id="purchase-report-dashboard">
                        <PageHeader
                            style={{
                                backgroundColor: "#f7f7f7",
                                paddingLeft: 0,
                                paddingRight: 0
                            }}
                            onBack={() => history.goBack()}
                            title="Purchase Report"
                            subTitle=""
                        />
                        <Row gutter={16} style={{marginBottom: 15}}>
                            <Col span={8}>
                                <Card
                                    title={
                                        <div>
                                            <Icon type="dashboard" style={{fontSize: 20}} />
                                            <span style={{marginLeft: 15}}>Purchase Report</span>
                                        </div>
                                    }
                                    bordered={false}>
                                    <div className="content">
                                        <ul style={{listStyle: "none", paddingLeft: 0}}>
                                            <li>- view purchase summary and trends</li>
                                            <li>- filter by date, supplier and location</li>
                                            <li>- review purchased products</li>
                                            <li>- compare purchase with sales</li>
                                            <li>- include price increase and overstock risk</li>
                                        </ul>
                                    </div>
                                    <div className="footer">
                                        <Link to="/reports/purchase-report" className="ant-btn">View</Link>
                                    </div>
                                </Card>
                            </Col>
                            <Col span={8}>
                                <Card
                                    title={
                                        <div>
                                            <Icon type="line-chart" style={{fontSize: 20}} />
                                            <span style={{marginLeft: 15}}>Summary</span>
                                        </div>
                                    }
                                    bordered={false}>
                                    <div className="content">
                                        <ul style={{listStyle: "none", paddingLeft: 0}}>
                                            <li>- the report generate base selected date</li>
                                            <li>- show total purchase</li>
                                            <li>- includes number of items</li>
                                            <li>- display purchase from which supplier</li>
                                            <li>- able to export to excel file</li>
                                        </ul>
                                    </div>
                                    <div className="footer">
                                        <Link to="/reports/purchase_summaries" className="ant-btn">View</Link>
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
                                            <li>- show all purchased products</li>
                                            <li>- count quantity of purchased</li>
                                            <li>- include cost each products</li>
                                            <li>- total each purchased product</li>
                                            <li>- able to export to excel file</li>
                                        </ul>
                                    </div>
                                    <div className="footer">
                                        <Link to="/reports/purchased_products" className="ant-btn">View</Link>
                                    </div>
                                </Card>
                            </Col>
                            <Col span={8}>
                                <Card
                                    title={
                                        <div>
                                            <Icon type="line-chart" style={{fontSize: 20}} />
                                            <span style={{marginLeft: 15}}>Supplier</span>
                                        </div>
                                    }
                                    bordered={false}>
                                    <div className="content">
                                        <ul style={{listStyle: "none", paddingLeft: 0}}>
                                            <li>- show all purchased suppliers</li>
                                            <li>- count quantity of purchased</li>
                                            <li>- include cost each products</li>
                                            <li>- total each purchased product</li>
                                            <li>- able to export to excel file</li>
                                        </ul>
                                    </div>
                                    <div className="footer">
                                        <Link to="/reports/purchased_suppliers" className="ant-btn">View</Link>
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

function mapStateToProps(state) {
    return {
      locale: state.locale
    };
}

export default connect(mapStateToProps)(PurchaseReportDashboard);
