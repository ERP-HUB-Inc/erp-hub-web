import React from "react";
import swal from "sweetalert";
import moment from "moment";
import {
  Dropdown,
  DatePicker,
  Input,
  Menu,
  Icon,
  Row,
  Col,
  Card,
  Statistic,
  Tag,
  message,
  Pagination
} from "antd";
import ReactToPrint, { PrintContextConsumer } from "react-to-print";
import Enum from "../../../enums";
import POSUtil from "../../../utils";
import TransactionService from "../../../services/transactions/TransactionService";
import InvoiceService from "../../../services/transactions/InvoiceService";
import TransactionAction from "../../../action/transaction/transaction";
import ReceiptTemplateAction from "../../../../pos/action/settings/receiptTemplate";
import InventoryEnum from "../../../../inventory/enums";
import Component  from "../../../../common/components/Component";
import history from "../../../../common/router/history";
import { stringTranslate } from "../../../../common/helper/stringTranslate";
import Receipt from "../RetailSale/Receipt";
import Detail from "../../../containers/transactions/SaleHistory/Detail";
import ReceiptTemplate from "../receipt/template";
import PrivilegeService from "../../../services/settings/PrivilegeService";
import NoPermissionV2 from "../../../../common/components/shares/List/NoPermissionV2";

export default class Invoice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      setDefaultDate: [],
      data: [],
      summaryData: {},
      pagination: {},
      detail: {},
      current: 1,
      isRequestReturn: false,
      reprintReceiptContent: null,
      isRequestReprint: false,
      isRequestShowDetail: false,
      isShowFilter: true,
      loading: false,
      isHasAccessPermission: null
    };
    this.title = <this.Translate id="text_invoices"/>;
    this.pageSize = 50;
    this.fetchingProp = "list";
    this.pathname = "/transactions/invoice";
    this.pathCreate= "/transactions/create-invoice";
    this.permissionModuleCode = "invoice";
    this.columnFilterWithKey = ["firstName", "lastName", "email", "phoneNumber"];
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
              <Menu.Item key={1}>
                <this.Link to={`/transactions/update-invoice/${record.id}`}>
                  <Icon type="edit" style={{marginRight: 10}} /> <this.Translate id="text_edit" />
                </this.Link>
              </Menu.Item>
              <Menu.Item key={2}>
                <this.Link to={`/transactions/detail-invoice/${record.id}`}>
                  <Icon type="eye" style={{marginRight: 10}} /> <this.Translate id="text_view_invoice" />
                </this.Link>
              </Menu.Item>
              {
                record.status === Enum.INVOICE_STATUS.PAID && 
                <Menu.Item key={3}>
                  <ReactToPrint
                    content={() => this.receiptRef}
                    onBeforeGetContent={() => this.handlePrintReceipt(record.id)}
                    onAfterPrint={() => {
                      this.setState({detail: {}});
                    }}
                  >
                    <PrintContextConsumer>
                      {({ handlePrint }) => (
                        <button style={{background: "none", border: "none", paddingLeft: 0}} onClick={handlePrint}>
                          <Icon type="printer" style={{marginRight: 10}} /> <this.Translate id="text_print_receipt" />
                        </button>
                      )}
                    </PrintContextConsumer>
                  </ReactToPrint>
                </Menu.Item>
              }
              {
                record.status === Enum.INVOICE_STATUS.PAID && 
                <Menu.Item onClick={() => this.handleReturn(record)} key={4}>
                  <Icon type="close" style={{marginRight: 10}} /> <this.Translate id="text_void" />
                </Menu.Item>
              }
              <Menu.Item key={5} onClick={() => this.handleDeleteInvoice(record)} style={{color: "red"}}>
                <Icon type="delete" style={{marginRight: 10}} /> <this.Translate id="text_delete" />
              </Menu.Item>
            </Menu>
          );
          return <div className="wrap-product-name" style={{display: "flex"}}>
            {invoiceNumber}
            <Dropdown className="product-row-option" overlay={menu}>
              {/* eslint-disable-next-line */}
              <a className="ant-dropdown-link" href="#" onClick={e => e.preventDefault()} style={{marginLeft: 10}}>
                <this.Translate id="text_option" /> <Icon type="down" />
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
        render: (discount) => this.Util.formatCurrency(discount)
      },
      {
        title: <this.Translate id="text_delivery_fee" />,
        dataIndex: "deliveryFee",
        key: "deliveryFee",
        align: "right",
        render: deliveryFee => this.Util.formatCurrency(deliveryFee)
      },
      {
        title: <this.Translate id="text_vat" />,
        dataIndex: "tax",
        key: "tax",
        align: "right",
        render: (text, record) => {
          if (!record.totalExcludeTax) record.totalExcludeTax = record.total;
            return this.formatCurrency(record.total - record.totalExcludeTax);
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
  }

  componentDidMount() {
    const params = new URLSearchParams(window.location.search);
    if (params.get("limit")) {
      this.pageSize = parseInt(params.get("limit"));
    }

    if (params.get("offset")) {
      this.setState({current: parseInt(params.get("offset"))});
    }

    if (params.get("search")) {
      this.props.form.setFieldsValue({search: params.get("search")});
    }

    if (params.get("start")) {
      this.props.form.setFieldsValue({date:moment(params.get("end"))});
    }

    if (params.get("locationId")) {
      this.props.form.setFieldsValue("locationId", params.get("locationId"));
    }

    this.getPermission();

    InvoiceService.summary().then(({data})=>{
      this.setState({summaryData: data.data});
    });

    this.fetchList(true);
    
    this.props.dispatch(ReceiptTemplateAction.default());
  }  

  componentDidUpdate() {
    if (this.props.detail.fetched) {
      const isRequestClearReceiptMarginLeft = false;
      const receiptContent = this.renderReceipt(isRequestClearReceiptMarginLeft);
      const detailTransactionDisplay = this.renderReceipt();
      if (this.state.isRequestReprint) {
        this.props.dispatch(TransactionAction.reset("RESET_DETAIL_TRANSACTION"));
      } else if (this.state.isRequestShowDetail) {
        this.setState({
          loadingPopup: false,
          isRequestShowDetail: false,
          modalConten: <Detail
            reprintReceiptContent={<div style={{display: "none"}} id="reprint-receipt">{receiptContent}</div>}
            receiptContent={detailTransactionDisplay}
            dispatch={this.props.dispatch} />
        });
      }
    }
  }

  getPermission(){
    PrivilegeService.checkPermission(this.permissionModuleCode, "view")
        .then(({data}) => this.setState({isHasAccessPermission: data}))
        .catch(() => this.setState({isHasAccessPermission: false}));
  }

  fetchList(withPagination= false) {
    let searchKey = "";
    let filter = {};
    let limit = this.pageSize;
    let ranges = "";
    let offset = this.state.current;
    const params = new URLSearchParams(window.location.search);

    if (params.get("limit")) {
      limit = Number(params.get("limit"));
    }

    if (params.get("offset")) {
      offset = Number(params.get("offset"));
    }

    offset = (offset - 1) * limit;

    if (params.get("search")) {
      searchKey = JSON.stringify({column: this.columnFilterWithKey, value: params.get("search")});
    }else{
      params.delete("search");
    }

    if (params.get("date")) {
      ranges = JSON.stringify({column: "invoiceDate", value: [params.get("date"), params.get("date")]});
    }else{
      params.delete("date");
    }

    if (!withPagination){
      offset = 0;
      params.delete("offset");
      this.setState({current: 1});
    }

    this.Util.pushParamsToURL(this.pathname, params.toString());

    this.setState({loading: true});
    InvoiceService.lists(limit, offset, "", "", JSON.stringify(filter), searchKey, ranges)
    .then((response) => {
      if (response.data && response.data.data) {
        this.setState({
          data: response.data.data,
          pagination: response.data.pagination
        });
      }
    })
    .finally(() => this.setState({loading: false}));
  }

  async handlePrintReceipt(id) {
    const detail = (await TransactionService.detail(id)).data.data;
    detail.receiptTemplate = 2;
    this.setState({
      detail
    });
  }

  handleSearch = (e) => {
    const queryParams = new URLSearchParams(document.location.search);
    const value = e.target.value;
    queryParams.set("search", value ? value.trim() : "");
    history.push({pathname: this.pathname, search: queryParams.toString()});
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.fetchList();
    }, 1000);
  }

  handleChangeDate = (date) => {
    const queryParams = new URLSearchParams(document.location.search);
    queryParams.set("date", date ? moment(date).format("YYYY-MM-DD") : "");
    history.push({pathname: this.pathname, search: queryParams.toString()});
    this.fetchList();
  }

  getCustomerPaymentList(data) {
    let customerPaymentList = [];
    let changeAmount = 0;
    if (this.Util.isValidCollectionInObj(data, "transactionPayment")) {
      data.transactionPayment.forEach(payment => {
        if (payment.paymentMethod == null) {
          payment.paymentMethod = {};
        }

        if (payment.change > 0) {
          changeAmount = payment.change;
        }

        customerPaymentList = POSUtil.appendCustomerPaymentList(customerPaymentList, payment.tender, payment.paymentMethod, payment.balance);
      });
    }
    return {
      customerPaymentList,
      changeAmount
    };
  }

  getCurrentUserForRePrintReceipt(data) {
    let currentUser = {
      setting: {
        storeName: "",
        address: "",
        phoneNumber: "",
        businessName: ""
      },
      currentUser: {
        fullName: ""
      }
    };

    if (data && data.client) {
      currentUser.setting.storeName = data.client.storeName;
      currentUser.setting.address = data.client.address;
      currentUser.setting.phoneNumber = data.client.phoneNumber;
      currentUser.setting.businessName = data.client.businessName;
    }

    if (data && data.user) {
      currentUser.currentUser.fullName = data.user.fullName;
    }

    return currentUser;
  }

  handleShowEdit(record) {
    if (record.status === Enum.INVOICE_STATUS.PAID || record.status === Enum.INVOICE_STATUS.SENT) {
      return message.warning(stringTranslate("text_error_allow_update_only_draft_step", this.props.locale));
    }

    history.push(`/transactions/update-invoice/${record.id}`);
  }

  handleDeleteInvoice(record) {
    if (Number(record.status) !== Enum.INVOICE_STATUS.DRAFT) {
      return this.Util.sweetAlertMessageV2("Sorry", "Allow delete invoice only in draft step", "warning");
    }

    this.Util.sweetAlertConfirm(this.CATranslate("text_are_you_sure", this.props.locale))
    .then(willDelete => {
      if (willDelete) {
        InvoiceService.delete(record.id)
        .then(() => {
          message.success("Delete invoice success");
          this.fetchList();
        })
        .catch(err => {
          const error = err.response && err.response.data && err.response.data.error;
          if (error.message) {
              this.Util.sweetAlertMessageV2("Warning", error.message, "error");
          }
        });
      }
    });
  }

  getProductOrderList(data) {
    let productOrderList = [];
    if (this.Util.isValidCollectionInObj(data, "transactionEntries")) {
      data.transactionEntries.forEach(transactionEntry => {
        if (transactionEntry.productVariant && transactionEntry.productVariant.product) {
          const productVariant = transactionEntry.productVariant;
          const tax = POSUtil.getTaxFromProduct(productVariant.product);
          productOrderList.push({
            quantity: transactionEntry.quantity,
            // name: InventoryUtil.getProductNameV2(productVariant.product),
            name: productVariant.product.name,
            namekm: productVariant.product.namekm,
            variantName: productVariant.product.productOption === InventoryEnum.PRODUCT_VARIANT ? productVariant.name : "",
            tax: tax.taxRate/100,
            taxDescription: tax,
            price: transactionEntry.price,
            discount: transactionEntry.discount,
            newPrice: transactionEntry.price
          });
        }
      });
    }
    return productOrderList;
  }

  getSummaryTotal(data) {
    return {
      subTotalAfterDiscount: data.total - data.discount
    };
  }

  getTaxAmount(data) {
    return data.total - data.totalExcludeTax;
  }

  handleReturn(rowData) {
    if (rowData.status === Enum.INVOICE_STATUS.PAID) {
      swal({
        title: this.CATranslate("text_confirm_return_invoice", this.props.locale),
        text: this.CATranslate("text_message_return_invoice", this.props.locale),
        icon: "warning",
        buttons: [this.CATranslate("text_no", this.props.locale), this.CATranslate("text_yes", this.props.locale)],
        dangerMode: true,
      })
      .then(ok => {
          if (ok) {
            InvoiceService.makAsReturn(rowData.id)
            .then(() => {
              swal({
                icon: "success",
                title: "Success!",
                text: "Your invoice has been returned",
                buttons: false,
                timer: 1500
              })
              .then(() => {
                this.fetchList();
              });
            });
          }
      });
    } else {
      this.MessageV2.warning(this.CATranslate("text_error_allow_return", this.props.locale));
    }
  }

  onShowSizeChange = (current, pageSize) => {
    const params = new URLSearchParams(document.location.search);
    params.set("limit", pageSize);
    params.set("offset", current);

    this.setState({current});
    this.Util.pushParamsToURL(this.pathname, params.toString());
    this.fetchList();
  }

  onChangePagination = (current, pageSize) => {
    const params = new URLSearchParams(document.location.search);
    params.set("limit", pageSize);
    params.set("offset", current);

    this.setState({current});
    this.Util.pushParamsToURL(this.pathname, params.toString());
    this.fetchList(true);
  }

  renderReceipt(isRequestClearReceiptMarginLeft = true) {
    const data = this.props.detail.data;
    const customerPayment = this.getCustomerPaymentList(data);
    const productOrderList = this.getProductOrderList(data);
    const productTaxList = [];

    return <Receipt
      data={data}
      customer={data.customer}
      isRequestClearMarginLeft={isRequestClearReceiptMarginLeft}
      isRequestShowDetail={this.state.isRequestShowDetail}
      receiptTemplate={this.props.receiptTemplate.data}
      currentUser={this.getCurrentUserForRePrintReceipt(data)}
      customerFieldPrice="price"
      customerPaymentList={customerPayment.customerPaymentList}
      productList={productOrderList}
      productTaxList={productTaxList}
      summaryTotal={this.getSummaryTotal(data)}
      summaryTax={{taxTitle: "", count: 0}}
      changeAmount={customerPayment.changeAmount}
      taxAmount={0}
      discountAmount={data.discount} />;
  }

  renderButtonAddNew() {
    return <this.Button
        type="info"
        id="btnAdd"
        className="mg-right text-uppercase"
        onClick={() => history.push({pathname: "/transactions/create-invoice"})}>
        <span className="icon-add icon-padding-right"></span>
        <this.Translate id="text_add_new" />
      </this.Button>;
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
    const {detail, summaryData} = this.state;
    const params = new URLSearchParams(window.location.search);

    return (
        <React.Fragment>
          {this.Util.isNotCheckingPermissionV2(this.state.isHasAccessPermission) &&
          (this.state.isHasAccessPermission ?
              <React.Fragment>
                <div style={{display: "none"}}>
                  <ReceiptTemplate
                      formData={detail}
                      receiptTemplate={this.props.receiptTemplate.data}
                      locale={this.props.locale}
                      ref={re => this.receiptRef = re} />
                </div>
                <Row gutter={16} style={{marginTop: 15, marginBottom: 15}}>
                  <Col span={8}>
                    <Card>
                      <Statistic
                          title={<this.Translate id="text_sent_invoice"/>}
                          value={summaryData.sentAmount ? summaryData.sentAmount : 0 }
                          prefix="$"
                          suffix={" / " + (summaryData.sent ? summaryData.sent  :  0) + " invoice(s)"}
                          precision={2}
                          valueStyle={{color: "rgb(24, 144, 255)"}}
                      />
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card>
                      <Statistic
                          title={<this.Translate id="text_overdue"/>}
                          value={summaryData.overdueAmount ? summaryData.overdueAmount : 0 }
                          prefix="$"
                          suffix={" / " + (summaryData.overdue ? summaryData.overdue  :  0) + " invoice(s)"}
                          precision={2}
                          valueStyle={{ color: "#cf1322" }}
                      />
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card>
                      <Statistic
                          title={<this.Translate id="text_paid"/>}
                          value={summaryData.paidAmount ? summaryData.paidAmount : 0 }
                          prefix="$"
                          suffix={ " / " + (summaryData.paid ? summaryData.paid  :  0) + " invoice(s)"}
                          precision={2}
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
                          <h3 style={{marginBottom: 0, fontWeight: 600}}>{this.title}</h3>
                        </Col>
                        <Col span={12} style={{textAlign: "right"}}>
                          <Input
                              name="search"
                              placeholder={this.CATranslate("text_search", this.props.locale)}
                              prefix={<Icon type="search" />}
                              defaultValue={params.get("search") ? params.get("search") : ""}
                              style={{width: 200, marginRight: 10}}
                              allowClear={true}
                              onChange={this.handleSearch}
                          />
                          <DatePicker
                              onChange={this.handleChangeDate}
                              name="date"
                              placeholder={this.CATranslate("text_select_date", this.props.locale)}
                              defaultValue={params.get("date") ? moment(params.get("date")) : ""}
                              style={{maxWidth: 200, marginRight: 10}}
                          />
                          <this.Button
                              type="info"
                              id="btnAdd"
                              className="mg-right text-uppercase"
                              onClick={() => history.push({pathname: this.pathCreate})}>
                            <span className="icon-add icon-padding-right"></span>
                            <this.Translate id="text_add_new" />
                          </this.Button>
                        </Col>
                      </Row>
                      <this.Table
                          bordered={true}
                          rowKey="id"
                          loading={this.state.loading}
                          columns={this.columns}
                          dataSource={this.state.data}
                      />

                      <div style={{marginTop: 15}}>
                        {this.renderPagination(this.state.pagination)}
                      </div>

                      <this.clearFloating/>

                    </div>
                  </div>
                </div>
              </React.Fragment>
              :
              <NoPermissionV2/>
          )
          }
        </React.Fragment>
    );
  }

}