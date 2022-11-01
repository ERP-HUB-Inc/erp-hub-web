import React from "react";
import { connect } from "react-redux";
import BarcodeReader from "react-barcode-reader";
import { Link } from "react-router-dom";
import {
  Form,
  Dropdown,
  Menu,
  Pagination
} from "antd";
import SerialService from "../../../services/transactions/SerialService";
import List from "../List";
import { stringTranslate } from "../../../../common/helper/stringTranslate";

class SerialList extends List {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: false,
      isFocusSearch: false,
      isShowFilter: true,
      current: 1,
    };
    this.columns = [
      {
        title: <this.Translate id="text_number" />,
        dataIndex: "number",
        key: "number",
        width: 400,
        render: (number, record) => {
          return <div className="wrap-product-name" style={{display: "flex"}}>
            {number}
            <Dropdown className="product-row-option" overlay={(
              <Menu>
                <Menu.Item>
                  <Link to={`/transactions/detail-invoice/${record.transactionId}`}><this.Translate id="text_view_invoice" /></Link>
                </Menu.Item>
              </Menu>
            )}>
              <a className="ant-dropdown-link" href="javascipt:(void)" onClick={e => e.preventDefault()} style={{marginLeft: 10}}>
                <this.Translate id="text_option" /> <this.Icon type="down" />
              </a>
            </Dropdown>
          </div>;
        }
      },
      {
        title: <this.Translate id="text_product_name" />,
        dataIndex: "productName",
        key: "productName"
      },
      {
        title: <this.Translate id="text_invoice_date" />,
        dataIndex: "invoiceDate",
        key: "invoiceDate",
        render: (invoiceDate) => this.Util.formatDate(invoiceDate)
      },
      {
        title: <this.Translate id="text_warranty_date" />,
        dataIndex: "numOfWarranty",
        key: "warrantyDate",
        render: (numOfWarranty, record) => this.Util.formatDate(this.Util.calculateWarrantyDate(record.invoiceDate, numOfWarranty, record.durationType))
      }
    ];
  }

  componentDidMount() {
    this.fetchList();
  }

  componentDidUpdate() {
    if (this.state.isFocusSearch) {
      this.setState({isFocusSearch: false});
    }
  }

  fetchList() {
    let searchKey = "";
    let limit = this.pageSize;
    let offset = this.state.current;
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

    offset = (offset - 1) * limit;
    this.setState({loading: true});
    SerialService.lists(limit, offset, searchKey)
    .then(response => {
      this.setState({data: response && response.data});
    })
    .finally(() => this.setState({loading: false}));
  }

  handleSubmitFilter = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const params = new URLSearchParams(window.location.search);
        if (values.searchKey) {
          params.set("search", values.searchKey);
        } else {
          params.delete("search");
        }

        this.Util.pushParamsToURL(this.pathname, params.toString());
        this.fetchList();
      }
    });
  }

  handleScan = (value) => {
    this.props.form.setFieldsValue({searchKey: value});
  }

  handleScanError = () => {}

  onShowSizeChange(current, pageSize) {
    const params = new URLSearchParams(document.location.search);
    params.set("limit", pageSize);
    params.set("offset", current);

    this.setState({current});
    this.Util.pushParamsToURL(this.pathname, params.toString());
    this.fetchList();
  }

  onChangePagination(current, pageSize) {
    const params = new URLSearchParams(document.location.search);
    params.set("limit", pageSize);
    params.set("offset", current);

    this.setState({current});
    this.Util.pushParamsToURL(this.pathname, params.toString());
    this.fetchList();
  }

  renderFilterRecord() {
    return <this.Form onSubmit={this.handleSubmitFilter}>
      <this.Row>
        <this.Col md="2">
          <BarcodeReader
            minLength={4}
            onError={this.handleScanError}
            onScan={this.handleScan}
            preventDefault={true}
            avgTimeByChar={40}
            endChar={[13]}
            timeBeforeScanTest={200}
          />
          <this.InputText 
            name="searchKey"
            label={<this.Translate id="text_search" />}
            placeholder={`${stringTranslate("text_serial_no", this.props.locale)}`}
            allowClear={true}
            isAutoFocus={this.state.isFocusSearch}
            didUpdateMakeAutoFocus={this.state.isFocusSearch}
            suffix={<div className="icon-scaner icon-clear" style={{opacity: .5, cursor: "pointer"}} onClick={() => this.setState({isFocusSearch: true})} />}
            form={this.props.form} />
        </this.Col>
        <this.Col md="2" className="wrap-btn-search">
          <div className="ant-form-item-label" style={{visibility: "hidden"}}>
            <label htmlFor="status" className="" title=""><this.Translate id="text_filter" /></label>
          </div>
          <this.Button htmlType="submit" type="info" loading={this.state.loading}>
            <span className="icon-search icon-padding-right text-uppercase"></span><this.Translate id="button_text_search" />
          </this.Button>
        </this.Col>
      </this.Row>
    </this.Form>;
  }

  renderActionButton() {
    return <div />;
  }

  renderPagination(fetchingProp, className = "float-right") {
    const data = this.state.data && this.state.data.pagination;
    let pagination = {
      total: data && data.total,
      pageSize: data && data.limit,
      current: this.state.current,
      pageSizeOptions: this.pageSizeOptions
    };

    const showTotal = total => {
      return `${this.CATranslate("text_total", this.props.locale)} ${total} ${this.CATranslate("text_records", this.props.locale)}`;
    };

    return( 
      pagination.total > 0 ?
        <div className={className}>
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

  renderTable() {
    return <this.Table
      bordered={true}
      rowKey="id"
      loading={this.state.loading}
      columns={this.columns}
      dataSource={this.state.data.data}
      onChange={this.onChange}
    />;
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