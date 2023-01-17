import React from "react";
import moment from "moment";
import ReactToPrint from "react-to-print";
import { connect } from "react-redux";
import {
  Col,
  Form,
  Input,
  Row,
  DatePicker,
  Card,
  Statistic,
  Pagination,
  Tag,
  Menu,
  Divider,
  Dropdown
} from "antd";
import history from "../../../../common/router/history";
import Enum from "../../../enums";
import Component from "../../../../common/components/Component";
import InvoiceService from "../../../services/transactions/InvoiceService";
import CAInvoice from "../Invoice/CAInvoice";

class RecurringInvoice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      detail: {},
      summaryData: {},
      pagination: {},
      current: 1,
      loading: false
    };
    this.INVOICE_STATUS_STR = {
      [Enum.INVOICE_STATUS.DRAFT]: { title: <this.Translate id="text_draft" />, color: "#bfbfbf" },
      [Enum.INVOICE_STATUS.SENT]: { title: <this.Translate id="text_sent" />, color: "#1890ff" },
      [Enum.INVOICE_STATUS.PARTIAL]: { title: <this.Translate id="text_partial_pay" />, color: "#52c41a"},
      [Enum.INVOICE_STATUS.PAID]: { title: <this.Translate id="text_paid" />, color: "#52c41a"},
      [Enum.INVOICE_STATUS.VOID]: { title: <this.Translate id="text_void" />, color: "#d9d9d9"},
    };
    this.columns = [
      {
        title: <this.Translate id="text_date" />,
        dataIndex: "invoiceDate",
        key: "invoiceDate",
        width: 140,
        render: invoiceDate => this.Util.formatDate(invoiceDate, "DD/MM/YYYY")
      },
      {
        title: <this.Translate id="text_status" />,
        dataIndex: "status",
        key: "status",
        width: 120,
        align: "center",
        render: (status, record) => {
          if(status || status >= 0){
            const statusValue = this.INVOICE_STATUS_STR[status];
            let statusColor = statusValue.color;
            let stepTitle = statusValue.title;
            if (Number(status) === Enum.INVOICE_STATUS.SENT && moment(record.dueDate).format("YYYY-MM-DD") < moment().format("YYYY-MM-DD")) {
              statusColor = "#f5222d";
              stepTitle = <this.Translate id="text_overdue" />;
            }

            return <Tag color={statusColor} style={{width: 120, textAlign: "center", margin: 0}}>{stepTitle}</Tag>;
          }
        }
      },
      {
        title: <this.Translate id="text_invoice_no" />,
        dataIndex: "invoiceNumber",
        key: "invoiceNumber",
        width: 180,
        render: (invoiceNumber, record) => {
          const menu = (
            <Menu>
              <Menu.Item key={0}>
                <this.Link to={`/transactions/recurring-invoice/detail/${record.id}`}>
                  <this.Icon type="eye" style={{marginRight: 10}} /> <this.Translate id="text_view" />
                </this.Link>
              </Menu.Item>
              <Menu.Item key={1}>
                <this.Link to={`/transactions/recurring-invoice/update/${record.id}`}>
                  <this.Icon type="edit" style={{marginRight: 10}} /> <this.Translate id="text_edit" />
                </this.Link>
              </Menu.Item>
              <Menu.Item key={4}>
                <this.Link target="_blank" to={`/transactions/recurring-invoice/create?id=${record.id}&action=clone`} >
                  <this.Icon type="copy" style={{marginRight: 10}} /> <this.Translate id="text_clone" />
                </this.Link>
              </Menu.Item>
              <Divider style={{marginTop: 4, marginBottom: 4}} />
              <Menu.Item>
                <div>
                  <ReactToPrint
                    content={() => this.invoiceRef}
                    onBeforeGetContent={() => this.getDetailInvoice(record.id)}
                    trigger={() => {
                      return (
                        <div>
                          <this.Icon type="printer" style={{marginRight: 10}} /> <this.Translate id="text_print" />
                        </div>
                      );
                    }}
                  />
                </div>
              </Menu.Item>
              {
                record.status === Enum.INVOICE_STATUS.PAID && 
                <Divider style={{marginTop: 4, marginBottom: 4}} />
              }
              {
                record.status !== Enum.INVOICE_STATUS.PAID && 
                <Menu.Item key={6} onClick={() => this.handleDeleteInvoice(record)}>
                  <this.Icon type="delete" style={{marginRight: 10}} /> <this.Translate id="text_delete" />
                </Menu.Item>
              }
            </Menu>
          );
          return <div className="wrap-product-name" style={{display: "flex"}}>
            {invoiceNumber}
            <Dropdown className="product-row-option" overlay={menu}>
              {/* eslint-disable-next-line */}
              <a className="ant-dropdown-link" href="#" onClick={e => e.preventDefault()} style={{marginLeft: 10}}>
                <this.Translate id="text_option" /> <this.Icon type="down" />
              </a>
            </Dropdown>
          </div>;
        }
      },
      {
        title: <this.Translate id="text_customer" />,
        dataIndex: "firstName",
        key: "firstName",
        render: (firstName, record) => `${firstName} ${record.lastName}`,
      },
      {
        title: <this.Translate id="text_phone_number" />,
        dataIndex: "phoneNumber",
        key: "phoneNumber",
        render: phoneNumber => phoneNumber
      },
      {
        title: <this.Translate id="text_deposit" />,
        dataIndex: "deposit",
        key: "deposit",
        align: "right",
        render: deposit => deposit ? this.Util.formatCurrency(deposit) : "-"
      },
      {
        title: <this.Translate id="text_sub_total" />,
        dataIndex: "totalExcludeTax",
        key: "totalExcludeTax",
        align: "right",
        render: (totalExcludeTax, record) => {
          if (!totalExcludeTax) {
            totalExcludeTax = record.total;
          }
          return this.Util.formatCurrency(totalExcludeTax);
        }
      },
      {
        title: <this.Translate id="text_discount" />,
        dataIndex: "discount",
        key: "discount",
        align: "right",
        render: (discount) => discount ? this.Util.formatCurrency(discount) : "-"
      },
      {
        title: <this.Translate id="text_vat" />,
        dataIndex: "tax",
        key: "tax",
        align: "right",
        render: (text, record) => {
          if (!record.totalExcludeTax) record.totalExcludeTax = record.total;
          const vat = record.total - record.totalExcludeTax;

          return vat ? this.formatCurrency(record.total - record.totalExcludeTax) : "-";
        }
      },
      {
        title: <this.Translate id="text_grand_total" />,
        dataIndex: "total",
        key: "totalSale",
        align: "right",
        render: (total, record) => {
          total = total - this.Util.floor(record.discount) + record.deliveryFee;
          if (total < 0) total = 0;
          return this.Util.formatCurrency(total);
        }
      }
    ];
    this.pathname = "/transactions/recurring-invoice/list";
    this.timer = null;
  }

  componentDidMount() {
    this.fetchList();
    this.fetchSummary();
  }

  fetchList(withPagination = false) {
    let limit = this.pageSize;
    let offset = this.state.current;
    let search = "";
    let ranges = "";
    const params = new URLSearchParams(document.location.search);

    if (params.get("limit")) {
      limit = Number(params.get("limit"));
    }

    if (params.get("offset")) {
      offset = Number(params.get("offset"));
    }

    if (params.get("search")) {
      search = JSON.stringify({column: this.columnFilterWithKey, value: params.get("search")});
    }else{
      params.delete("search");
    }

    if (params.get("date")) {
      ranges = JSON.stringify({column: "invoiceDate", value: [params.get("date"), params.get("date")]});
    }else{
      params.delete("date");
    }

    offset = (offset - 1) * limit;
    if (!withPagination){
      offset = 0;
      params.delete("offset");
      this.setState({current: 1});
      this.Util.pushParamsToURL(this.pathname, params.toString());
    }

    this.setState({loading: true});
    InvoiceService.lists(limit, offset, "", "", JSON.stringify({invoiceType: Enum.INVOICE_TYPE.SCHEDULED}), search, ranges)
    .then(response => {
      this.setState({
        data: response.data.data,
        pagination: response.data.pagination
      });
    })
    .finally(() => this.setState({loading: false}));
  }

  fetchSummary() {
    InvoiceService.summary(JSON.stringify({invoiceType: [Enum.INVOICE_TYPE.SCHEDULED]}))
    .then(response => {
      this.setState({summaryData: response.data.data});
    });
  }

  async getDetailInvoice(id) {
    const detail = (await InvoiceService.detail(id)).data;
    this.setState({detail});
  }

  handleDeleteInvoice = (record) => {
    this.Util.sweetAlertConfirm(this.CATranslate("text_are_you_sure", this.props.locale))
    .then(willDelete => {
      if (willDelete) {
        InvoiceService.delete(record.id)
        .then(() => {
          this.Util.sweetAlertMessageV2(
            this.CATranslate("text_success", this.props.locale),
            this.CATranslate("text_one_record_deleted", this.props.locale),
            "success"
          );
          this.fetchList();
        })
        .catch(err => {
          const error = err.response && err.response.data && err.response.data.error;
          if (error && error.message) {
            this.Util.sweetAlertMessageV2("Warning", error.message, "error");
          }
        });
      }
    });
  }

  handleSearch = (e) => {
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

  handleChangeDate = (date) => {
    const params = new URLSearchParams(document.location.search);
    if (date) {
      params.set("date", date);
    } else {
      params.delete("date");
    }

    this.Util.pushParamsToURL(this.pathname, params.toString());
    this.fetchList();
  }

  onTableChange = (current, pageSize) => {
    const params = new URLSearchParams(document.location.search);
    params.set("limit", pageSize);
    params.set("offset", current);

    this.setState({current});
    this.Util.pushParamsToURL(this.pathname, params.toString());
    this.fetchList();
  }

  render() {
    const params = new URLSearchParams(document.location.search);
    const {summaryData, data, pagination} = this.state;
    return (
      <React.Fragment>
        <Row gutter={16} style={{marginTop: 15, marginBottom: 15}}>
          <Col span={8}>
            <Card>
              <Statistic
                title={<this.Translate id="text_sent_invoice"/>}
                value={summaryData.sentAmount ? summaryData.sentAmount.toFixed(2) : 0 }
                prefix="$"
                suffix={" / " + (summaryData.sent ? summaryData.sent  :  0) + " " + this.CATranslate("text_invoices", this.props.locale).toLowerCase()}
                valueStyle={{color: "rgb(24, 144, 255)"}}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title={<this.Translate id="text_overdue"/>}
                value={summaryData.overdueAmount ? summaryData.overdueAmount.toFixed(2) : 0 }
                prefix="$"
                suffix={" / " + (summaryData.overdue ? summaryData.overdue  :  0) + " " + this.CATranslate("text_invoices", this.props.locale).toLowerCase()}
                valueStyle={{ color: "#cf1322" }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title={<this.Translate id="text_paid"/>}
                value={summaryData.paidAmount ? summaryData.paidAmount.toFixed(2) : 0 }
                prefix="$"
                suffix={ " / " + (summaryData.paid ? summaryData.paid  :  0) + " " + this.CATranslate("text_invoices", this.props.locale).toLowerCase()}
                valueStyle={{ color: "#3f8600" }}
              />
            </Card>
          </Col>
        </Row>
        <div className="content-list">
          <div style={{height: "100%"}}>
            <div className="table-wrapper">
              <Row>
                <Col span={12} style={{marginBottom: 0}}>
                  <h3 style={{marginBottom: 0, fontWeight: 600}}><this.Translate id="text_recurring_invoice" /></h3>
                </Col>
                <Col span={12} style={{textAlign: "right"}}>
                  <Input
                    name="search"
                    placeholder={this.CATranslate("text_search", this.props.locale)}
                    prefix={<this.Icon type="search" />}
                    defaultValue={params.get("search") ? params.get("search") : ""}
                    style={{width: 200, marginRight: 10}}
                    allowClear={true}
                    onChange={this.handleSearch}
                  />
                  <DatePicker
                    onChange={this.handleChangeDate}
                    name="date"
                    placeholder={this.CATranslate("text_select_date", this.props.locale)}
                    defaultValue={params.get("date") ? moment(params.get("date")) : null}
                    style={{maxWidth: 200, marginRight: 10}}
                  />
                  <this.Button
                    type="info"
                    id="btnAdd"
                    className="text-uppercase"
                    onClick={() => history.push({pathname: "/transactions/recurring-invoice/create"})}
                  >
                    <span className="icon-add icon-padding-right"></span>
                    <this.Translate id="text_add_new" />
                  </this.Button>
                </Col>
              </Row>
              <this.Table 
                rowKey="id"
                bordered={true}
                columns={this.columns}
                loading={this.state.loading}
                dataSource={data}
              />

              <div style={{marginTop: 15}}>
                {
                  pagination.total ?
                  <div className="float-right">
                    <Pagination 
                      total={pagination.total}
                      showTotal={(total) => `${this.CATranslate("text_total", this.props.locale)} ${total} ${this.CATranslate("text_records", this.props.locale)}`}
                      pageSize={pagination.limit}
                      current={this.state.current}
                      size="small"
                      showSizeChanger
                      onShowSizeChange={this.onTableChange}
                      onChange={this.onTableChange}
                    />
                  </div>
                  : null
                }
              </div>

              <this.clearFloating/>

              <div style={{display: "none"}}>
                <CAInvoice
                  ref={ref => this.invoiceRef = ref}
                  formData={this.state.detail} />
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const recurringInvoice = Form.create(mapPropsToFields)(RecurringInvoice);
export default connect(mapStateToProps)(recurringInvoice);