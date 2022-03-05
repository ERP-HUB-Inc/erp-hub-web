import React from "react";
import {
  Statistic,
  PageHeader,
  Table,
  DatePicker,
  Card,
  Row,
  Col
} from "antd";
import moment from "moment";
import { Translate } from "react-localize-redux";
import history from "../../../../common/router/history";
import Util from "../../../../common/util";
import ReportSaleService from "../../../services/report/SaleService";
import "./index.css";

export default function ReportSaleSummary(props) {
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState(null);
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
    ReportSaleService.getReportSummary(from.format("YYYY-MM-DD"), to.format("YYYY-MM-DD"))
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
      title="Sale Summary"
      subTitle=""
      extra={[
        <div style={{display: "flex"}} key="1">
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
        <Col span={6}>
          <Card>
            <Statistic
              title="Revenue"
              value={data ? data.revenue : 0}
              precision={2}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Cost of Goods Sold"
              value={data ? data.cost : 0}
              precision={2}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Gross Profit"
              value={data ? data.profit : 0}
              precision={2}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Margin"
              value={data && data.margin ? data.margin : 0}
              precision={2}
              suffix="%"
            />
          </Card>
        </Col>
        <Col span={24}>
          <Table
            rowKey="date"
            dataSource={data ? data.summaries : []}
            columns={[
              {
                title: <Translate id="text_date" />,
                dataIndex: "date",
                key: "date",
                width: 200,
                render: value => (new Util()).formatDate(value)
              },
              {
                title: <Translate id="text_revenue" />,
                dataIndex: "revenue",
                align: "right",
                key: "revenue",
                render: (value, record) => (new Util()).formatCurrency(value + record.discount)
              },
              {
                title: <Translate id="text_discount" />,
                dataIndex: "discount",
                align: "right",
                key: "discount",
                render: discount => (new Util()).formatCurrency(discount)
              },
              {
                title: <Translate id="text_cost_of_good" />,
                dataIndex: "cost",
                align: "right",
                key: "cost",
                render: value => (new Util()).formatCurrency(value)
              },
              {
                title: <Translate id="text_gross_profit" />,
                dataIndex: "profit",
                align: "right",
                key: "profit",
                render: (text, record) => {
                  let profit = 0;
                  profit = "profit" in record ? record.profit : record.revenue - record.cost;
                  return (new Util()).formatCurrency(profit);
                }
              },
              {
                title: <Translate id="text_margin" />,
                dataIndex: "margin",
                align: "right",
                key: "margin",
                render: (text, record) => {
                  let margin = 0;
                  margin = "margin" in record ? record.margin : ((record.revenue - record.cost) / record.revenue) * 100;
                  return (new Util()).formatPercentage(margin);
                }
              }
            ]}
            pagination={false}
            loading={loading}
            />
        </Col>
      </Row>
  </div>;
}