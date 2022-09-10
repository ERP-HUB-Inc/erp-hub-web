import React from "react";
import swal from "sweetalert";
import moment from "moment";
import { 
  Dropdown,
  Menu,
  Icon,
  Tag,
  message,
  Pagination
} from "antd";
import ReactToPrint, { PrintContextConsumer } from "react-to-print";
import List from "../List";
import Enum from "../../../enums";
import POSUtil from "../../../utils";
import TransactionService from "../../../services/transactions/TransactionService";
import InvoiceService from "../../../services/transactions/InvoiceService";
import TransactionAction from "../../../action/transaction/transaction";
import ReceiptTemplateAction from "../../../../pos/action/settings/receiptTemplate";
import InventoryEnum from "../../../../inventory/enums";
import history from "../../../../common/router/history";
import { stringTranslate } from "../../../../common/helper/stringTranslate";
import Receipt from "../RetailSale/Receipt";
import Detail from "../../../containers/transactions/SaleHistory/Detail";
import ReceiptTemplate from "../receipt/template";

export default class Invoice extends List {
  constructor(props) {
    super(props);
    this.state = {
      isRequestReturn: false,
      reprintReceiptContent: null,
      isRequestReprint: false,
      isRequestShowDetail: false,
      isShowFilter: true,
      setDefaultDate: [],
      data: [],
      detail: {},
      loading: false
    };
    this.title = <this.Translate id="text_sales"/>;
    this.fetchingProp = "list";
    this.columnFilterWithKey = ["firstName", "lastName", "email", "phoneNumber"];
    this.pathname = "/transactions/invoice";
    this.INVOICE_STATUS_STR = {
      [Enum.INVOICE_STATUS.DRAFT]: { title: <this.Translate id="text_draft" />, color: "#d9d9d9" },
      [Enum.INVOICE_STATUS.SENT]: { title: <this.Translate id="text_sent" />, color: "#1890ff" },
      [Enum.INVOICE_STATUS.PARTIAL]: { title: <this.Translate id="text_partial_pay" />, color: "#52c41a"},
      [Enum.INVOICE_STATUS.PAID]: { title: <this.Translate id="text_paid" />, color: "#52c41a"},
    };

    this.service = InvoiceService;

    this.employeeList = [{
      id: "",
      fullName: <this.Translate id="text_all_employee"/>
    }];
    this.storeList = [{
      id: "",
      name: <this.Translate id="text_all_store"/>
    }];

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
        render: status => {
          if(status || status >= 0){
            const statusValue = this.INVOICE_STATUS_STR[status];
            const statusColor = statusValue.color;
            const stepTitle = statusValue.title;
            return <Tag color={statusColor} style={{width: 100, textAlign: "center", margin: 0}}>{stepTitle}</Tag>;
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
              <Menu.Item>
                <this.Link to={`/transactions/update-invoice/${record.id}`}>
                  <Icon type="edit" style={{marginRight: 10}} /> <this.Translate id="text_edit" />
                </this.Link>
              </Menu.Item>
              <Menu.Item>
                <this.Link to={`/transactions/detail-invoice/${record.id}`}>
                  <Icon type="eye" style={{marginRight: 10}} /> <this.Translate id="text_view_invoice" />
                </this.Link>
              </Menu.Item>
              {
                record.status === Enum.INVOICE_STATUS.PAID ?
                  <Menu.Item>
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
                : null
              }
              <Menu.Item onClick={() => this.handleReturn(record)}>
                <Icon type="retweet" style={{marginRight: 10}} /> <this.Translate id="text_return" />
              </Menu.Item>
            </Menu>
          );
          return <div className="wrap-product-name" style={{display: "flex"}}>
            {invoiceNumber}
            <Dropdown className="product-row-option" overlay={menu}>
              {/*eslint-disable-next-line*/}
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
          total = total - this.Util.floor(record.discount);
          if (total < 0) total = 0;
          return this.Util.formatCurrency(total);
        }
      }
    ];
  }

  componentDidMount() {
    const params = new URLSearchParams(window.location.search);
    if (params.get("limit")) {
      this.pageSize = params.get("limit");
    }

    if (params.get("offset")) {
      this.setState({current: params.get("offset")});
    }

    if (params.get("search")) {
      this.props.form.setFieldsValue({number: params.get("search")});
    }

    if (params.get("start")) {
      this.props.form.setFieldsValue({createdAt: [moment(params.get("start")), moment(params.get("end"))]});
    }

    if (params.get("locationId")) {
      this.props.form.setFieldsValue("locationId", params.get("locationId"));
    }
    this.fetchList();
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

  fetchList() {
    let searchKey = "";
    let filter = {};
    let locationId = 0;
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

    if (params.get("search")) {
      searchKey = JSON.stringify({column: this.columnFilterWithKey, value: params.get("search")});
    }

    if (params.get("start")) {
      ranges = JSON.stringify({column: "invoiceDate", value: [params.get("start"), params.get("end")]});
    }

    if (params.get("locationId")) {
      locationId = params.get("locationId");
    }

    offset = (offset - 1) * limit;
    this.setState({loading: true});
    this.service.lists(limit, offset, "", "", filter, searchKey, ranges, locationId)
    .then((response) => {
      this.setState({data: response && response.data});
    })
    .catch((err) => console.log("error", err))
    .finally(() => this.setState({loading: false}));
  }

  async handlePrintReceipt(id) {
    const detail = (await TransactionService.detail(id)).data.data;
    detail.receiptTemplate = 2;
    this.setState({
      detail
    });
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

  getProductTaxList(productOrderList) {
    return POSUtil.appendProductTaxList(productOrderList);
  }

  getTaxAmount(data) {
    return data.total - data.totalExcludeTax;
  }

  handleReturn(rowData) {
    if (rowData.step === Enum.TRANSACTION_STEP.PAID || rowData.step === Enum.TRANSACTION_STEP.CREDIT) {
      swal({
        title: this.CATranslate("text_confirm_return_invoice", this.props.locale),
        text: this.CATranslate("text_message_return_invoice", this.props.locale),
        icon: "warning",
        buttons: [this.CATranslate("text_cancel", this.props.locale), this.CATranslate("text_ok", this.props.locale)],
        dangerMode: true,
      })
      .then(ok => {
          if (ok) {
            TransactionService.returnTransaction(rowData.id)
            .then(() => {
              swal({
                icon: "success",
                title: "Success!",
                text: "Your transaction has been returned",
                buttons: false,
                timer: 1500
              })
              .then(() => {
                super.componentDidMount();
              });
            });
          }
      });
    } else {
      this.MessageV2.warning(this.CATranslate("text_error_allow_return", this.props.locale));
    }
  }

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

  buttonActionCollection() {
    return [this.renderButtonAddNew()];
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
  
  renderButtonDelete(){
    return <this.Button type="info" loading={this.props.detail.fetching && this.state.isRequestReprint} onClick={this.handleReceivePayment}>
      <span className="icon-payment-report icon-padding-right text-uppercase"></span><this.Translate id="text_receive_payment" />
    </this.Button>;
  }

  renderButtonSearch(fetchingProps){
    return <this.Col md="2" className="wrap-btn-search">
      <div className="ant-form-item-label" style={{visibility: "hidden", lineHeight: "28px"}}>
        <label htmlFor="status" className="" title="">Filter</label>
      </div>
      <this.Button htmlType="submit" type="default" loading={this.state.isClickFilter && fetchingProps.fetching}>
        <span className="icon-search icon-padding-right text-uppercase"></span>{<this.Translate id="text_search" />}
      </this.Button>
    </this.Col>;
  }

  renderFilterRecord() {
    const fetchingProps = this.props[this.fetchingProp];
    return this.props.form == null ?
        ""
        :
        <this.Form onSubmit={this.handleSubmitFilter}>
          <this.Row className="main-search-layout">
            <this.Col md="2">
              <this.InputText
                name="number"
                placeholder={this.CATranslate("text_search_for_sale_no", this.props.locale)}
                label={<this.Translate id="text_search_for_sale_no" />}
                form={this.props.form}/>
            </this.Col>
            <this.Col md="2">
              <this.DateRangePicker
                name="createdAt"
                defaultValue={this.state.setDefaultDate}
                label={<this.Translate id="text_date" />}
                form={this.props.form}
                ranges={[]} />
            </this.Col>
            <this.Col md="2">
              <this.Select
                name="locationId"
                dataSource={this.storeList.concat(this.props.storeLocation.list)}
                defaultValue=""
                valueKey="id"
                label={<this.Translate id="text_store" />}
                form={this.props.form}/>
            </this.Col>
            {this.renderButtonSearch(fetchingProps)}
          </this.Row>
        </this.Form>;
  }

  handleSubmitFilter(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const params = new URLSearchParams(window.location.search);
        if (values.number) {
          params.set("search", values.number);
        } else {
          params.delete("search");
        }

        if (values.createdAt && values.createdAt.length) {
          params.set("start", moment(values.createdAt[0]).format("YYYY-MM-DD"));
          params.set("end", moment(values.createdAt[1]).format("YYYY-MM-DD"));
        } else {
          params.delete("start");
          params.delete("end");
        }

        if (values.locationId) {
          params.set("locationId", values.locationId);
        } else {
          params.delete("locationId");
        }

        this.Util.pushParamsToURL(this.pathname, params.toString());
        this.fetchList();
      }
    });
  }

  renderPagination(fetchingProp, className = "float-right") {
    const data = this.state.data && this.state.data.pagination;
    let pagination = {
      total: data && data.total,
      pageSize: data && data.limit,
      current: data && this.state.current,
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
    return (
      <this.Table
        bordered={true}
        rowKey="id"
        loading={this.state.loading}
        columns={this.columns}
        dataSource={this.state.data.data}
        onChange={this.onChange}
      />
    );
  }

  render() {
    const {detail} = this.state;
    return (
      <React.Fragment>
        <div style={{display: "none"}}>
          <ReceiptTemplate 
            formData={detail} 
            receiptTemplate={this.props.receiptTemplate.data}
            locale={this.props.locale}
            ref={re => this.receiptRef = re} />
        </div>
        {super.render()}
      </React.Fragment>
    );
  }

}