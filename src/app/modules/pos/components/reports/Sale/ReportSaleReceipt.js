import React, { useRef } from "react";
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
import "./index.css";
import history from "../../../../common/router/history";
import Util from "../../../../common/util";
import ReportSaleService from "../../../services/report/SaleService";
import SupplierService from "../../../../inventory/services/stock/SupplierService";

export default function ReportSaleReceipt() {
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState(null);
  const [summary, setSummary] = React.useState(null);
  const [fromValue, setFromValue] = React.useState(moment());
  const [toValue, setToValue] = React.useState(moment());
  const [searchValue, setSearchValue] = React.useState("");
  const [supplierId, setSupplierId] = React.useState("");
  const [supplierList, setSupplierList] = React.useState([]);
  const { Search } = Input;
  const pathName = "/reports/sales_receipt";
  const queryparam = new URLSearchParams(document.location.search);
  const util = new Util();
  const timerRef = useRef(null);

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
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        fetchReport(fromValue, toValue, searchValue, supplierId);
      }, 500);
    } else {
      queryparam.delete("search");
      util.pushParamsToURL(pathName, queryparam.toString());
      setSearchValue("");
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        fetchReport(fromValue, toValue, "", supplierId);
      }, 500);
    }


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

          const totalRevenue = _.sumBy(summaryByProducts, (value) => parseFloat(value.revenue));
          const totalDiscount = _.sumBy(summaryByProducts, (value) => parseFloat(value.discount));
          const totalNetSale = totalRevenue - totalDiscount;
          const totalCost = _.sumBy(summaryByProducts, (value) => parseFloat(value.cost));

          setData(summaryByProducts);
          setSummary({
            totalRevenue,
            totalDiscount,
            totalNetSale,
            totalCost,
          });
        }
      })
      .finally(() => setLoading(false));
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

    return () => clearTimeout(timerRef.current);
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
        onBack={() => history.push("/reports/sale_dashboard")}
        title={"Sales Receipt Report"}
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
        <Col span={24} id="sales-receipt-report">
          <Table
            rowKey="id"
            bordered={true}
            dataSource={[
              {
                key: 1,
                name: "Sophanna M.",
                phone: "096 241 6243",
                platform: "iOS",
                version: "10.3.4.5654",
                upgradeNum: 500,
                creator: "Jack",
                createdAt: "2014-12-24 23:12:00",
                entries: [
                  {
                    key: 1,
                    date: "2014-12-24 23:12:00",
                    name: "This is production name",
                    upgradeNum: "Upgraded: 56",
                    quantity: 1,
                    price: 2
                  },
                  {
                    key: 2,
                    date: "2014-12-24 23:12:00",
                    name: "This is production name",
                    upgradeNum: "Upgraded: 56",
                    quantity: 1,
                    price: 2
                  },
                  {
                    key: 3,
                    date: "2014-12-24 23:12:00",
                    name: "This is production name",
                    upgradeNum: "Upgraded: 56",
                    quantity: 1,
                    price: 2
                  }
                ]
              },
              {
                key: 2,
                name: "Sok Sopha",
                phone: "096 241 6243",
                platform: "iOS",
                version: "10.3.4.5654",
                upgradeNum: 500,
                creator: "Jack",
                createdAt: "2014-12-24 23:12:00",
                entries: [
                  {
                    key: 1,
                    date: "2014-12-24 23:12:00",
                    name: "This is production name",
                    upgradeNum: "Upgraded: 56",
                    quantity: 1,
                    price: 2
                  },
                  {
                    key: 2,
                    date: "2014-12-24 23:12:00",
                    name: "This is production name",
                    upgradeNum: "Upgraded: 56",
                    quantity: 4,
                    price: 2
                  },
                  {
                    key: 3,
                    date: "2014-12-24 23:12:00",
                    name: "This is production name",
                    upgradeNum: "Upgraded: 56",
                    quantity: 1,
                    price: 2
                  }
                ]
              },
              {
                key: 3,
                name: "Keo Bopha",
                phone: "096 241 6243",
                platform: "iOS",
                version: "10.3.4.5654",
                upgradeNum: 500,
                creator: "Jack",
                createdAt: "2014-12-24 23:12:00",
                entries: [
                  {
                    key: 1,
                    date: "2014-12-24 23:12:00",
                    name: "This is production name",
                    upgradeNum: "Upgraded: 56",
                    quantity: 1,
                    price: 2
                  },
                  {
                    key: 2,
                    date: "2014-12-24 23:12:00",
                    name: "This is production name",
                    upgradeNum: "Upgraded: 56",
                    quantity: 10,
                    price: 2
                  },
                  {
                    key: 3,
                    date: "2014-12-24 23:12:00",
                    name: "This is production name",
                    upgradeNum: "Upgraded: 56",
                    quantity: 1,
                    price: 2
                  }
                ]
              },
            ]}
            columns={[
              { 
                title: "Customer",
                dataIndex: "name", 
                key: "name", 
                width: 120,
                render: (name, record) => {
                  return {
                    children: `${name} ${record.phone}`,
                    props: {
                      colSpan: 7,
                    }
                  };
                }
              },
              { 
                title: "Date", 
                dataIndex: "date", 
                key: "date", 
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
                title: "Invoice No.", 
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
                title: "Description", 
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
                title: "Sold Quantity", 
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
                title: "Sales Price", 
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
                title: "Amount", 
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
            expandedRowRender={(record) => {
              const columns = [
                {
                  dataIndex: "name",
                  key: "name",
                  width: 120,
                  align: "right",
                  render: () => null
                },
                {
                  dataIndex: "date",
                  key: "date",
                  width: 120,
                  render: () => "02/10/2023",
                },
                {
                  dataIndex: "invoiceNo",
                  key: "invoiceNo",
                  width: 120,
                  render: () => "INV-0001",
                },
                {
                  dataIndex: "description",
                  key: "description",
                  render: () =>
                    "WH-1000XM5 Wireless Industry Leading Noise Canceling Headphones",
                },
                {
                  dataIndex: "soldQuantity",
                  key: "soldQuantity",
                  align: "right",
                  width: 120,
                  render: () => 10,
                },
                {
                  dataIndex: "salesPrice",
                  key: "salesPrice",
                  align: "right",
                  width: 120,
                  render: () => 10,
                },
                {
                  dataIndex: "amount",
                  key: "amount",
                  align: "right",
                  width: 120,
                  render: () => <div style={{ marginRight: 16 }}>10</div>,
                }
              ];
              const total = record.entries.reduce((sum, obj) => sum + obj.quantity, 0);
              return <div className="sub-table">
                <Table
                  showHeader={false}
                  columns={columns}
                  dataSource={record.entries}
                  pagination={false}
                  bordered={false}
                  footer={() => <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                    <div>Total</div>
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                      <div style={{ width: 120, textAlign: "right" }}>30</div>
                      <div style={{ width: 120, textAlign: "right" }}>30</div>
                      <div style={{ width: 120, textAlign: "right" }}>30</div>
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
