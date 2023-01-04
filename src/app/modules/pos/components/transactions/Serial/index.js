import React from "react";
import { connect } from "react-redux";
import BarcodeReader from "react-barcode-reader";
import { Link } from "react-router-dom";
import moment from "moment";
import {
  Form,
  Pagination,
  Row,
  Col,
  Input,
  DatePicker,
  Tag
} from "antd";
import SerialService from "../../../services/transactions/SerialService";
import { stringTranslate } from "../../../../common/helper/stringTranslate";
import Component from "../../../../common/components/Component";

class SerialList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataWithInvoice: [],
      dataWithInstallment: [],
      loading: false,
      current: 1,
      pagination: {},
      pagination2: {},
      activeTab: 1
    };
    this.pageSize = 50;
    this.columnsByInvoice = [
      {
        title: <this.Translate id="text_product_name" />,
        dataIndex: "productName",
        key: "productName"
      },
      {
        title: "IMEI or Serial Number",
        dataIndex: "number",
        key: "number"
      },
      {
        title: <this.Translate id="text_invoice_no" />,
        dataIndex: "invoiceNumber",
        key: "invoiceNumber",
        className: "invoice-number-column",
        render: (invoiceNumber, record) => <Link to={`/transactions/detail-invoice/${record.transactionId}`}>{invoiceNumber}</Link>
      },
      {
        title: <this.Translate id="text_invoice_date" />,
        dataIndex: "invoiceDate",
        key: "invoiceDate",
        render: (invoiceDate) => this.Util.formatDate(invoiceDate, "DD/MM/YYYY")
      },
      {
        title: <this.Translate id="text_warranty" />,
        dataIndex: "numOfWarranty",
        key: "numOfWarranty",
        render: (numOfWarranty, record) => `${numOfWarranty} ${stringTranslate(`text_${record.durationType && record.durationType.toLowerCase()}`, this.props.locale)}`
      },
      {
        title: <this.Translate id="text_status" />,
        dataIndex: "numOfWarranty",
        key: "status",
        render: (numOfWarranty, record) => {
          const warrantyDate = this.Util.calculateWarrantyDate(record.invoiceDate, numOfWarranty, record.durationType);
          let statusTitle = "text_in_warranty";
          let statusColor = "#87d068";
          if (moment(moment(warrantyDate).format("YYYY-MM-DD")).isBefore(moment().format("YYYY-MM-DD"))) {
            statusTitle = "text_expired_warranty";
            statusColor = "#f5222d";
          }
          return <Tag style={{width: 112, textAlign: "center"}} color={statusColor}><this.Translate id={statusTitle} /></Tag>;
        }
      }
    ];
    this.columnsByInstallment = [
      {
        title: <this.Translate id="text_product_name" />,
        dataIndex: "productName",
        key: "productName"
      },
      {
        title: "IMEI or Serial Number",
        dataIndex: "number",
        key: "number",
        className: "invoice-number-column",
        render: (number, record) => <Link to={`/installment/detail/${record.installmentId}`}>{number}</Link>
      },
      {
        title: <this.Translate id="text_sale_date" />,
        dataIndex: "receiveDate",
        key: "receiveDate",
        render: (receiveDate) => this.Util.formatDate(receiveDate, "DD/MM/YYYY")
      },
      {
        title: <this.Translate id="text_warranty" />,
        dataIndex: "numOfWarranty",
        key: "numOfWarranty",
        render: (numOfWarranty, record) => `${numOfWarranty} ${stringTranslate(`text_${record.durationType && record.durationType.toLowerCase()}`, this.props.locale)}`
      },
      {
        title: <this.Translate id="text_status" />,
        dataIndex: "numOfWarranty",
        key: "status",
        render: (numOfWarranty, record) => {
          const warrantyDate = this.Util.calculateWarrantyDate(record.invoiceDate, numOfWarranty, record.durationType);
          let statusTitle = "text_in_warranty";
          let statusColor = "#87d068";
          if (moment(moment(warrantyDate).format("YYYY-MM-DD")).isBefore(moment().format("YYYY-MM-DD"))) {
            statusTitle = "text_expired_warranty";
            statusColor = "#f5222d";
          }
          return <Tag style={{width: 112, textAlign: "center"}} color={statusColor}><this.Translate id={statusTitle} /></Tag>;
        }
      }
    ];
    this.pathname = "/transaction/serials";
    this.timer = null;
  }

  componentDidMount() {
    this.fetchList(true);
  }

  fetchList(withPagination = false) {
    let searchKey = "";
    let limit = this.pageSize;
    let offset = this.state.current;
    let rangeFilter = "";
    const params = new URLSearchParams(window.location.search);

    if (params.get("limit")) {
      limit = Number(params.get("limit"));
    }

    if (params.get("offset")) {
      offset = Number(params.get("offset"));
    }

    if (params.get("search")) {
      searchKey = JSON.stringify({column: this.columnFilterWithKey, value: params.get("search")});
    }

    if (params.get("date")) {
      rangeFilter = JSON.stringify({column: "invoiceDate", value: [params.get("date"), params.get("date")]});
    }

    if (!withPagination){
      offset = 0;
      params.delete("offset");
      this.setState({current: 1});
    }

    this.Util.pushParamsToURL(this.pathname, params.toString());

    offset = (offset - 1) * limit;
    this.setState({loading: true});

    if (this.state.activeTab === 1) {
      SerialService.lists(limit, offset, searchKey, rangeFilter)
      .then(response => {
        this.setState({
          dataWithInvoice: response && response.data.data,
          pagination: response && response.data.pagination
        });
      })
      .finally(() => this.setState({loading: false}));
    } else {
      SerialService.listsByInstallment(limit, offset, searchKey, rangeFilter)
      .then(response => {
        this.setState({
          dataWithInstallment: response.data.data,
          pagination2: response && response.data.pagination
        });
      })
      .finally(() => this.setState({loading: false}));
    }
  }

  handleScan = (value) => {
    this.props.form.setFieldsValue({searchKey: value});
  }

  handleScanError = () => {}

  onSearchKey = e => {
    clearTimeout(this.timer);
    const value = e.target.value;
    const params = new URLSearchParams(document.location.search);
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    this.Util.pushParamsToURL(this.pathname, params.toString());
    this.timer = setTimeout(() => {
      this.fetchList();
    }, 600);
  }

  handleChangeDate = date => {
    const params = new URLSearchParams(document.location.search);
    if (date) {
      params.set("date", moment(date).format("YYYY-MM-DD"));
    } else {
      params.delete("date");
    }
    this.Util.pushParamsToURL(this.pathname, params.toString());

    this.fetchList();
  }

  onShowSizeChange = (current, pageSize) => {
    const params = new URLSearchParams(document.location.search);
    params.set("limit", pageSize);
    params.set("offset", current);

    this.setState({current});
    this.Util.pushParamsToURL(this.pathname, params.toString());
    this.fetchList(true);
  }

  onChangePagination = (current, pageSize) => {
    const params = new URLSearchParams(document.location.search);
    params.set("limit", pageSize);
    params.set("offset", current);

    this.setState({current});
    this.Util.pushParamsToURL(this.pathname, params.toString());
    this.fetchList(true);
  }

  onChangeTab = (key) => {
    this.setState({activeTab: Number(key)}, () => this.fetchList());
  }

  renderActionButton() {
    return <div />;
  }

  renderPagination(pagination) {
    pagination = {
      total: pagination.total,
      pageSize: pagination.limit,
      current: this.state.current,
      pageSizeOptions: this.pageSizeOptions
    };

    const showTotal = total => {
      return `${this.CATranslate("text_total", this.props.locale)} ${total} ${this.CATranslate("text_records", this.props.locale)}`;
    };

    return( 
      pagination.total > 0 ?
        <div className="float-right">
          <Pagination 
            size="small" 
            showTotal={showTotal} 
            showSizeChanger
            defaultCurrent={this.state.current}
            defaultPageSize={this.pageSize}
            onShowSizeChange={this.onShowSizeChange} 
            onChange={this.onChangePagination} 
            {...pagination} />
        </div>
        :
        ""
    );
  }

  render() {
    const params = new URLSearchParams(window.location.search);
    return (
      <div className="content-list">
        <div style={{height: "100%", marginTop: 10}}>
          <div className="table-wrapper">
            <Row>
              <Col span={12} style={{marginBottom: 0}}>
                <h3 style={{marginBottom: 0, fontWeight: 600}}><this.Translate id="text_serial_no" /></h3>
              </Col>
            </Row>
            <this.Tabs type="card" onChange={this.onChangeTab} style={{marginTop: 10}}>
              <this.TabPane key="1" tab={<this.Translate id="text_invoice" />}>
                <Row>
                  <Col span={24} style={{textAlign: "right"}}>
                    <BarcodeReader
                      minLength={4}
                      onError={this.handleScanError}
                      onScan={this.handleScan}
                      preventDefault={true}
                      avgTimeByChar={40}
                      endChar={[13]}
                      timeBeforeScanTest={200}
                    />
                    <Input 
                      name="searchKey"
                      defaultValue={params.get("search") ? params.get("search") : ""}
                      placeholder={`${stringTranslate("text_serial_no", this.props.locale)}, ${stringTranslate("text_invoice_no", this.props.locale)}`}
                      allowClear={true}
                      style={{width: 230, marginRight: 10}}
                      prefix={<this.Icon type="search" />}
                      onChange={this.onSearchKey}
                    />
                    <DatePicker
                      onChange={this.handleChangeDate}
                      name="date"
                      placeholder={`${stringTranslate("text_invoice_date", this.props.locale)}`}
                      defaultValue={params.get("date") ? moment(params.get("date")) : null}
                      style={{maxWidth: 200}}
                    />
                  </Col>
                </Row>
                <this.Table
                  bordered={true}
                  rowKey="id"
                  loading={this.state.loading}
                  columns={this.columnsByInvoice}
                  dataSource={this.state.dataWithInvoice}
                />

                <div style={{marginTop: 15}}>
                  {this.renderPagination(this.state.pagination)}
                </div>

                <this.clearFloating/>
              </this.TabPane>
              <this.TabPane key="2" tab={<this.Translate id="text_installment" />}>
                <Row>
                  <Col span={24} style={{textAlign: "right"}}>
                    <BarcodeReader
                      minLength={4}
                      onError={this.handleScanError}
                      onScan={this.handleScan}
                      preventDefault={true}
                      avgTimeByChar={40}
                      endChar={[13]}
                      timeBeforeScanTest={200}
                    />
                    <Input 
                      name="searchKey2"
                      defaultValue={params.get("search") ? params.get("search") : ""}
                      placeholder={`${stringTranslate("text_serial_no", this.props.locale)}, ${stringTranslate("text_customer", this.props.locale)}`}
                      allowClear={true}
                      style={{width: 230, marginRight: 10}}
                      prefix={<this.Icon type="search" />}
                      onChange={this.onSearchKey}
                    />
                    <DatePicker
                      onChange={this.handleChangeDate}
                      name="receiveDate"
                      placeholder={`${stringTranslate("text_sale_date", this.props.locale)}`}
                      defaultValue={params.get("date") ? moment(params.get("date")) : null}
                      style={{maxWidth: 200}} />
                  </Col>
                </Row>
                <this.Table 
                  bordered={true}
                  rowKey="id"
                  loading={this.state.loading}
                  columns={this.columnsByInstallment}
                  dataSource={this.state.dataWithInstallment}
                />

                <div style={{marginTop: 15}}>
                  {this.renderPagination(this.state.pagination2)}
                </div>

                <this.clearFloating/>
              </this.TabPane>
            </this.Tabs>
            
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    locale: state.locale,
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const serialList =  Form.create(mapPropsToFields)(SerialList);
  
export default connect(mapStateToProps)(serialList);