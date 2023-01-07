import React from "react";
import {
  Statistic,
  PageHeader,
  Table,
  DatePicker,
  Card,
  Row,
  Col,
  Input,
  Select,
} from "antd";
import moment from "moment";
import * as _ from "lodash";
import { Translate } from "react-localize-redux";
import ExportForm from "./ExportForm";
import history from "../../../../common/router/history";
import Util from "../../../../common/util";
import ReportSaleService from "../../../services/report/SaleService";
import SupplierService from "../../../../inventory/services/stock/SupplierService";

export default function ReportSaleByProduct() {
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState(null);
  const [summary, setSummary] = React.useState(null);
  const [fromValue, setFromValue] = React.useState(moment());
  const [toValue, setToValue] = React.useState(moment());
  const [searchValue, setSearchValue] = React.useState("");
  const [supplierId, setSupplierId] = React.useState("");
  const [supplierList, setSupplierList] = React.useState([]);
  const { Search } = Input;
  const pathName = "/reports/sold_products";
  const queryparam = new URLSearchParams(document.location.search);
  const util = new Util();

  const onFromChange = (value) => {
    queryparam.set("startDate", value.format("YYYY-MM-DD"));
    queryparam.set("endDate", value.format("YYYY-MM-DD"));
    util.pushParamsToURL(pathName, queryparam.toString());
    setFromValue(value);
    setToValue(value);
    fetchReport(value, value, searchValue, supplierId);
  };

  const onToChange = (value) => {
    queryparam.set("startDate", fromValue.format("YYYY-MM-DD"));
    queryparam.set("endDate", value.format("YYYY-MM-DD"));
    util.pushParamsToURL(pathName, queryparam.toString());
    setToValue(value);
    fetchReport(fromValue, value, searchValue, supplierId);
  };

  const onChangeInputSearch = (event) => {
    if (event.target.value) {
      queryparam.set("search", event.target.value);
      util.pushParamsToURL(pathName, queryparam.toString());
      setSearchValue(event.target.value);
    } else {
      queryparam.delete("search");
      util.pushParamsToURL(pathName, queryparam.toString());
    }
    fetchReport(fromValue, toValue, event.target.value, supplierId);
  };

  const onChangeSupplier = (value) => {
    if (value) {
      queryparam.set("supplierId", value);
      util.pushParamsToURL(pathName, queryparam.toString());
      setSupplierId(value);
      fetchReport(fromValue, toValue, searchValue, value);
    } else {
      queryparam.delete("supplierId");
      util.pushParamsToURL(pathName, queryparam.toString());
      setSupplierId("");
      fetchReport(fromValue, toValue, searchValue, "");
    }
  };

  const fetchReport = (from, to, search, supplierId) => {
    setLoading(true);
    ReportSaleService.getReportSummaryByProduct({
      startDate: from.format("YYYY-MM-DD"),
      endDate: to.format("YYYY-MM-DD"),
      search,
      supplierId
    })
      .then((response) => {
        if (response.data) {
          const { summaryByProducts } = response.data;

          setData(summaryByProducts);
          const totalRevenue = _.sumBy(summaryByProducts, (value) =>
              parseFloat(value.revenue)
            ),
            totalDiscount = _.sumBy(summaryByProducts, (value) =>
              parseFloat(value.discount)
            ),
            totalNetSale = totalRevenue - totalDiscount,
            totalCost = _.sumBy(summaryByProducts, (value) =>
              parseFloat(value.cost)
            );
          setSummary({
            totalRevenue,
            totalDiscount,
            totalNetSale,
            totalCost,
          });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getExportableData = () => {
    return ReportSaleService.getReportSummaryByProduct({
      startDate: fromValue.format("YYYY-MM-DD"),
      endDate: toValue.format("YYYY-MM-DD"),
      search: searchValue,
      supplierId,
      isExport: true
    });
  };

  React.useEffect(() => {
    SupplierService.lists().then((response) => {
      if (response && response.data.data && Array.isArray(response.data.data)) {
        setSupplierList(response.data.data);
      }
    });
    const queryparam = new URLSearchParams(document.location.search);
    let option = {
      startDate: fromValue,
      endDate: toValue,
      searchValue: "",
      supplierId: supplierId,
    };
    if (queryparam.has("startDate")) {
      setFromValue(moment(queryparam.get("startDate")));
      option["startDate"] = moment(queryparam.get("startDate"));
    }
    else{
      queryparam.set("startDate", moment().format("YYYY-MM-DD"));
    }

    if (queryparam.has("endDate")) {
      setToValue(moment(queryparam.get("endDate")));
      option["endDate"] = moment(queryparam.get("endDate"));
    }
    else{
      queryparam.set("endDate",  moment().format("YYYY-MM-DD"));
    }

    if (queryparam.has("search")) {
      setSearchValue(queryparam.get("search"));
      option["searchValue"] = queryparam.get("search");
    }
    if (queryparam.has("supplierId")) {
      setSupplierId(queryparam.get("supplierId"));
      option["supplierId"] = queryparam.get("supplierId");
    }
    fetchReport(
      option.startDate,
      option.endDate,
      option.searchValue,
      option.supplierId
    );

    util.pushParamsToURL(pathName, queryparam.toString());
    //eslint-disable-next-line
  }, []);

  let totalRevenue = 0,
    totalCost = 0,
    totalProfit = 0,
    totalMargin = 0;

  if (summary) {
    totalRevenue = summary.totalRevenue;
    totalCost = summary.totalCost;
    totalProfit = summary.totalNetSale - totalCost;
    totalMargin = totalProfit && ((totalRevenue - totalCost) / totalRevenue) * 100;
  }
  return (
    <div id="report-sale">
      <PageHeader
        style={{
          backgroundColor: "#f7f7f7",
          paddingLeft: 0,
          paddingRight: 0,
        }}
        onBack={() => history.goBack()}
        title={<Translate id="text_product_sale_report" />}
        subTitle=""
        extra={[
          <div style={{ display: "flex" }} key="1">
            <div>
              <Search
                placeholder="Search by product name,barcode"
                onChange={onChangeInputSearch}
                style={{ width: "280px" }}
                allowClear={true}
                defaultValue={
                  queryparam.has("search") ? queryparam.get("search") : ""
                }
              />
            </div>
            <div style={{ marginLeft: 15 }}>
              <Select
                style={{ width: "200px" }}
                allowClear={true}
                placeholder={"Supplier"}
                defaultValue={
                  queryparam.has("supplierId")
                    ? queryparam.get("supplierId")
                    : undefined
                }
                onChange={onChangeSupplier}
              >
                {supplierList.map((supplier, index) => (
                  <Select.Option key={index} value={supplier.id}>
                    {supplier.name}
                  </Select.Option>
                ))}
              </Select>
            </div>
            <DatePicker
              format="DD/MM/YYYY"
              value={fromValue}
              placeholder="From"
              allowClear={false}
              onChange={onFromChange}
              style={{ marginLeft: 15 }}
            />
            <DatePicker
              format="DD/MM/YYYY"
              value={toValue}
              placeholder="To"
              onChange={onToChange}
              allowClear={false}
              style={{ marginLeft: 15 }}
            />
          </div>,
        ]}
      />
      <Row gutter={16}>
        <Col span={4}>
          <Card>
            <Statistic
              title={<Translate id="text_revenue" />}
              value={summary ? summary.totalRevenue.toFixed(2) : 0}
              precision={2}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title={<Translate id="text_discount" />}
              value={summary ? summary.totalDiscount.toFixed(2) : 0}
              valueStyle={{ color: "#cf1322" }}
              precision={2}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title={<Translate id="text_net_sale" />}
              valueStyle={{ color: "#3f8600" }}
              value={summary ? summary.totalNetSale.toFixed(2) : 0}
              precision={2}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title={<Translate id="text_cost_of_good" />}
              value={summary ? summary.totalCost.toFixed(2) : 0}
              precision={2}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title={<Translate id="text_gross_profit" />}
              value={totalProfit.toFixed(2)}
              precision={2}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title={<Translate id="text_margin" />}
              value={totalMargin.toFixed(2)}
              precision={2}
              suffix="%"
            />
          </Card>
        </Col>
        <Col span={24}>
          <ExportForm
            pdfLink={"/reports/sold_products/pdf-preview"}
            getData={getExportableData}
          />
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
                render: (id, record, index) => index + 1,
              },
              {
                title: <Translate id="text_product" />,
                dataIndex: "name",
                key: "text_product",
              },
              {
                title: <Translate id="text_variant" />,
                dataIndex: "variant",
                key: "variant",
              },
              {
                title: <Translate id="text_barcode" />,
                dataIndex: "barcode",
                key: "barcode",
              },
              {
                title: <Translate id="text_quantity" />,
                dataIndex: "quantity",
                key: "quantity",
                render: (quantity, record) => {
                  return `${quantity} ${
                    record.unitName ? record.unitName : ""
                  }`;
                },
              },
              {
                title: <Translate id="text_revenue" />,
                dataIndex: "revenue",
                align: "right",
                key: "revenue",
                render: (revenue) => new Util().formatCurrency(revenue),
              },
              {
                title: <Translate id="text_discount" />,
                dataIndex: "discount",
                align: "right",
                key: "discount",
                render: (discount) => new Util().formatCurrency(discount),
              },
              {
                title: <Translate id="text_net_sale" />,
                dataIndex: "revenue",
                align: "right",
                key: "netSale",
                render: (revenue, record) =>
                  new Util().formatCurrency(revenue - record.discount),
              },
              {
                title: <Translate id="text_cost_of_good" />,
                dataIndex: "cost",
                align: "right",
                key: "cost",
                render: (cost) => new Util().formatCurrency(cost),
              },
              {
                title: <Translate id="text_gross_profit" />,
                dataIndex: "profit",
                align: "right",
                key: "profit",
                render: (profit, record) => {
                  const netSale = record.revenue - record.discount;
                  profit = netSale - record.cost;
                  return new Util().formatCurrency(profit);
                },
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
                    margin = -1 * 100;
                  }

                  return new Util().formatPercentage(margin);
                },
              },
            ]}
            pagination={false}
            loading={loading}
          />
        </Col>
      </Row>
    </div>
  );
}
