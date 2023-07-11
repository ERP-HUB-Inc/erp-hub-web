import React from "react";
import {
  Statistic,
  PageHeader,
  Table,
  Card,
  Row,
  Col,
  Select
} from "antd";
import moment from "moment";
import {connect} from "react-redux";
import {Translate} from "react-localize-redux";
import history from "../../../../common/router/history";
import Util from "../../../../common/util";
import SelectLocation from "../../../../common/components/SelectLocation";
import SelectDateOption from "../../../../common/components/SelectDateOption";
import ReportSaleService from "../../../services/report/SaleService";
import "./index.css";

function ReportSaleSummary() {
  const [defaultLocationId, setDefaultLocationId] = React.useState((new Util()).getLocationId());
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState(null);
  const [groupBy, setGroupBy] = React.useState("day");
  const [option, setOption] = React.useState("today");
  const [dateRange, setDateRange] = React.useState([]);
  const pathName = "/reports/sale_summaries";
  const dateFormat = "YYYY-MM-DD";

  const onChangeLocation = locationId => {
    const param = new URLSearchParams(document.location.search);
    if (locationId || locationId ===0) {
      if (param.has("locationId")) {
        param.set("locationId", locationId);
      } else {
        param.append("locationId", locationId);
      }
    }

    setDefaultLocationId(locationId);
    (new Util().pushParamsToURL(pathName, param.toString()));
    fetchReport();
  };

  const onChangeDateOption = option => {
    const params = new URLSearchParams(document.location.search);
    const dates = (new Util()).getDatesFromSelectOption(option)["range"];
    if (option === "modify") {
      if (params.has("option")) {
        params.set("option", option);
      } else {
        params.append("option", option);
      }
      setOption(option);
      setDateRange([moment(dates[0]), moment(dates[1])]);
      return (new Util()).pushParamsToURL(pathName, params.toString());
    }
    
    if (dates.length) {
      if (params.has("option")) {
        params.set("option", option);
      } else {
        params.append("option", option);
      }

      if (params.has("from")) {
        params.set("from", dates[0]);
      } else {
        params.append("from", dates[0]);
      }

      if (params.has("to")) {
        params.set("to", dates[1]);
      } else {
        params.append("to", dates[1]);
      }

      (new Util()).pushParamsToURL(pathName, params.toString());
      setOption(option);
      fetchReport();
    }
  };

  const onChangeDate = dates => {
    if (dates && dates.length) {
      const params = new URLSearchParams(document.location.search);
      let date1 = moment(dates[0]).format(dateFormat);
      let date2 = moment(dates[1]).format(dateFormat);

      if (params.has("from")) {
        params.set("from", date1);
      } else {
        params.append("from", date1);
      }

      if (params.has("to")) {
        params.set("to", date2);
      } else {
        params.append("to", date2);
      }

      (new Util()).pushParamsToURL(pathName, params.toString());
      setDateRange([moment(date1), moment(date2)]);
      fetchReport();
    }
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
      if (param.has("group-by")) {
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
  };

  const setFilterField = () => {
    const params = new URLSearchParams(document.location.search);
    if (params.get("locationId") || Number(params.get("locationId")) === 0) {      
      setDefaultLocationId(Number(params.get("locationId")));
    }

    if (params.get("group-by")) {
      setGroupBy(params.get("group-by"));
    }

    if (params.get("option")) {
      const option = params.get("option");
      setOption(option);

      if (option === "modify") {
        if (params.get("from") && params.get("to")) {
          setDateRange([moment(params.get("from")), moment(params.get("to"))]);
        } else if (params.get("from") && !params.get("to")) {
          setDateRange([moment(params.get("from")), moment(params.get("from"))]);
        }
      }
    }
  };

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
          <SelectLocation
            displayPrefixString={true}
            id="filter-location"
            prefixString="Location"
            value={Number(defaultLocationId)}
            onChange={onChangeLocation} />

          <Select
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

          <div>
            <SelectDateOption
              style={{ minWidth: 220, paddingRight: option === "modify" ? 15 : "" }}
              value={option}
              rangeValue={dateRange}
              showSelectCustomDate={true}
              format="DD/MM/YYYY"
              allowClearDates={false}
              onChange={onChangeDateOption}
              onChangeDate={onChangeDate}
            />
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
              value={data ? data.cost.toFixed(2) : 0}
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
            bordered={true}
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
                render: discount => (new Util()).formatCurrency(discount || 0)
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