import React from "react";
import List from "../List";
import Receipt from "../RetailSale/Receipt";
import Enum from "../../../enums";
import POSUtil from "../../../utils";
import Constant from "../../../constants/transactions/transaction";
import TransactionAction from "../../../action/transaction/transaction";
import TransactionService from "../../../services/transactions/TransactionService";
import LocationAction from "../../../action/settings/location";
import UserAction from "../../../../common/actions/users";
import InventoryUtil from "../../../../inventory/utils";
import InventoryEnum from "../../../../inventory/enums";
import ReceiptTemplateAction from "../../../../pos/action/settings/receiptTemplate";

export default class SaleHistoryList extends List {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      setDefaultDate: [],
      reprintReceiptContent: null
    };
    this.columns = new Column();
    this.title = <this.Translate id="text_sale_history"/>;
    this.fetchingProp = "list";
    this.columnFilterWithKey = ["number", "firstName", "lastName", "company", "email", "phoneNumber", "address"];
    this.TRANSACTION_TYPE_STR = [
      {value: -1, name: <this.Translate id="text_all_sales"/>},
      {value: Enum.TRANSACTION_TYPE.RECEIPT, name: <this.Translate id="text_receipt"/>},
      {value: Enum.TRANSACTION_TYPE.INVOICE, name: <this.Translate id="text_invoice"/>},
      {value: Enum.TRANSACTION_TYPE.PRE_ORDER, name: <this.Translate id="text_pre_order"/>},
      {value: Enum.TRANSACTION_TYPE.CREDIT_NOTE, name: <this.Translate id="text_credit_note"/>},
      {value: Enum.TRANSACTION_TYPE.RETURN, name: <this.Translate id="text_return"/>}
    ];
    this.action = TransactionAction;
    this.service = TransactionService;
    this.handleRePrint = this.handleRePrint.bind(this);
    this.employeeList = [{
      id: "",
      fullName: <this.Translate id="text_all_employee"/>
    }];
    this.storeList = [{
      id: "",
      name: <this.Translate id="text_all_store"/>
    }];
  }

  componentDidMount() {
    super.componentDidMount();
    this.props.dispatch(LocationAction.fetch(100));
    this.props.dispatch(UserAction.fetch(100));
    this.props.dispatch(ReceiptTemplateAction.default());

    if(parseInt(this.Util.getParameterByName("salehistory"), 10) === 1) {
      this.handleSubmitCurrentSearchFilter();
    }

  }  

  componentDidUpdate() {
    const element = document.getElementById("pos-receipt-preview");
    if (this.props.detail.fetched && this.props.receiptTemplate.fetched && this.props.detail.data) {
      const customerPayment = this.getCustomerPaymentList(this.props.detail.data);
      const productOrderList = this.getProductOrderList(this.props.detail.data);
      const productTaxList = this.getProductTaxList(productOrderList);
      this.setState({
        reprintReceiptContent: <div style={{display: "none"}} id="reprint-receipt"><Receipt
          data={this.props.detail.data}
          receiptTemplate={this.props.receiptTemplate.data}
          currentUser={this.getCurrentUserForRePrintReceipt(this.props.detail.data)}
          customerPaymentList={customerPayment.customerPaymentList}
          productList={productOrderList}
          productTaxList={productTaxList}
          summaryTotal={this.getSummaryTotal(this.props.detail.data)}
          summaryTax={POSUtil.getSummaryTax(productTaxList, <this.Translate id="text_no_tax"/>, this.CATranslate("text_taxes", this.props.locale))}
          changeAmount={customerPayment.changeAmount}
          taxAmount={this.getTaxAmount(this.props.detail.data)}
          discountAmount={this.props.detail.data.discount} />
        </div>
      });
      this.props.dispatch(TransactionAction.reset(Constant.RESET_DETAIL_TRANSACTION));
    }

    if (element) {
      this.Util.printElem(element.innerHTML);

      this.setState({
        selectedRowKeys: [],
        reprintReceiptContent: null
      });
    }

  }

  getCurrentUserForRePrintReceipt(data) {
    let currentUser = {
      setting: {
        storeName: "",
        address: "",
        phoneNumber: ""
      },
      currentUser: {
        fullName: ""
      }
    };

    if (data.client) {
      currentUser.setting.storeName = data.client.storeName;
      currentUser.setting.address = data.client.address;
      currentUser.setting.phoneNumber = data.client.phoneNumber;
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
            name: InventoryUtil.getProductName(productVariant.product),
            variantName: productVariant.product.productOption === InventoryEnum.PRODUCT_VARIANT ? productVariant.name : "",
            tax: tax.taxRate/100,
            taxDescription: tax,
            price: transactionEntry.price,
            newPrice: transactionEntry.price
          });
        }
      });
    }
    return productOrderList;
  }

  getSummaryTotal(data) {
    return {
      subTotalAfterDiscount: data.total - (data.discount + this.getTaxAmount(data))
    };
  }

  getProductTaxList(productOrderList) {
    return POSUtil.appendProductTaxList(productOrderList);
  }

  getTaxAmount(data) {
    return data.total - data.totalExcludeTax;
  }
  handleRePrint() {
    const selectLength = this.state.selectedListIds.length;

    if (selectLength === 0 && this.state.selectedListIds) {
      this.Message.error(this.CATranslate("text_reprint_warning_1", this.props.locale));
    } else if (selectLength > 1) {
      this.Message.error(this.CATranslate("text_reprint_warning_2", this.props.locale));
    } else {
      this.props.dispatch(TransactionAction.detail({id: this.state.selectedListIds[0]}));
    }
  }

  renderActionButton(){
    return(
      <this.Button type="info" loading={this.props.detail.fetching} onClick={this.handleRePrint}>
        <span className="icon-print icon-padding-right text-uppercase"></span><this.Translate id="text_print"/>
      </this.Button>
    );
  }

  
  renderFilterRecord() {
    const fetchingProps = this.props[this.fetchingProp];
    return(
      this.props.form == null ?
        ""
        :
        <this.Form onSubmit={this.handleSubmitFilter}>
          <this.Row className="main-search-layout">
            <this.Col md="2">
              <this.InputText
                name="number"
                placeholder={this.CATranslate("text_search_for_sale_no", this.props.locale)}
                label={<this.Translate id="input-sale-history-sale-number" />}
                form={this.props.form}/>
            </this.Col>
            <this.Col md="2">
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
                form={this.props.form}/>
            </this.Col>
            <this.Col md="2">
              <this.Select
                name="type"
                placeholder={this.CATranslate("text_type", this.props.locale)}
                dataSource={this.TRANSACTION_TYPE_STR}
                label={<this.Translate id="text_type" />}
                form={this.props.form}/>
            </this.Col>
            <this.Col md="2">
              <this.Select
                name="locationId"
                dataSource={this.storeList.concat(this.props.storeLocation.list)}
                defaultValue=""
                valueKey="id"
                label={<this.Translate id="input-sale-history-store" />}
                form={this.props.form}/>
            </this.Col>
            <this.Col md="2">
              <this.Select
                name="userId"
                dataSource={this.employeeList.concat(this.props.users.list)}
                defaultValue=""
                valueKey="id"
                nameKey="fullName"
                label={<this.Translate id="text_employee" />}
                form={this.props.form}/>
            </this.Col>
            <this.Col md="2" className="wrap-btn-search">
              <this.Button htmlType="submit" type="info"  loading={this.state.isClickFilter && fetchingProps.fetching}>
                <span className="icon-search icon-padding-right text-uppercase"></span>{<this.Translate id="text_search" />}
              </this.Button> 
            </this.Col>
            
          </this.Row>
          {this.state.reprintReceiptContent}
        </this.Form>
    );
  }

  handleSubmitCurrentSearchFilter(){

    let getCurrentDate = new Date().toISOString().slice(0,10); 

    this.setState({
      setDefaultDate : [this.Util.formatDatePicker(getCurrentDate),this.Util.formatDatePicker(getCurrentDate)]
    });


    let rangFilter = "";
    let filter = "";

    rangFilter = JSON.stringify({
      column: "registerDate",
      value: [
        this.Util.formatDateForMYSQL(getCurrentDate) + " 00:00:00",
        this.Util.formatDateForMYSQL(getCurrentDate) + " 23:59:59"
      ]});


    let searchKey = "";

    this.props.dispatch(this.action.fetch(this.pageSize, (this.state.current - 1) * this.pageSize, "", "", filter, searchKey, rangFilter));
    this.setState({isClickFilter: true});

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

          if (values.userId) {
            filter["userId"] = [values.userId];
          }

          if (values.number) {
            filter["number"] = [values.number];
          }
          
          let rangFilter = "";
          if (values.createdAt) {
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

class Column extends List {
  constructor(props) {
    super(props);
    return [
      {
        title: <this.Translate id="text_date" />,
        dataIndex: "registerDate",
        key: "createdAt",
        render: registerDate => this.Util.formatDateTime(registerDate),
        sorter: true
      },
      {
        title: <this.Translate id="text_no" />,
        dataIndex: "number",
        key: "number",
        sorter: true
      },
      {
        title: <this.Translate id="col-sale-history-sold-by" />,
        dataIndex: "userId",
        key: "userId",
        render: (text, record) => {
          return record.user ? record.user.userName : this.emptyCell;
        },
        sorter: true
      },
      {
        title: <this.Translate id="text_customer" />,
        dataIndex: "customerId",
        key: "customerId",
        render: (text, record, index) => {
          let customerName = "";
          if (record.customer) {
            customerName = `${record.customer.firstName} ${record.customer.lastName}`;

            if (record.customer.isSystem === this.Enum.IS_SYSTEM) {
              customerName = <this.TagLabel color="blue">
                <this.Translate id="text_walkin"/>
              </this.TagLabel>;
            }
          }
          return record.customer ? customerName : this.emptyCell;
        },
        sorter: true
      },
      {
        title: <this.Translate id="text_notation" />,
        dataIndex: "description",
        key: "description",
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
        render: (text, record, index) => {
          return this.formatCurrency(record.total - record.discount);
        },
        sorter: true
      },
      {
        title: <this.Translate id="text_status" />,
        dataIndex: "status",
        key: "status",
        width: 120,
        render: value => {
          return (
            value === Enum.TRANSACTION_STATUS.PAID ?
              <this.Badge status="success" text={<this.Translate id="text_completed" />} />
              :
              <this.Badge status="error" text={<this.Translate id="select_text_deactive" />} />
          );
        },
        sorter: true
      }
    ];
  }
}