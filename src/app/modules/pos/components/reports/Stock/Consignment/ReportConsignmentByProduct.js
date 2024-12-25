import React, { useState, useRef } from "react";
import { Translate } from "react-localize-redux";
import moment from "moment";
import {
  PageHeader,
  Row,
  Col,
  Table,
  Form,
  message
} from "antd";
import { Select, DatePickers, InputText } from "../../../../../common/elements/ant-ui";
import SupplierService from "../../../../../inventory/services/stock/SupplierService";
import ConsignmentService from "../../../../services/report/ConsignmentService";
import history from "../../../../../common/router/history";
import Util from "../../../../../common/util";
import ExportConsignmentProduct from "./ExportByProduct";

function ReportConsignmentByProduct(props) {
  const [data, setData] = useState([]);
  const [fromValue, setFromValue] = useState(moment().startOf("month"));
  const [toValue, setToValue] = useState(moment());
  const [dataSeller, setDataSeller] = useState([]);
  const [loading, setLoading] = useState(false);

  const util = new Util();
  const params = new URLSearchParams(document.location.search);
  const pathname = "/reports/stock-consignment-product";
  const formatDate = "YYYY-MM-DD";
  const timerRef = useRef(null);

  const fetchReport = () => {
    let search = "",
    supplierId = "",
      startDate = util.formatDateForMYSQL(fromValue),
      endDate = util.formatDateForMYSQL(toValue);

    const params = new URLSearchParams(document.location.search);
    if (params.get("search")) {
      search = params.get("search");
    }

    if (params.get("supplierId")) {
      supplierId = params.get("supplierId");
    }

    if (params.get("start")) {
      startDate = params.get("start");
    }

    if (params.get("end")) {
      endDate = params.get("end");
    }

    setLoading(true);
    ConsignmentService.getReportByProduct(search, supplierId, startDate, endDate)
      .then(response => {
        setData(response.data);
      })
      .catch(err => message.error("Internal Servicer Error"))
      .finally(() => setLoading(false));
  };

  const onChangeSelect = value => {
    if (value) {
      params.set("supplierId", value);
    } else {
      params.delete("supplierId");
    }
    util.pushParamsToURL(pathname, params.toString());

    fetchReport();
  };

  const handleSearch = e => {
    const value = e.target.value;
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }
      util.pushParamsToURL(pathname, params.toString());
      fetchReport();
    }, 500);

  };

  const onFromChange = date => {
    date = moment(date).format(formatDate);
    setFromValue(moment(date));
    setToValue(moment(date));
    util.pushParamsToURL(pathname, `start=${date}&end=${date}`);
    fetchReport();
  };

  const onToChange = date => {
    date = moment(date).format(formatDate);
    setToValue(moment(date));
    util.pushParamsToURL(pathname, `start=${moment(fromValue).format(formatDate)}&end=${date}`);
    fetchReport();
  };

  const handleGoBack = () => {
    history.goBack();
  };

  React.useEffect(() => {
    fetchReport();

    SupplierService.lists(15)
      .then(response => {
        if (response.data) {
          setDataSeller(response.data && response.data.data);
        }
      });

    const params = new URLSearchParams(document.location.search);
    if (params.get("search")) {
      props.form.setFieldsValue({ search: params.get("search") });
    }

    if (params.get("supplierId")) {
      props.form.setFieldsValue({ supplierId: params.get("supplierId") });
    }

    if (params.get("start")) {
      setFromValue(moment(params.get("start")));
    }

    if (params.get("end")) {
      setToValue(moment(params.get("end")));
    }

    return () => clearTimeout(timerRef.current);
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
        onBack={handleGoBack}
        title={<Translate id="text_consignment_product" />}
        subTitle=""
        extra={[
          <div style={{ display: "flex" }} key={1} >
            <div id="formSearchHeaderOnReportPurchase">
              <InputText
                placeholder="Search product by name,barcode"
                onChange={handleSearch}
                style={{ marginRight: 15 }}
                className="input-search"
                name="search"
                allowClear={true}
                defaultValue={params.get("search") ? params.get("search") : ""}
                form={props.form} />
            </div>
            <div id="selectDrop">
              <Select
                showSearch
                name="supplierId"
                style={{ width: 200, marginRight: 15 }}
                placeholder="Select seller"
                onChange={onChangeSelect}
                allowClear={true}
                valueKey="id"
                dataSource={dataSeller}
                form={props.form} />
            </div>
            <DatePickers
              name="start"
              format="DD/MM/YYYY"
              defaultValue={fromValue}
              placeholder="From"
              onChange={onFromChange}
              allowClear={false}
              form={props.form} />
            <DatePickers
              name="end"
              format="DD/MM/YYYY"
              defaultValue={toValue}
              placeholder="To"
              onChange={onToChange}
              style={{ marginLeft: 15 }}
              allowClear={false}
              form={props.form} />
          </div>
        ]}
      />
      <Row gutter={16}>
        <Col md={24}>
          <ExportConsignmentProduct
            search={props.form.getFieldValue("search")}
            supplierId={props.form.getFieldValue("supplierId")}
            startDate={fromValue.format(formatDate)}
            endDate={toValue.format(formatDate)} />
        </Col>
        <Col md={24}>
          <Table
            rowKey="id"
            bordered={true}
            dataSource={data}
            loading={loading}
            columns={[
              {
                title: "#",
                dataIndex: "name",
                key: "no",
                render: (text, record, index) => index + 1
              },
              {
                title: <Translate id="text_item_name" />,
                dataIndex: "productName",
                key: "productName",
                render: (productName, record) => {
                  return <div>
                    {productName}
                    {record.variantName ? <span style={{ marginLeft: 10 }} className="variant-name">{record.variantName}</span> : ""}
                  </div>;
                }
              },
              {
                title: <Translate id="text_barcode" />,
                dataIndex: "barcode",
                key: "barcode"
              },
              {
                title: <Translate id="text_date" />,
                dataIndex: "date",
                key: "date",
                render: date => (new Util()).formatDate(date, "DD/MM/YYYY")
              },
              {
                title: <Translate id="text_seller" />,
                dataIndex: "seller",
                key: "seller"
              },
              {
                title: <Translate id="text_quantity" />,
                dataIndex: "quantity",
                key: "quantity",
                render: (quantity, record) => `${quantity} ${record.unitName ? record.unitName : ""}`
              },
              {
                title: <Translate id="text_cost" />,
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
          />
        </Col>
      </Row>
    </div>
  );
}

const reportConsignmentByProduct = Form.create({ name: "report-consignment-by-product" })(ReportConsignmentByProduct);
export default reportConsignmentByProduct;