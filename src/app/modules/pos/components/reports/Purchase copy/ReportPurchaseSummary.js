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
import ExportForm from "./ExportForm";
import history from "../../../../common/router/history";
import Util from "../../../../common/util";
import PurchaseService from "../../../services/report/PurchaseService";
import "./index.css";

function ReportPurchaseSummary() {
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [fromValue, setFromValue] = React.useState(moment().startOf("month"));
  const [toValue, setToValue] = React.useState(moment().endOf("month"));
  const params = new URLSearchParams(document.location.search);
  const pathName = "/reports/purchase_summaries";

  const onFromChange = value => {
    params.set("startDate", value.format("YYYY-MM-DD"));
    params.set("endDate", value.format("YYYY-MM-DD"));
    setFromValue(moment(value));
    setToValue(moment(value));
    fetchReport(value, value);
    new Util().pushParamsToURL(pathName, params.toString());
  };

  const onToChange = value => {
      params.set("endDate", value.format("YYYY-MM-DD"));
      setToValue(moment(value));
      fetchReport(fromValue, value);
      new Util().pushParamsToURL(pathName, params.toString());
  };

  const fetchReport = (from, to) => {
    setLoading(true);
    PurchaseService.getReportSummary({startDate: from.format("YYYY-MM-DD"), endDate: to.format("YYYY-MM-DD")})
    .then(response => {
      if (response.data) {
        setData(response.data);
      }
    })
    .finally(() => {
      setLoading(false);
    });
  };

  const getExportableData = () => {
    return  PurchaseService.getReportSummary(
      {
        startDate: fromValue.format("YYYY-MM-DD"),
        endDate: toValue.format("YYYY-MM-DD"),
        isExport: true,
      }
    );
  };


  React.useEffect(() => {

    let option = {
      startDate: fromValue,
      endDate: toValue,
    };

    if (params.has("startDate")) {
      setFromValue(moment(params.get("startDate")));
      option["startDate"] = moment(params.get("startDate"));
    }
    else{
      params.set("startDate", moment().startOf("month").format("YYYY-MM-DD"));
    }
    
    if (params.has("endDate")) {
      setToValue(moment(params.get("endDate")));
      option["endDate"] = moment(params.get("endDate"));
    }
    else{
      params.set("endDate", moment().endOf("month").format("YYYY-MM-DD"));
    }

    fetchReport(
      option.startDate,
      option.endDate,
    );
    new Util().pushParamsToURL(pathName, params.toString());
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
      title="Purchase Summary"
      subTitle=""
      extra={[
        <div style={{display: "flex"}}>
          <DatePicker
              format="DD/MM/YYYY"
              value={fromValue}
              placeholder="From"
              onChange={onFromChange}
              allowClear={false}
              />
          <DatePicker
              format="DD/MM/YYYY"
              value={toValue}
              placeholder="To"
              onChange={onToChange}
              style={{marginLeft: 15}}
              allowClear={false}
              />
        </div>
      ]}
      />
      <Row gutter={16}>
        <Col span={24}>
          <ExportForm pdfLink = "/reports/purchase_summaries/pdf-preview" getData={getExportableData} />
        </Col>
        <Col span={24}>
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
                title: <Translate id="text_description" />,
                dataIndex: "description",
                key: "description"
              },
              {
                title: <Translate id="text_number" />,
                dataIndex: "number",
                key: "number"
              },
              {
                title: <Translate id="text_receiver"/>,
                dataIndex: "receiverName",
                key: "receiverName"
              },
              {
                title: <Translate id="text_supplier" />,
                dataIndex: "supplierName",
                key: "supplierName"
              },
              {
                title: <Translate id="text_location" />,
                dataIndex: "locationName",
                key: "locationName"
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

export default connect(mapStateToProps)(ReportPurchaseSummary);