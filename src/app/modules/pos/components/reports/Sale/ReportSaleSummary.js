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
  const [defaultLocationId, setDefaultLocationId] = React.useState((new Util()).getLocationId());
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState(null);
  const [fromValue, setFromValue] = React.useState(moment());
  const [toValue, setToValue] = React.useState(moment());
  const [groupBy, setGroupBy] = React.useState("day");
  const pathName = "/reports/sale_summaries";

  const onFromChange = value => {
    const param = new URLSearchParams(document.location.search);

    if (!value) {
      param.delete("from")
      return;
    }

    value = moment(value).format("YYYY-MM-DD");
    if (param.get("from")) {
      param.set("from", value);
    } else {
      param.append("from", value);
    }

    if (param.get("to")) {
      param.set("to", value);
    } else {
      param.append("to", value);
    }

    setFromValue(moment(value));
    setToValue(moment(value));
    (new Util().pushParamsToURL(pathName, param.toString()));
    fetchReport();
  };

  const onToChange = value => {
    const param = new URLSearchParams(document.location.search);

    if (!value) {
      param.delete("to");
      return;
    }

    value = moment(value).format("YYYY-MM-DD");
    if (param.get("to")) {
      param.set("to", value);
    } else {
      param.append("to", value);
    }

    setToValue(moment(value));
    (new Util().pushParamsToURL(pathName, param.toString()));
    fetchReport();
  };

  const onChangeLocation = locationId => {
    const param = new URLSearchParams(document.location.search);
    if (locationId || locationId ===0) {
      if (param.get("locationId")) {
        param.set("locationId", locationId);
      } else {
        param.append("locationId", locationId);
      }
    }

    setDefaultLocationId(locationId);
    (new Util().pushParamsToURL(pathName, param.toString()));
    fetchReport();
  };

  const fetchReport = () => {
    const params = new URLSearchParams(document.location.search);
    let locationId = null;
    let from = moment();
    let to = moment();
    let filterGroup = groupBy;
    if (params.get("locationId")) {
      locationId = Number(params.get("locationId"));
    }
    if (params.get("from")) {
      from = moment(params.get("from"));
    }
    if (params.get("to")) {
      to = moment(params.get("to"));
    }

    if (params.get("group-by")) {
      filterGroup = params.get("group-by");
    }
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
    const param = new URLSearchParams(document.location.search);
    if (value) {
      if (param.get("group-by")) {
        param.set("group-by", value);
      } else {
        param.append("group-by", value);
      }
    } else {
      param.delete("group-by");
    }

    setGroupBy(value);
    (new Util().pushParamsToURL(pathName, param.toString()));
    fetchReport();
  }

  const setFilterField = () => {
    const params = new URLSearchParams(document.location.search);
    if (params.get("locationId") || Number(params.get("locationId")) === 0) {      
      setDefaultLocationId(Number(params.get("locationId")));
    }

    if (params.get("group-by")) {
      setGroupBy(params.get("group-by"));
    }

    if (params.get("from")) {
      setFromValue(moment(params.get("from")));
    }

    if (params.get("to")) {
      setToValue(moment(params.get("to")));
    }
  }

  function displayDate(value) {
    let result = "";
    if (groupBy === "day") {
      result = (new Util().formatDate(value.date, "DD/MM/YYYY"));
    } else if (groupBy === "week") {
      result = `${(new Util().formatDate(value.startDate, "DD/MM/YYYY"))}~${(new Util().formatDate(value.endDate, "DD/MM/YYYY"))}`;
    } else if (groupBy === "month") {
      result = (new Util().formatDate(value.date, "MM/YYYY"));
    }
    return result;
  } 

  React.useEffect(() => {
    setFilterField();
    fetchReport();
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
          <div style={{ position: "relative", minWidth: 200 }}>
            <SelectLocation
              displayPrefixString={true}
              id="filter-location"
              value={Number(defaultLocationId)}
              onChange={onChangeLocation} />
            <div style={{ position: "absolute", top: 6, left: 7 }}>Location: </div>
          </div>

          <div style={{position: "relative", minWidth: 200}}>
            <Select
              showSearch
              id="filter-group-by"
              placeholder="Group By"
              onChange={onChangeFilterGroup}
              style={{ minWidth: 200, paddingRight: 15 }}
              value={groupBy}
            >
              <Select.Option value="day" key={1}><Translate id="text_day" /></Select.Option>
              <Select.Option value="week" key={2}><Translate id="text_week" /></Select.Option>
              <Select.Option value="month" key={3}><Translate id="text_month" /></Select.Option>
            </Select>
            <div style={{position: "absolute", top: 6, left: 7}}>Group By: </div>
          </div>

          <div style={{ position: "relative", width: 220 }}>
            <DatePicker
              id="filter-from-date"
              format="DD/MM/YYYY"
              value={fromValue}
              placeholder="From"
              allowClear={false}
              onChange={onFromChange}
            />
            <div style={{ position: "absolute", top: 6, left: 7 }}>Start Date: </div>
          </div>

          <div style={{ position: "relative", width: 220 }}>
            <DatePicker
              id="filter-to-date"
              format="DD/MM/YYYY"
              value={toValue}
              placeholder="To"
              allowClear={false}
              onChange={onToChange}
              style={{marginLeft: 15, width: 204}}
            />
            <div style={{ position: "absolute", top: 6, left: 24 }}>End Date: </div>
          </div>
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
            rowKey={((record, index) => index)}
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