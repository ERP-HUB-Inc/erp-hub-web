import React from "react";
import { Translate } from "react-localize-redux";
import moment from "moment";
import { 
  PageHeader,
  Form,
  Row,
  Col,
  Table
} from "antd";
import { DatePickers } from "../../../../../common/elements/ant-ui";
import ConsignmentService from "../../../../services/report/ConsignmentService";
import Util from "../../../../../common/util";
import history from "../../../../../common/router/history";
import ExportFormSummary from "./ExportBySummary";

function ReportConsignmentSummary(props) {
  const [data, setData] = React.useState([]);
  const [fromValue, setFromValue] = React.useState(moment().startOf("month"));
  const [toValue, setToValue] = React.useState(moment());
  const [loading, setLoading] = React.useState(false);

  const util = new Util();
  const pathname = "/reports/stock-consignment-summary";
  const formatDate = "YYYY-MM-DD";

  const onFromChange = (date) => {
    date = moment(date).format(formatDate);
    setFromValue(moment(date));
    setToValue(moment(date));
    util.pushParamsToURL(pathname, `start=${date}&end=${date}`);
    fetchReport();
  };

  const onToChange = (date) => {
    date = moment(date).format(formatDate);
    setToValue(moment(date));
    util.pushParamsToURL(pathname, `start=${moment(fromValue).format(formatDate)}&end=${date}`);
    fetchReport();
  };

  function fetchReport() {
    const params = new URLSearchParams(document.location.search);
    let startDate = util.formatDateForMYSQL(fromValue),
      endDate = util.formatDateForMYSQL(toValue);

    if (params.get("start")) {
      startDate = params.get("start");
    }

    if (params.get("end")) {
      endDate = params.get("end");
    }

    setLoading(true);
    ConsignmentService.getSummary(startDate, endDate)
    .then(response => {
      setData(response.data);
    })
    .catch(err => console.log("error", err.response))
    .finally(() => setLoading(false));
  }

  React.useEffect(() => {
    fetchReport();

    const params = new URLSearchParams(document.location.search);
    if (params.get("start")) {
      setFromValue(moment(params.get("start")));
    }

    if (params.get("end")) {
      setToValue(moment(params.get("end")));
    }

    // eslint-disable-next-line
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
            <DatePickers
              name="start"
              format="DD/MM/YYYY"
              defaultValue={fromValue}
              placeholder="From"
              allowClear={false}
              onChange={onFromChange}
              form={props.form} />
            <DatePickers
              name="end"
              format="DD/MM/YYYY"
              defaultValue={toValue}
              placeholder="To"
              allowClear={false}
              onChange={onToChange}
              style={{marginLeft: 15}}
              form={props.form} />
          </div>
        ]}
      />

      <Row gutter={16}>
        <Col md={24}>
          <ExportFormSummary startDate={fromValue.format(formatDate)} endDate={toValue.format(formatDate)} />
        </Col>
        <Col md={24}>
          <Table
            rowKey="id"
            dataSource={data}
            loading={loading}
            columns={[
              {
                title: <Translate id="text_date" />,
                dataIndex: "date",
                key: "date",
                width: 200,
                render: date => (new Util()).formatDate(date, "DD/MM/YYYY")
              },
              {
                title: <Translate id="text_seller" />,
                dataIndex: "seller",
                key: "seller"
              },
              {
                title: <Translate id="text_location" />,
                dataIndex: "location",
                key: "location"
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
            pagination={false}
          />
        </Col>
      </Row>
    </div>
  );
}

const reportConsignmentSummary = Form.create({name: "report-consignment-by-product"})(ReportConsignmentSummary);
export default reportConsignmentSummary;