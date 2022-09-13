import React from "react";
import { connect } from "react-redux";
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
import * as _ from "lodash";
import { Translate } from "react-localize-redux";
import history from "../../../../common/router/history";
import Util from "../../../../common/util";
import ReportSaleService from "../../../services/report/SaleService";

function ReportSaleByCategory() {
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState(null);
  const [summary, setSummary] = React.useState(null);
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
    ReportSaleService.getReportSummaryByCategory({startDate: from.format("YYYY-MM-DD"), endDate: to.format("YYYY-MM-DD")})
    .then(response => {
      if (response.data) {
        setData(response.data);
        const totalRevenue = _.sumBy(response.data, value => parseFloat(value.revenue)),
          totalDiscount = _.sumBy(response.data, value => parseFloat(value.discount)),
          totalCost = _.sumBy(response.data, value => parseFloat(value.cost));
        setSummary({
          totalRevenue,
          totalDiscount,
          totalCost
        });
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

  let totalRevenue = 0,
    totalNetSale = 0,
    totalCost = 0, 
    totalProfit = 0,
    totalMargin = 0;

  if (summary) {
    totalRevenue = summary.totalRevenue;
    totalNetSale = summary.totalRevenue - summary.totalDiscount;
    totalCost = summary.totalCost;
    totalProfit = totalRevenue - totalCost;
    if (totalProfit > 0) totalMargin = (totalProfit / totalRevenue) * 100;
  }

  return <div id="report-sale">
    <PageHeader
      style={{
          backgroundColor: "#f7f7f7",
          paddingLeft: 0,
          paddingRight: 0
      }}
      onBack={() => history.goBack()}
      title={<Translate id="text_categories_sale_report" />}
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
        <Col span={4}>
          <Card>
            <Statistic
              title={<Translate id="text_revenue" />}
              value={summary ? summary.totalRevenue : 0}
              precision={2}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title={<Translate id="text_discount" />}
              value={summary ? summary.totalDiscount : 0}
              precision={2}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title={<Translate id="text_net_sale" />}
              value={totalNetSale}
              precision={2}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title={<Translate id="text_cost_of_good" />}
              value={summary ? summary.totalCost : 0}
              precision={2}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title={<Translate id="text_gross_profit" />}
              value={totalProfit}
              precision={2}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title={<Translate id="text_margin" />}
              value={totalMargin}
              precision={2}
              suffix="%"
            />
          </Card>
        </Col>
        <Col span={24}>
          <Table
            rowKey="id"
            bordered={true}
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
                title: <Translate id="text_category" />,
                dataIndex: "categoryName",
                key: "categoryName"
              },
              {
                title: <Translate id="text_quantity" />,
                dataIndex: "quantity",
                key: "quantity"
              },
              {
                title: <Translate id="text_revenue" />,
                dataIndex: "revenue",
                align: "right",
                key: "revenue",
                render: value => (new Util()).formatCurrency(value)
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
                dataIndex: "revenue",
                align: "right",
                key: "netSale",
                render: (revenue, record) => (new Util()).formatCurrency(revenue - record.discount)
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
                  const netSale = record.revenue - record.discount;
                  profit = netSale - record.cost;
                  return (new Util()).formatCurrency(profit);
                }
              },
              {
                title: <Translate id="text_margin" />,
                dataIndex: "margin",
                align: "right",
                key: "margin",
                render: (margin, record) => {
                  const profit = record.revenue - record.cost;
                  margin = (profit / record.revenue) * 100;
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

export default connect(mapStateToProps)(ReportSaleByCategory);