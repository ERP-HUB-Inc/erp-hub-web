import React, { useRef } from "react";
import {
  Statistic,
  PageHeader,
  Table,
  DatePicker,
  Card,
  Row,
  Col,
  Input
} from "antd";
import moment from "moment";
import * as _ from "lodash";
import { Translate } from "react-localize-redux";
import ExportForm from "./ExportForm";
import "./index.css";
import history from "../../../../common/router/history";
import Util from "../../../../common/util";
import ReportSaleService from "../../../services/report/SaleService";

const { Search } = Input;

export default function ReportSaleReceipt() {
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState({
    salesReceipts: [], 
    revenue: 0, 
    discount: 0, 
    netSale: 0, 
    cost: 0, 
    grossProfit: 0, 
    margin: 0
  });

  const [fromValue, setFromValue] = React.useState(moment());
  const [toValue, setToValue] = React.useState(moment());
  const [searchValue, setSearchValue] = React.useState("");
  const pathName = "/reports/sales_receipt";
  const queryparam = new URLSearchParams(document.location.search);
  const util = new Util();
  let timerRef = null;

  const onFromChange = (value) => {
    queryparam.set("startDate", value.format("YYYY-MM-DD"));
    queryparam.set("endDate", value.format("YYYY-MM-DD"));
    util.pushParamsToURL(pathName, queryparam.toString());
    setFromValue(value);
    setToValue(value);
    fetchReport(value, value, searchValue);
  };

  const onToChange = (value) => {
    queryparam.set("startDate", fromValue.format("YYYY-MM-DD"));
    queryparam.set("endDate", value.format("YYYY-MM-DD"));
    util.pushParamsToURL(pathName, queryparam.toString());
    setToValue(value);
    fetchReport(fromValue, value, searchValue);
  };

  const onChangeInputSearch = (event) => {
    clearTimeout(timerRef);

    const search = event.target.value;
    if (search) {
      queryparam.set("search", search);
    } else {
      queryparam.delete("search");
    }

    timerRef = setTimeout(() => {
      util.pushParamsToURL(pathName, queryparam.toString());
      setSearchValue(search);

      fetchReport(fromValue, toValue, search);
    }, 1000);
  };

  const fetchReport = (from, to, search) => {
    setLoading(true);
    ReportSaleService.getReportSalesReceipt({
      startDate: from.format("YYYY-MM-DD"),
      endDate: to.format("YYYY-MM-DD"),
      search
    })
      .then((response) => {
        if (response.data) {
          setData(response.data);
        }
      })
      .finally(() => setLoading(false));
  };

  const getExportableData = () => {
    return ReportSaleService.getReportSummaryByProduct({
      startDate: fromValue.format("YYYY-MM-DD"),
      endDate: toValue.format("YYYY-MM-DD"),
      search: searchValue,
      isExport: true
    });
  };

  React.useEffect(() => {
    const queryparam = new URLSearchParams(document.location.search);
    let option = {
      startDate: fromValue,
      endDate: toValue,
      searchValue: ""
    };
    if (queryparam.has("startDate")) {
      setFromValue(moment(queryparam.get("startDate")));
      option["startDate"] = moment(queryparam.get("startDate"));
    }
    else {
      queryparam.set("startDate", moment().format("YYYY-MM-DD"));
    }

    if (queryparam.has("endDate")) {
      setToValue(moment(queryparam.get("endDate")));
      option["endDate"] = moment(queryparam.get("endDate"));
    }
    else {
      queryparam.set("endDate", moment().format("YYYY-MM-DD"));
    }

    if (queryparam.has("search")) {
      setSearchValue(queryparam.get("search"));
      option["searchValue"] = queryparam.get("search");
    }

    fetchReport(
      option.startDate,
      option.endDate,
      option.searchValue
    );

    util.pushParamsToURL(pathName, queryparam.toString());

    return () => clearTimeout(timerRef);
    //eslint-disable-next-line
  }, []);
  
  return (
    <div id="report-sale">
      <PageHeader
        style={{
          backgroundColor: "#f7f7f7",
          paddingLeft: 0,
          paddingRight: 0,
        }}
        onBack={() => history.push("/reports/sale_dashboard")}
        title={<Translate id="text_sales_receipt" />}
        subTitle=""
        extra={[
          <div style={{ display: "flex" }} key="1">
            <div>
              <Search
                name="search"
                placeholder="Search by product name,barcode"
                onChange={onChangeInputSearch}
                style={{ width: "280px" }}
                allowClear={true}
                defaultValue={new URLSearchParams(document.location.search).has("search") ? new URLSearchParams(document.location.search).get("search") : ""}
              />
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
              value={data.revenue}
              precision={2}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title={<Translate id="text_discount" />}
              value={data.discount}
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
              value={data.netSale}
              precision={2}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title={<Translate id="text_cost_of_good" />}
              value={data.cost}
              precision={2}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title={<Translate id="text_gross_profit" />}
              value={data.grossProfit}
              precision={2}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title={<Translate id="text_margin" />}
              value={data.margin}
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
        <Col span={24} id="sales-receipt-report">
          <Table
            key={Date.now()}
            rowKey="id"
            bordered={true}
            dataSource={data.salesReceipts}
            columns={[
              { 
                title: <Translate id="text_customer" />,
                dataIndex: "firstName", 
                key: "firstName", 
                width: 120,
                render: (firstName, record) => {
                  const {lastName, phoneNumber} = record;
                  return {
                  children: <div style={{fontWeight: "bold"}}>{`${firstName}${lastName ? " " + lastName : ""} ${phoneNumber ? phoneNumber : ""}`}</div>,
                    props: {
                      colSpan: 7,
                    }
                  };
                }
              },
              { 
                title: <Translate id="text_invoice_date" />, 
                dataIndex: "invoiceDate", 
                key: "invoiceDate", 
                width: 170,
                render: () => {
                  return {
                    children: null,
                    props: {
                      colSpan: 0
                    },
                  };
                }
              },
              { 
                title: <Translate id="text_invoice_no" />, 
                dataIndex: "invoiceNo", 
                key: "invoiceNo", 
                width: 120,
                render: () => {
                  return {
                    children: null,
                    props: {
                      colSpan: 0
                    },
                  };
                }
              },
              { 
                title: <Translate id="text_description" />, 
                dataIndex: "description", 
                key: "description", 
                render: () => {
                  return {
                    children: null,
                    props: {
                      colSpan: 0
                    },
                  };
                } 
              },
              { 
                title: <Translate id="text_quantity" />, 
                dataIndex: "soldQuantity", 
                key: "soldQuantity", 
                width: 120,
                render: () => {
                  return {
                    children: null,
                    props: {
                      colSpan: 0
                    },
                  };
                }
              },
              { 
                title: <Translate id="text_sales_price" />, 
                dataIndex: "salesPrice", 
                key: "salesPrice", 
                width: 120,
                render: () => {
                  return {
                    children: null,
                    props: {
                      colSpan: 0
                    },
                  };
                }
              },
              { 
                title: <Translate id="text_amount" />, 
                dataIndex: "amount", 
                key: "amount", 
                width: 120,
                render: () => {
                  return {
                    children: null,
                    props: {
                      colSpan: 0
                    },
                  };
                }
              }
            ]}
            defaultExpandAllRows={true}
            expandIconAsCell={false}
            expandIcon={() => null}
            expandedRowRender={(record, index) => {
              const columns = [
                {
                  dataIndex: "name",
                  key: "name",
                  width: 120,
                  align: "right",
                  render: () => null
                },
                {
                  dataIndex: "invoiceDate",
                  key: "invoiceDate",
                  width: 170,
                  render: invoiceDate => util.formatDate(invoiceDate),
                },
                {
                  dataIndex: "invoiceNo",
                  key: "invoiceNo",
                  width: 120,
                  render: () => record.invoiceNumber,
                },
                {
                  dataIndex: "description",
                  key: "description",
                  render: description => description
                },
                {
                  dataIndex: "quantity",
                  key: "quantity",
                  align: "right",
                  width: 120,
                  render: (quantity) => quantity,
                },
                {
                  dataIndex: "price",
                  key: "price",
                  align: "right",
                  width: 120,
                  render: price => util.formatCurrency(price),
                },
                {
                  dataIndex: "quantity",
                  key: "amount",
                  align: "right",
                  width: 140,
                  render: (quantity, record) => util.formatCurrency(quantity * record.price),
                }
              ];
              
              const quantity = record.transactionEntries.reduce((sum, obj) => sum + obj.quantity, 0);
              const amount = record.transactionEntries.reduce((sum, obj) => sum + (obj.quantity * obj.price), 0);

              return <div className="sub-table">
                <Table
                  key={index}
                  showHeader={false}
                  rowKey="id"
                  columns={columns}
                  dataSource={record.transactionEntries}
                  pagination={false}
                  bordered={false}
                  footer={() => <div style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
                    <div style={{ fontWeight: "bold" }}><Translate id="text_total" />:</div>
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                      <div style={{ width: 120, textAlign: "right", fontWeight: "bold", paddingRight: 15 }}>{quantity}</div>
                      <div style={{ width: 120, textAlign: "right" }}></div>
                      <div style={{ width: 120, textAlign: "right", fontWeight: "bold" }}>{util.formatCurrency(amount)}</div>
                    </div>
                  </div>}
                />
                </div>;
            }}
            pagination={false}
            loading={loading}
          />
        </Col>
      </Row>
    </div>
  );
}
