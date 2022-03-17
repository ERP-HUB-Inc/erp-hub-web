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
import ReportSaleService from "../../../services/report/SaleService";

function ReportSaleByCustomer() {
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState(null);
  const [fromValue, setFromValue] = React.useState(moment());
  const [toValue, setToValue] = React.useState(moment());

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
    ReportSaleService.getReportSummaryByCustomer({startDate: from.format("YYYY-MM-DD"), endDate: to.format("YYYY-MM-DD")})
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

  return <div id="report-sale">
    <PageHeader
      style={{
          backgroundColor: "#f7f7f7",
          paddingLeft: 0,
          paddingRight: 0
      }}
      onBack={() => history.goBack()}
      title={<Translate id="text_customers_sale_report" />}
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
            rowKey="id"
            dataSource={data ? data : []}
            columns={[
              {
                title: "#",
                dataIndex: "id",
                key: "id",
                width: 80,
                render: (id, record, index) => index + 1
              },
              {
                title: <Translate id="text_customer" />,
                dataIndex: "customerName",
                key: "customerName"
              },
              {
                title: <Translate id="text_phone_number" />,
                dataIndex: "phoneNumber",
                key: "phoneNumber"
              },
              {
                title: <Translate id="text_address" />,
                dataIndex: "address",
                key: "address"
              },
              {
                title: <Translate id="text_number_of_order" />,
                dataIndex: "numberOfOrder",
                key: "numberOfOrder"
              },
              {
                title: <Translate id="text_total" />,
                dataIndex: "total",
                align: "right",
                key: "total",
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

export default connect(mapStateToProps)(ReportSaleByCustomer);