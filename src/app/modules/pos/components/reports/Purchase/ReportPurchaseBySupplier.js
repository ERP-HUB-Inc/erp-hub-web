import React from "react";
import { connect } from "react-redux";
import {
  PageHeader,
  Table,
  DatePicker,
  Row,
  Col
} from "antd";
import moment from "moment";
import { Translate } from "react-localize-redux";
import history from "../../../../common/router/history";
import Util from "../../../../common/util";
import PurchaseService from "../../../services/report/PurchaseService";
import "./index.css";

function ReportPurchaseBySupplier() {
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [fromValue, setFromValue] = React.useState(moment().startOf("month"));
  const [toValue, setToValue] = React.useState(moment().endOf("month"));

  const onFromChange = value => {
      setFromValue(value);
      setToValue(value);
      fetchReport(value, value);
  };

  const onToChange = value => {
      setToValue(value);
      fetchReport(fromValue, value);
  };

  const fetchReport = (from, to) => {
    setLoading(true);
    PurchaseService.getReportSummaryBySupplier({startDate: from.format("YYYY-MM-DD"), endDate: to.format("YYYY-MM-DD")})
    .then(response => {
      if (response.data) {
        setData(response.data);
      }
    })
    .finally(() => {
      setLoading(false);
    });
  };

  React.useEffect(() => {
    fetchReport(fromValue, toValue);
    //eslint-disable-next-line
  }, []);

  return <div id="report-purchase">
    <PageHeader
      style={{
          backgroundColor: "#f7f7f7",
          paddingLeft: 0,
          paddingRight: 0
      }}
      onBack={() => history.goBack()}
      title="Suppleir Report"
      subTitle=""
      extra={[
        <div style={{display: "flex"}}>
          <DatePicker
              format="DD/MM/YYYY"
              value={fromValue}
              placeholder="From"
              onChange={onFromChange}
              />
          <DatePicker
              format="DD/MM/YYYY"
              value={toValue}
              placeholder="To"
              onChange={onToChange}
              style={{marginLeft: 15}}
              />
        </div>
      ]}
      />
      <Row gutter={16}>
        <Col span={24}>
          <Table
            rowKey="supplierId"
            dataSource={data}
            columns={[
              {
                title: "#",
                dataIndex: "name",
                key: "no",
                width: 90,
                render: (text, record, index) => index + 1
              },
              {
                title: <Translate id="text_date" />,
                dataIndex: "date",
                key: "date",
                width: 200,
                render: date => (new Util()).formatDate(date, "DD/MM/YYYY")
              },
              {
                title: <Translate id="text_supplier" />,
                dataIndex: "supplierName",
                key: "supplierName"
              },
              {
                title: <Translate id="text_total" />,
                dataIndex: "total",
                key: "total",
                align: "right",
                render: total => (new Util()).formatCurrency(total)
              }
            ]}
            pagination={false}
            loading={loading}
            />
        </Col>
      </Row>
  </div>;
}

function mapStateToProps(state) {
    return {
      locale: state.locale
    };
}

export default connect(mapStateToProps)(ReportPurchaseBySupplier);