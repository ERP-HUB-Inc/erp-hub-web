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
import * as _ from "lodash";
import { Translate } from "react-localize-redux";
import ExportForm from "./ExportForm";
import history from "../../../../common/router/history";
import Util from "../../../../common/util";
import ReportSaleService from "../../../services/report/SaleService";

export default function ReportSaleByProduct() {
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
    ReportSaleService.getReportSummaryByProduct({startDate: from.format("YYYY-MM-DD"), endDate: to.format("YYYY-MM-DD")})
    .then(response => {
      if (response.data) {
        const {
          summaryByProducts
        } = response.data;

        setData(summaryByProducts);
        const totalRevenue = _.sumBy(summaryByProducts, value => parseFloat(value.revenue)),
          totalCost = _.sumBy(summaryByProducts, value => parseFloat(value.cost));
        setSummary({
          totalRevenue,
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
    totalCost = 0, 
    totalProfit = 0,
    totalMargin = 0;

  if (summary) {
    totalRevenue = summary.totalRevenue;
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
      title={<Translate id="text_product_sale_report" />}
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
              title={<Translate id="text_revenue" />}
              value={summary ? summary.totalRevenue : 0}
              precision={2}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={<Translate id="text_cost_of_good" />}
              value={summary ? summary.totalCost : 0}
              precision={2}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={<Translate id="text_gross_profit" />}
              value={totalProfit}
              precision={2}
            />
          </Card>
        </Col>
        <Col span={6}>
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
          <ExportForm startDate={fromValue.format("YYYY-MM-DD")} endDate={toValue.format("YYYY-MM-DD")} />
        </Col>
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
                title: <Translate id="text_product" />,
                dataIndex: "name",
                key: "text_product"
              },
              {
                title: <Translate id="text_variant" />,
                dataIndex: "variant",
                key: "variant"
              },
              {
                title: <Translate id="text_barcode" />,
                dataIndex: "barcode",
                key: "barcode"
              },
              {
                title: <Translate id="text_quantity" />,
                dataIndex: "quantity",
                key: "quantity",
                render: (quantity, record) => {
                  return `${quantity} ${record.unitName ? record.unitName : ""}`;
                }
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
                title: <Translate id="text_cost_of_good" />,
                dataIndex: "cost",
                align: "right",
                key: "cost",
                render: cost => (new Util()).formatCurrency(cost)
              },
              {
                title: <Translate id="text_gross_profit" />,
                dataIndex: "profit",
                align: "right",
                key: "profit",
                render: (profit, record) => {
                  profit = record.revenue - record.cost;
                  return (new Util()).formatCurrency(profit);
                }
              },
              {
                title: <Translate id="text_margin" />,
                dataIndex: "margin",
                align: "right",
                key: "margin",
                render: (margin, record) => {
                  if (record.revenue > 0) {
                    const profit = record.revenue - record.cost;
                    margin = (profit / record.revenue) * 100;
                  } else {
                    margin = (-1) * 100;
                  }

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