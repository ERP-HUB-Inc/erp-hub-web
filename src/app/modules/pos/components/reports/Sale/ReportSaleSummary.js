import React from "react";
import {
  Statistic,
  PageHeader,
  Table,
  DatePicker,
  Card,
  Row,
  Col,
  Select
} from "antd";
import moment from "moment";
import { connect } from "react-redux";
import { Translate } from "react-localize-redux";
import history from "../../../../common/router/history";
import Util from "../../../../common/util";
import SelectLocation from "../../../../common/components/SelectLocation";
import ReportSaleService from "../../../services/report/SaleService";
import "./index.css";

function ReportSaleSummary() {
  const [locationId, setLocationId] = React.useState((new Util()).getLocationId());
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState(null);
  const [fromValue, setFromValue] = React.useState(moment());
  const [toValue, setToValue] = React.useState(moment());
  const [filterGroup, setFilterGroup] = React.useState("day");

  const onFromChange = value => {
    if (!value) {
        return;
    }
    setFromValue(value);
    setToValue(value);
    fetchReport(locationId, value, value, filterGroup);
  };

  const onToChange = value => {
    if (!value) {
      return;
    }
    setToValue(value);
    fetchReport(locationId, fromValue, value, filterGroup);
  };

  const onChangeLocation = locationId => {
    fetchReport(locationId, fromValue, toValue, filterGroup);
    setLocationId(locationId);
  };

  const fetchReport = (locationId, from, to, filterGroup) => {
    setLoading(true);
    ReportSaleService.getReportSummary(locationId, from.format("YYYY-MM-DD"), to.format("YYYY-MM-DD"), filterGroup)
    .then(response => {
      if (response.data) {
        setData(response.data);
      }
    })
    .finally(() => {
      setLoading(false);
    });
  };

  const onChangeFilterGroup = (value) => {
    fetchReport(locationId, fromValue, toValue, value);
    setFilterGroup(value);
  }

  function displayDate(value) {
    let result = "";
    if (filterGroup === "day") {
      result = (new Util().formatDate(value.date, "DD/MM/YYYY"));
    } else if (filterGroup === "week") {
      result = `${(new Util().formatDate(value.startDate, "DD/MM/YYYY"))}~${(new Util().formatDate(value.endDate, "DD/MM/YYYY"))}`;
    } else if (filterGroup === "month") {
      result = (new Util().formatDate(value.date, "MM/YYYY"));
    }
    return result;
  } 

  React.useEffect(() => {
    fetchReport(locationId, fromValue, toValue);
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
      title={<Translate id="text_sale_summary" />}
      subTitle=""
      extra={[
        <div style={{display: "flex"}} key="1">
          <SelectLocation
            defaultValue={Number(locationId)}
            onChange={onChangeLocation} />
          
          <Select
            showSearch
            placeholder="Filter Group"
            onChange={onChangeFilterGroup}
            style={{ minWidth: 200, paddingRight: 15 }}
            defaultValue="day"
          >
            <Select.Option value="day" key={1}><Translate id="text_day" /></Select.Option>
            <Select.Option value="week" key={2}><Translate id="text_week" /></Select.Option>
            <Select.Option value="month" key={3}><Translate id="text_month" /></Select.Option>
          </Select>

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
        <Col span={4}>
          <Card>
            <Statistic
              title={<Translate id="text_revenue" />}
              value={data ? data.revenue.toFixed(2) : 0}
              precision={2}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title={<Translate id="text_discount" />}
              value={data ? data.discount.toFixed(2) : 0}
              valueStyle={{ color: "#cf1322" }}
              precision={2}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title={<Translate id="text_net_sale" />}
              value={data ? data.netSale.toFixed(2) : 0}
              valueStyle={{ color: "#3f8600" }}
              precision={2}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title={<Translate id="text_cost_of_good" />}
              value={data ? data.cost : 0}
              precision={2}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title={<Translate id="text_gross_profit" />}
              value={data ? data.profit.toFixed(2) : 0}
              precision={2}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title={<Translate id="text_margin" />}
              value={data && data.margin ? data.margin.toFixed(2) : 0}
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
                render: (value, record) => displayDate(record)
              },
              {
                title: <Translate id="text_revenue" />,
                dataIndex: "revenue",
                align: "right",
                key: "revenue",
                render: revenue => (new Util()).formatCurrency(revenue)
              },
              {
                title: <Translate id="text_discount" />,
                dataIndex: "discount",
                align: "right",
                key: "discount",
                render: discount => (new Util()).formatCurrency(discount)
              },
              {
                title: <Translate id="text_net_sale" />,
                dataIndex: "sale",
                align: "right",
                key: "sale",
                render: sale => (new Util()).formatCurrency(sale)
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
                render: (profit, record) => {
                  profit = 0;
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

function mapStateToProps(state) {
  return {
    locale: state.locale
  };
}

export default connect(mapStateToProps)(ReportSaleSummary);