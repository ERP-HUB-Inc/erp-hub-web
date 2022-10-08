import React, {useState} from "react";
import { Translate } from "react-localize-redux";
import moment from "moment";
import { 
  DatePicker, 
  Input, 
  PageHeader, 
  Select,
  Row,
  Col,
  Table,
  Form
} from "antd";
import SupplierService from "../../../../../inventory/services/stock/SupplierService";
import history from "../../../../../common/router/history";
import Util from "../../../../../common/util";
import Enum from "../../../../../inventory/enums";
import ExportConsignmentProduct from "./ExportConsignmentProduct";

const {Search} = Input;
const {Option} = Select;

function ReportConsignmentByProduct(props) {
  const [data, setData] = useState([]);
  const [fromValue, setFromValue] = useState(moment());
  const [toValue, setToValue] = useState(moment());
  const [dataSeller, setDataSeller] = useState([]);
  //const [loading, setLoading] = useState([]);

  const util = new Util();
  const params = new URLSearchParams(document.location.search);
  const pathname = "/reports/stock-consignment-product";
  const formatDate = "YYYY-MM-DD";
  let timer = null;

  const fetchReport = () => {
    setData([]);
  };

  const onChangeSelect = value => {
    if (value) {
      params.set("sellerId", value);
    } else {
      params.delete("sellerId");
    }
    util.pushParamsToURL(pathname, params.toString());
    
    fetchReport();
  };

  const handleSearch = e => {
    clearTimeout(timer);
    const value = e.target.value;
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }

    timer = setTimeout(() => {
      console.log("value", value);
      fetchReport();
    }, 1000);

  };

  const onFromChange = date => {
    date = moment(date).format(formatDate);
    setFromValue(moment(date));
    setToValue(moment(date));
    (new Util()).pushParamsToURL(pathname, `from=${date}&to=${date}`);
    fetchReport();
  };

  const onToChange = date => {
    date = moment(date).format(formatDate);
    setToValue(moment(date));
    (new Util()).pushParamsToURL(pathname, `from=${moment(fromValue).format(formatDate)}&to=${date}`);
    fetchReport();
  };

  React.useEffect(() => {
    fetchReport(fromValue, toValue, params.get("search"), params.get("sellerId"));

    SupplierService.lists(15)
    .then(response => {
      if (response.data){
        setDataSeller(response.data && response.data.data);
      }
    });

    if (params.get("sellerId")) {
      props.form.setFieldsValue({sellerId: params.get("sellerId")});
    }

    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <PageHeader
        style={{
          backgroundColor: "#f7f7f7",
          paddingLeft: 0,
          paddingRight: 0
        }}
        onBack={() => history.goBack()}
        title={<Translate id="text_consignment_product" />}
        subTitle=""
        extra={[
          <div style={{display: "flex"}} key={1} >
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
                name="sellerId"
                style={{ width: 200 , marginRight: 15}}
                placeholder="Select seller"
                onChange={onChangeSelect}
                allowClear={true}
              >
                {dataSeller.map((value, key) => (
                  <Option key={key} value={value.id}>
                    {value.name}
                  </Option>
                ))}
              </Select>
            </div>
            <DatePicker
              format="DD/MM/YYYY"
              value={fromValue}
              placeholder="From"
              onChange={onFromChange}
              allowClear={false} />
            <DatePicker
              format="DD/MM/YYYY"
              value={toValue}
              placeholder="To"
              onChange={onToChange}
              style={{marginLeft: 15}}
              allowClear={false} />
          </div>
        ]}
      />
      <Row gutter={16}>
        <Col md={24}>
          <ExportConsignmentProduct />
        </Col>
        <Col md={24}>
          <Table
            rowKey="id"
            bordered={true}
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
                title: <Translate id="text_seller" />,
                dataIndex: "supplierName",
                key: "supplierName"
              },
              {
                title: <Translate id="text_quantity" />,
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
          />
        </Col>
      </Row>
    </div>
  );
}

const reportConsignmentByProduct = Form.create({name: "report-consignment-by-product"})(ReportConsignmentByProduct);
export default reportConsignmentByProduct;