import React from "react";
import swal from "sweetalert";
import List from "../List";
import Receipt from "../RetailSale/Receipt";
import Enum from "../../../enums";
import POSUtil from "../../../utils";
import Detail from "../../../containers/transactions/SaleHistory/Detail";
import Constant from "../../../constants/transactions/transaction";
import TransactionAction from "../../../action/transaction/transaction";
import ReceivePaymentAction from "../../../action/transaction/receivePayment";
import TransactionService from "../../../services/transactions/TransactionService";
import ReceiePaymentForm from "../../../containers/transactions/SaleHistory/ReceivePayment";
import LocationAction from "../../../action/settings/location";
import InventoryEnum from "../../../../inventory/enums";
import history from "../../../../../modules/common/router/history";
import ReceiptTemplateAction from "../../../../pos/action/settings/receiptTemplate";

export default class SaleHistoryList extends List {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      isRequestReturn: false,
      setDefaultDate: [],
      reprintReceiptContent: null,
      isRequestReprint: false,
      isRequestShowDetail: false,
      isRequestReceivePayment: false
    };
    this.title = <this.Translate id="text_sales"/>;
    this.fetchingProp = "list";
    this.columnFilterWithKey = ["firstName", "lastName", "email", "phoneNumber"];
    this.TRANSACTION_TYPE_STR = [
      {value: -1, name: <this.Translate id="text_all_sales"/>},
      {value: Enum.TRANSACTION_TYPE.RECEIPT, name: <this.Translate id="text_receipt"/>},
      {value: Enum.TRANSACTION_TYPE.INVOICE, name: <this.Translate id="text_invoice"/>},
      // {value: Enum.TRANSACTION_TYPE.PRE_ORDER, name: <this.Translate id="text_pre_order"/>},
      {value: Enum.TRANSACTION_TYPE.CREDIT_NOTE, name: <this.Translate id="text_credit_note"/>},
      {value: Enum.TRANSACTION_TYPE.RETURN, name: <this.Translate id="text_return"/>}
    ];

    this.TRANSACTION_STATUS_STR = {
      [Enum.TRANSACTION_STEP.PROCESS]: { title: <this.Translate id="text_process" />, color: "processing" },
      [Enum.TRANSACTION_STEP.VOID]: { title: <this.Translate id="text_void" />, color: "warning" },
      [Enum.TRANSACTION_STEP.RETURN]: { title: <this.Translate id="text_return" />, color: "warning"},
      [Enum.TRANSACTION_STEP.COMPLETED]: { title: <this.Translate id="text_completed" />, color: "success"},
      [Enum.TRANSACTION_STEP.IN_DELIVERY]: { title: <this.Translate id="text_in_delivery" />, color: "success"},
      [Enum.TRANSACTION_STEP.CREDIT]: { title: <this.Translate id="text_credit" />, color: "error"},
      [Enum.TRANSACTION_STEP.PAID]: { title: <this.Translate id="text_paid" />, color: "success"}
    };

    this.action = TransactionAction;
    this.service = TransactionService;
    this.handleRePrint = this.handleRePrint.bind(this);
    this.handleReceivePayment = this.handleReceivePayment.bind(this);
    this.handleReturn = this.handleReturn.bind(this);
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
        dataIndex: "registerDate",
        key: "createdAt",
        render: registerDate => this.Util.formatDateTime(registerDate),
        sorter: true
      },
      {
        title: <this.Translate id="text_transaction_no" />,
        dataIndex: "number",
        key: "number",
        width: 140,
        sorter: true
      },
      {
        title: <this.Translate id="text_reference_no" />,
        dataIndex: "referenceNo",
        key: "referenceNo",
        width: 150,
        sorter: true,
        render: referenceNo => referenceNo ? referenceNo : this.emptyText
      },
      {
        title: <this.Translate id="text_type" />,
        dataIndex: "type",
        key: "type",
        width: 100,
        render: type => {
          const valueType = this.TRANSACTION_TYPE_STR.find(transactionType => transactionType.value === type);
          if (valueType) {
            return <this.TagLabel color={[Enum.TRANSACTION_TYPE.CREDIT_NOTE].includes(valueType.value) ? "red" : "blue"}>{valueType.name}</this.TagLabel>;
          }

          return "";
        },
        sorter: true
      },
      {
        title: <this.Translate id="text_seller" />,
        dataIndex: "user",
        key: "user",
        render: user => user ? user.userName : this.emptyText,
        sorter: true
      },
      {
        title: <this.Translate id="text_customer" />,
        dataIndex: "customer",
        key: "customer",
        render: customer => {
          let customerName = "";
          if (customer) {
            customerName = `${customer.firstName} ${customer.lastName}`;

            if (customer.isSystem === this.Enum.IS_SYSTEM) {
              customerName = <this.TagLabel color="blue">
                <this.Translate id="text_walkin" />
              </this.TagLabel>;
            }
          }
          return customer ? customerName : this.emptyCell;
        },
        sorter: true
      },
      {
        title: <this.Translate id="text_sub_total" />,
        dataIndex: "totalExcludeTax",
        key: "totalExcludeTax",
        render: totalExcludeTax => this.formatCurrency(totalExcludeTax),
        sorter: true
      },
      {
        title: <this.Translate id="text_tax" />,
        dataIndex: "tax",
        key: "tax",
        render: (text, record, index) => {
          return this.formatCurrency(record.total - record.totalExcludeTax);
        },
        sorter: true
      },
      {
        title: <this.Translate id="text_discount" />,
        dataIndex: "discount",
        key: "discount",
        render: discount => this.formatCurrency(discount),
        sorter: true
      },
      {
        title: <this.Translate id="text_sale_total" />,
        dataIndex: "total",
        key: "total",
        render: (total, record) => this.formatCurrency(total - record.discount),
        sorter: true
      },
      {
        title: <this.Translate id="text_status" />,
        dataIndex: "step",
        key: "step",
        render: step => {
          if(step){
            const stepValue = this.TRANSACTION_STATUS_STR[step];
            let stepColor = stepValue.color;
            let stepTitile = stepValue.title;
            return <this.Badge style={{ textTransform: "uppercase" }} status={stepColor} text={stepTitile} />;
          }
        },
        sorter: true
      },
      {
        title: <this.Translate id="text_action" />,
        key: "action",
        align: "center",
        width: 100,
        render: (text, record) => {
          return <this.Button className="danger mg-right text-uppercase"  onClick={() => this.handleReturn(record, this.state.selectedRows)}>
            <span className="icon-sale-return icon-padding-right"></span>
            <this.Translate id="text_return" />
          </this.Button>;
        }
      }
    ];
  }

  componentDidMount() {
    super.componentDidMount();
    this.Util.removeFullScreen();
    this.requestSubDataAsync();
  }  

  componentDidUpdate() {
    const element = document.getElementById("reprint-receipt");
    if (
      this.props.detail.fetched &&
      this.props.detail.data &&
      this.props.receiptTemplate.fetched) {
      const isRequestClearReceiptMarginLeft = false;
      const receiptContent = this.renderReceipt(isRequestClearReceiptMarginLeft);
      const detailTransactionDisplay = this.renderReceipt();

      if (this.state.isRequestReprint) {
        this.props.dispatch(TransactionAction.reset(Constant.RESET_DETAIL_TRANSACTION));
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

    if (element && this.state.isRequestReprint) {
      this.Util.printElem(element.innerHTML);
      
      this.setState({
        selectedRowKeys: [],
        reprintReceiptContent: null,
        isRequestReprint: false
      });
    }

    if(this.state.isRequestReceivePayment){
      this.props.dispatch(TransactionAction.detail({id: this.state.selectedListIds[0]}));
      this.props.dispatch(ReceivePaymentAction.showForm());
      this.setState({
        modalConten: <ReceiePaymentForm id={this.state.selectedListIds[0]} customer={this.state.selectedRows[0]} />,
        loadingPopup: false,
        isRequestReceivePayment: false
      });
    }



    if(this.state.isRequestReturn && this.props.detail.data){
      history.push("/transactions/return");
      this.setState({
        isRequestReturn: false
      });
    }
    
  }

  componentWillUpdate(nextProps) {
    if (nextProps.updateReceivePayment.updated) {
      super.componentDidMount();
      nextProps.dispatch(ReceivePaymentAction.reset());
    }
  }

  renderReceipt(isRequestClearReceiptMarginLeft = true) {
    const customerPayment = this.getCustomerPaymentList(this.props.detail.data);
    const productOrderList = this.getProductOrderList(this.props.detail.data);
    const productTaxList = this.getProductTaxList(productOrderList);
    return <Receipt
      data={this.props.detail.data}
      customer={this.props.detail.data.customer}
      isRequestClearMarginLeft={isRequestClearReceiptMarginLeft}
      isRequestShowDetail={this.state.isRequestShowDetail}
      receiptTemplate={this.props.receiptTemplate.data}
      currentUser={this.getCurrentUserForRePrintReceipt(this.props.detail.data)}
      customerPaymentList={customerPayment.customerPaymentList}
      productList={productOrderList}
      productTaxList={productTaxList}
      summaryTotal={this.getSummaryTotal(this.props.detail.data)}
      summaryTax={POSUtil.getSummaryTax(productTaxList, <this.Translate id="text_no_tax"/>, this.CATranslate("text_taxes", this.props.locale))}
      changeAmount={customerPayment.changeAmount}
      taxAmount={this.getTaxAmount(this.props.detail.data)}
      discountAmount={this.props.detail.data.discount} />;
  }

  requestSubDataAsync() {
    return new Promise(() => {
      setTimeout(() => {
        this.props.dispatch(LocationAction.fetch(100));
        this.props.dispatch(ReceiptTemplateAction.default());
      }, 2000);
    });
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

    if (data.client) {
      currentUser.setting.storeName = data.client.storeName;
      currentUser.setting.address = data.client.address;
      currentUser.setting.phoneNumber = data.client.phoneNumber;
      currentUser.setting.businessName = data.client.businessName;
    }

    if (data.user) {
      currentUser.currentUser.fullName = data.user.fullName;
    }

    return currentUser;
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

  handleRePrint() {
    new Promise(() => {
      const selectLength = this.state.selectedListIds.length;
      this.setState({
        isRequestReprint: true
      });

      if (selectLength === 0 && this.state.selectedListIds) {
        this.MessageV2.warning(this.CATranslate("text_reprint_warning_1", this.props.locale));
      } else if (selectLength > 1) {
        this.MessageV2.warning(this.CATranslate("text_reprint_warning_2", this.props.locale));
      } else {
        this.props.dispatch(TransactionAction.detail({id: this.state.selectedListIds[0]}));
      }
    });
  }

  handleReceivePayment(){
    const selectLength = this.state.selectedListIds.length;
    if(selectLength && selectLength === 1){
      this.setState({
        loadingPopup: true,
        isRequestReceivePayment: true
      });
    }else if(selectLength > 1){
      this.MessageV2.warning(this.CATranslate("text_allow_select_one_record", this.props.locale));
    }else{
      this.MessageV2.warning(this.CATranslate("text_please_select_record", this.props.locale));
    }
   
  }

  handleShowFormEdit(rowData) {
    this.props.dispatch(TransactionAction.detail({id: rowData.id}));
    this.setState({
      loadingPopup: true,
      isRequestShowDetail: true
    });
  }

  buttonActionCollection() {
    return [];
  }

  renderButtonAddNew() {
    return <this.Button className="mg-right text-uppercase" type="info" loading={this.props.detail.fetching && this.state.isRequestReprint} onClick={this.handleRePrint}>
      <span className="icon-print icon-padding-right text-uppercase"></span><this.Translate id="text_print" />
      <div id="receiptLogoPreLoading" style={{ display: "none" }}>
        {<img style={{ width: 100 }} alt="" src={this.Util.getProductImage(this.props.receiptTemplate && this.props.receiptTemplate.data ? this.props.receiptTemplate.data.logo : "", "general").url} />}
      </div>
    </this.Button>;
  }
  
  renderButtonDelete(){
    return <this.Button type="info" loading={this.props.detail.fetching && this.state.isRequestReprint} onClick={this.handleReceivePayment}>
      <span className="icon-payment-report icon-padding-right text-uppercase"></span><this.Translate id="text_receive_payment" />
    </this.Button>;
  }

  renderFilterType(){
    return <this.Col md="2">
      <this.Select
        name="type"
        placeholder={this.CATranslate("text_type", this.props.locale)}
        dataSource={this.TRANSACTION_TYPE_STR}
        label={<this.Translate id="text_type" />}
        form={this.props.form} />
    </this.Col>;
  }

  renderButtonSearch(fetchingProps){
    return <this.Col md="2" className="wrap-btn-search">
      <div className="ant-form-item-label" style={{visibility: "hidden"}}>
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
            <this.Col md="2" className="hidden">
              <this.InputText
                name="customer"
                placeholder={this.CATranslate("text_search_for_customer", this.props.locale)}
                label={<this.Translate id="text_customer" />}
                form={this.props.form}/>
            </this.Col>
            <this.Col md="2">
              <this.DateRangePicker
                name="createdAt"
                defaultValue={this.state.setDefaultDate}
                label={<this.Translate id="text_date" />}
                form={this.props.form}
                ranges={this.dateRangeDataSource()} />
            </this.Col>
            {this.renderFilterType()}
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
    if (this.action != null) {
      e.preventDefault();
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          let filter = {};
          if (values.type >= 0) {
            filter["type"] = [values.type];
          }

          if (values.locationId) {
            filter["locationId"] = [values.locationId];
          }

          if (values.number) {
            filter["number"] = [values.number];
          }
          
          let rangFilter = "";
          if (values.createdAt && values.createdAt.length > 0) {
            rangFilter = JSON.stringify({
              column: "registerDate",
              value: [
                this.Util.formatDateForMYSQL(values.createdAt[0]) + " 00:00:00",
                this.Util.formatDateForMYSQL(values.createdAt[1]) + " 23:59:59"
              ]});
          }
          
          filter = JSON.stringify(filter);

          let searchKey = "";

          if (values.customer) {
            searchKey = JSON.stringify({column: this.columnFilterWithKey, value: values.customer});
          }


          this.props.dispatch(this.action.fetch(this.pageSize, (this.state.current - 1) * this.pageSize, "", "", filter, searchKey, rangFilter));
          this.setState({isClickFilter: true});
        }
      });
    }
  }

}