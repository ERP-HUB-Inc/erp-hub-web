import React from "react";
import { Translate } from "react-localize-redux";
import moment from "moment";
import { 
  PageHeader,
  DatePicker,
  Row,
  Col,
  Table
} from "antd";
import Util from "../../../../../common/util";
import history from "../../../../../common/router/history";
import ExportFormSummary from "./ExportConsignmentSummary";

export default function ReportConsignmentSummary() {
  const [data, setData] = React.useState([]);
  const [fromValue, setFromValue] = React.useState(moment());
  const [toValue, setToValue] = React.useState(moment());

  const pathname = "/reports/stock-consignment-summary";
  const formatDate = "YYYY-MM-DD";

  const onFromChange = (date) => {
    date = moment(date).format(formatDate);
    setFromValue(moment(date));
    setToValue(moment(date));
    (new Util()).pushParamsToURL(pathname, `from=${date}&to=${date}`);
    fetchReport();
  };

  const onToChange = (date) => {
    date = moment(date).format(formatDate);
    setToValue(moment(date));
    (new Util()).pushParamsToURL(pathname, `from=${moment(fromValue).format(formatDate)}&to=${date}`);
    fetchReport();
  };

  function fetchReport() {
    setData([]);
  }

  React.useEffect(() => {
    fetchReport();
  }, []);

  return (
    <div>
      <PageHeader
        style={{
          backgroundColor: "#f7f7f7",
          paddingLeft: 0,
          paddingRight: 0
        }}
        onBack={() => history.goBack()}
        title={<Translate id="text_consignment_summary" />}
        subTitle=""
        extra={[
          <div style={{display: "flex"}} key={1}>
            <DatePicker
              format="DD/MM/YYYY"
              value={fromValue}
              placeholder="From"
              allowClear={false}
              onChange={onFromChange}
              />
            <DatePicker
              format="DD/MM/YYYY"
              value={toValue}
              placeholder="To"
              allowClear={false}
              onChange={onToChange}
              style={{marginLeft: 15}}
              />
          </div>
        ]}
      />

      <Row gutter={16}>
        <Col md={24}>
          <ExportFormSummary startDate={fromValue.format("YYYY-MM-DD")} endDate={toValue.format("YYYY-MM-DD")} />
        </Col>
        <Col md={24}>
          <Table
            rowKey="id"
            dataSource={data}
            columns={[
              {
                title: <Translate id="text_date" />,
                dataIndex: "date",
                key: "date",
                width: 200,
                render: date => (new Util()).formatDate(date, "DD/MM/YYYY")
              },
              {
                title: <Translate id="text_location" />,
                dataIndex: "location",
                key: "location"
              },
              {
                title: <Translate id="text_seller" />,
                dataIndex: "seller",
                key: "seller"
              },
              {
                title: <Translate id="text_items" />,
                dataIndex: "numberOfItem",
                key: "numberOfItem"
              },
              {
                title: <Translate id="text_total" />,
                dataIndex: "total",
                key: "total",
                align: "right",
                render: total => (new Util()).formatCurrency(total)
              }
            ]}
          />
        </Col>
      </Row>
    </div>
  );
}