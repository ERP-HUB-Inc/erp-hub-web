import React from "react";
import { connect } from "react-redux";
import {
  PageHeader,
  Table,
  DatePicker,
  Row,
  Col,
  Input,
  Select 
} from "antd";
import moment from "moment";
import { Translate } from "react-localize-redux";
import ExportFormByProduct from "./ExportFormByProduct";
import history from "../../../../common/router/history";
import Enum from "../../../../inventory/enums";
import Util from "../../../../common/util";
import  PurchaseService from "../../../services/report/PurchaseService";
import "./index.css";


const util = new Util();
const pathName = "/reports/purchased_products";
const { Search  } = Input;
const { Option } = Select;

function ReportPurchaseByProduct() {
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [dataSuplier, setdataSuplier] = React.useState([]);
  const [fromValue, setFromValue] = React.useState(moment().startOf("month"));
  const [toValue, setToValue] = React.useState(moment().endOf("month"));
  const params = new URLSearchParams(document.location.search);
  const onFromChange = value => {
    if(value){
      setFromValue(value);
      setToValue(value);
      fetchReport(value, value);
      params.set("startDate", value.format("YYYY-MM-DD"));
    } else {
      params.delete("startDate");
    }

    util.pushParamsToURL(pathName, params.toString());
    
    fetchReport(fromValue,toValue,value);
  };

  const onToChange = value => {
    if(value){
      setToValue(value);
      fetchReport(fromValue, value);
      params.set("endDate", value.format("YYYY-MM-DD"));
    } else {
      params.delete("endDate");
    }

    util.pushParamsToURL(pathName, params.toString());

    fetchReport(fromValue,toValue,value);
  };

  const fetchReport = (from, to, search, supplierId) => {
    setLoading(true);
    const option = {
      startDate: from.format("YYYY-MM-DD"), 
      endDate: to.format("YYYY-MM-DD")
    };

    if (search) option["search"] = search;

    if (supplierId) option["supplierId"] = supplierId;


    PurchaseService.getReportSummaryByProduct(option)
    .then(response => {
      if (response.data) {
        setData(response.data);
      }
    })
    .finally(() => {
      setLoading(false);
    });

    PurchaseService.getReportSummaryBySupplier(option)
    .then(response => {
      if (response.data){
        setdataSuplier(response.data)
      }
    })
  };
  React.useEffect(() => {
    fetchReport(fromValue, toValue, params.get("search"), params.get("supplierId"));
    //eslint-disable-next-line
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    if (value) {
      params.set("search", value);
    } else {  
      params.delete("search");
    }

    util.pushParamsToURL(pathName, params.toString());
    
    fetchReport(fromValue,toValue,value);
  };

  const onChangeSelect = (value) => {
    const search = params.get("search") && params.get("search")
    if (value) {
      params.set("supplierId", value)
    } else {
      params.delete("supplierId");
    }
    util.pushParamsToURL(pathName, params.toString());
    
    fetchReport(fromValue,toValue,search,value);
  }

  return <div id="report-purchase">
    <PageHeader
      style={{
          backgroundColor: "#f7f7f7",
          paddingLeft: 0,
          paddingRight: 0
      }}
      onBack={() => history.goBack()}
      title="Product Purchase Report"
      subTitle=""
      extra={[
        <div style={{display: "flex"}} >
          <div id="formSearchHeaderOnReportPurchase">
            <Search
              placeholder="Search product by name,barcode"
              onChange={handleSearch}
              style={{marginRight: 15}}
              className="input-search"
              name="search"
              allowClear={true}
              defaultValue={params.get("search")}
            />
          </div>
          <div id="selectDrop">
            <Select
              showSearch
              name="supplierId"
              style={{ width: 200 , marginRight: 15}}
              placeholder="Select supplier"
              onChange={onChangeSelect}
              allowClear={true}
              defaultValue={params.get("supplierId") && params.get("supplierId")}
            >
              {dataSuplier.map((value, key) => (
                <Option key={key} value={value.supplierId}>
                  {value.supplierName}
                </Option>
              ))}
            </Select>
          </div>
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
          <ExportFormByProduct startDate={fromValue.format("YYYY-MM-DD")} endDate={toValue.format("YYYY-MM-DD")} />
        </Col>
        <Col span={24}>
          <Table
            rowKey="id"
            dataSource={data}
            columns={[
              {
                title: "#",
                dataIndex: "name",
                key: "no",
                render: (text, record, index) => index + 1
              },
              {
                title: <Translate id="text_product_name" />,
                dataIndex: "productName",
                key: "productName",
                render: (productName, record) => {
                  let variantName = "";
                  if (record.productOption === Enum.PRODUCT_VARIANT) {
                    variantName = ` / ${record.variantName}`;
                  }
                  return productName + variantName;
                }
              },
              {
                title: <Translate id="text_barcode" />,
                dataIndex: "barcode",
                key: "barcode"
              },
              {
                title: <Translate id="text_purchase_date" />,
                dataIndex: "date",
                key: "date",
                render: date => (new Util()).formatDate(date, "DD/MM/YYYY")
              },
              {
                title: <Translate id="text_supplier" />,
                dataIndex: "supplierName",
                key: "supplierName"
              },
              {
                title: <Translate id="text_quantity_buy_in" />,
                dataIndex: "quantity",
                key: "quantity",
                render: (quantity, record) => `${quantity} ${record.unitName ? record.unitName : ""}`
              },
              {
                title: <Translate id="text_unit_cost" />,
                dataIndex: "cost",
                key: "cost",
                align: "right",
                render: cost => (new Util()).formatCurrency(cost)
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

export default connect(mapStateToProps)(ReportPurchaseByProduct);