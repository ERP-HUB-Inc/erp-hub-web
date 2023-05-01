import React, { useEffect } from "react";
import { Translate } from "react-localize-redux";
import { Link } from "react-router-dom";
import {
  Card,
  Col,
  Icon,
  PageHeader,
  Row
} from "antd";
import history from "../../../../common/router/history";
import Util from "../../../../common/util";
import NoPermissionV2 from "../../../../common/components/shares/List/NoPermissionV2";
import PrivilegeService from "../../../services/settings/PrivilegeService";

const permission_module_code = "report";
const permission_code = "stock_report";
const util = new Util();

export default function StockReport() {

  const [isHasAccessPermission, setIsHasAccessPermission] = React.useState(null);

  useEffect(() => {
    if (isHasAccessPermission == null) {
      PrivilegeService.checkPermission(permission_module_code, permission_code)
        .then(({ data }) => setIsHasAccessPermission(data))
        .catch(() => setIsHasAccessPermission(false));
    }
  }, [isHasAccessPermission]);

  return (
    <React.Fragment>
      {util.isNotCheckingPermissionV2(isHasAccessPermission) &&
        (isHasAccessPermission ?
          <div>
            <PageHeader
              style={{
                backgroundColor: "#f7f7f7",
                paddingLeft: 0,
                paddingRight: 0
              }}
              onBack={() => history.goBack()}
              title={<Translate id="text_stock_report" />}
              subTitle=""
            />

            <Row gutter={16} style={{ marginBottom: 15 }}>
              <Col md={8}>
                <Card
                  title={
                    <div>
                      <Icon type="line-chart" style={{ fontSize: 20 }} />
                      <span style={{ marginLeft: 15 }}><Translate id="text_stock_adjustment_report" /></span>
                    </div>
                  }
                  bordered={false}
                >
                  <div className="content">
                    <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                      <li>- the report generate base selected date</li>
                      <li>- includes number of items</li>
                      <li>- show adjustment by employee</li>
                      <li>- able to export to excel file</li>
                      <li style={{ visibility: "hidden" }}>- </li>
                    </ul>
                  </div>
                  <div className="footer">
                    <Link to="/reports/adjustment-report" className="ant-btn"><Translate id="text_view" /></Link>
                  </div>
                </Card>
              </Col>
              <Col md={8}>
                <Card
                  title={
                    <div>
                      <Icon type="line-chart" style={{ fontSize: 20 }} />
                      <span style={{ marginLeft: 15 }}><Translate id="text_consignment_summary" /></span>
                    </div>
                  }
                  bordered={false}
                >
                  <div className="content">
                    <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                      <li>- the report generate base selected date</li>
                      <li>- show total consignment</li>
                      <li>- includes number of items</li>
                      <li>- display consignment from which seller</li>
                      <li>- able to export to excel file</li>
                    </ul>
                  </div>
                  <div className="footer">
                    <Link to="/reports/stock-consignment-summary" className="ant-btn"><Translate id="text_view" /></Link>
                  </div>
                </Card>
              </Col>
              <Col md={8}>
                <Card
                  title={
                    <div>
                      <Icon type="line-chart" style={{ fontSize: 20 }} />
                      <span style={{ marginLeft: 15 }}><Translate id="text_consignment_product" /></span>
                    </div>
                  }
                  bordered={false}>
                  <div className="content">
                    <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                      <li>- show all consignment product</li>
                      <li>- count quantity off consignment</li>
                      <li>- include cost each products</li>
                      <li>- total each consignment product</li>
                      <li>- able to export to excel file</li>
                    </ul>
                  </div>
                  <div className="footer">
                    <Link to="/reports/stock-consignment-product" className="ant-btn"><Translate id="text_view" /></Link>
                  </div>
                </Card>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col md={8}>
                <Card
                  title={
                    <div>
                      <Icon type="line-chart" style={{ fontSize: 20 }} />
                      <span style={{ marginLeft: 15 }}><Translate id="text_movement_log_report" /></span>
                    </div>
                  }
                  bordered={false}>
                  <div className="content">
                    <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                      <li>- show all consignment product</li>
                      <li>- count quantity off consignment</li>
                      <li>- include cost each products</li>
                      <li>- total each consignment product</li>
                      <li>- able to export to excel file</li>
                    </ul>
                  </div>
                  <div className="footer">
                    <Link to="/reports/stock-movement-log-report" className="ant-btn"><Translate id="text_view" /></Link>
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
          :
          <NoPermissionV2 />
        )
      }
    </React.Fragment>
  );
}