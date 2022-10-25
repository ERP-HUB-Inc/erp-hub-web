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
import PrivilegeAction from "../../../action/settings/privilege";
import NoPermissionV2 from "../../../../common/components/shares/List/NoPermissionV2";

const permission_module_code = "report";
const permission_code = "purchase_report";


function PurchaseReportDashboard(props) {

    const util = new Util();

    useEffect(()=>{
        props.dispatch(PrivilegeAction.checkPermission());
    }, []);

    return (
        <React.Fragment>
            { !util.isCheckingPermission(props) &&
            (util.checkIfHasAccessPermission( permission_module_code, permission_code, props.checkPermission.response) ?
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