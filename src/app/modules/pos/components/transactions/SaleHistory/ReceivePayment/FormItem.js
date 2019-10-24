import React from "react";
import Modal from "../../../../../common/components/shares/Modal";
import InventoryUtil from "../../../../../inventory/utils";
import InventoryEnum from "../../../../../inventory/enums";
import "./index.css";

export default class FormItem extends Modal {
  constructor(props){
    super(props);
    this.state = {
      transactionPaymentEntries: [],
      ishandlePayment: true
    };
    this.columns = [
      {
        title: <this.Translate id="text_product_name" />,
        dataIndex: "productVariant",
        key: "name",
        render: productVariant => {
          return (
            <div>
              <div>{InventoryUtil.getProductName(productVariant.product) }</div>
              {
                productVariant.product.productOption === InventoryEnum.PRODUCT_VARIANT ?
                  <div className="variant-name" style={{ fontSize: "10px" }}>{ productVariant.name }</div>
                : ""
              }
            </div>
          );
        }
      },
      {
        title: <this.Translate id="text_product_code" />,
        dataIndex: "productVariant",
        key: "barcode",
        width: 100,
        render: productVariant => productVariant.barcode
      },
      {
        title: <this.Translate id="text_quantity" />,
        dataIndex: "quantity",
        key: "quantity"
      },
      {
        title: <this.Translate id="text_price" />,
        dataIndex: "price",
        key: "price",
        align: "right",
        render: price => this.Util.formatCurrency(price) 
      },
      {
        title: <this.Translate id="text_amount" />,
        dataIndex: "price",
        key: "amount",
        align: "right",
        render: (price, record) => this.Util.formatCurrency(price * record.quantity) 
      }
    ];
    this.handleReceive = this.handleReceive.bind(this);
  }

  handleReceive () {
    this.props.transactionPaymentEntries(this.state.transactionPaymentEntries);
  }
  
  getSummaryTotal(data) {
    return data.total - (data.discount + this.getTaxAmount(data));
  }

  getTaxAmount(data) {
    return data.total - data.totalExcludeTax;
  }

  getProductOrderList(data) {
    let transactionPaymentEntries = [];
    if(data.transactionPayment[0]){
      if(this.state.ishandlePayment){
        transactionPaymentEntries.push({
          tender: data.total,
          balance: 0,
          change: 0,
          paymentMethodName: data.transactionPayment[0].paymentMethod.name,
          paymentMethodId: data.transactionPayment[0].paymentMethodId
        });
  
        this.setState({
          transactionPaymentEntries: transactionPaymentEntries,
          ishandlePayment: false
        });
  
      }
         
    }
    return transactionPaymentEntries;
  }
   
  render() {
    const {formData, customer, locale, form} = this.props;
    this.getProductOrderList(formData);
    return (
    
      <div className="receive-payment-layout">

        <div style={{display: "flex", flexDirection: "row", height: "100%"}}>
          <div style={{flexGrow: 1, marginBottom: 15}}>
            <div className="main-table-receive main-receive-payment">
              <this.Table
                dataSource = {formData.transactionEntries}
                columns={this.columns}
                locale={{emptyText: <this.Translate id="table_empty_data"/>}}
              />
            </div>
          </div>
          <div style={{width: 320, marginLeft: 15, marginBottom: 15}}>


            <div className="main-receive-payment" style={{height: "100%", overflow: "auto"}}>

              <div className="showSummery">
                <div className="right"><this.Translate id="text_invoice_no"/></div>
                <div className="left">: {formData ? formData.number : "N/A"}</div>
              </div>
              <div className="showSummery">
                <div className="right"><this.Translate id="text_customer"/></div>
                <div className="left">: {customer ? customer.customer.firstName + customer.customer.lastName : "N/A" }</div> 
              </div>
              <div className="showSummery">
                <div className="right"><this.Translate id="text_phone_number"/></div>
                <div className="left">: {customer && customer.customer.phoneNumber ? customer.customer.phoneNumber : "N/A" }</div>
              </div>
              <div className="showSummery">
                <div className="right"><this.Translate id="text_payment_date"/></div>
                <div className="left">
                  <this.DatePickers
                    defaultValue={this.Util.formatDatePicker(formData.payDate)} 
                    name="payDate"
                    placeholder={this.CATranslate("text_payment_date", locale)}
                    required={true}
                    form={form}/> 
                </div>
              </div>
              <div className="showSummery">
                <div className="right"><this.Translate id="text_sub_total"/></div>
                <div className="left">: {this.formatCurrency(this.getSummaryTotal(formData))}</div>
              </div>
              <div className="showSummery">
                <div className="right"><this.Translate id="text_tax" /></div>
                <div className="left">: {this.formatCurrency(this.getTaxAmount(formData))}</div>
              </div>
              <div className="showSummery">
                <div className="right"><this.Translate id="text_discount" /></div>
                <div className="left">: {this.formatCurrency(formData.discount)}</div>
              </div>
              <div className="showSummery">
                <div className="right"><this.Translate id="text_amount_to_pay"/></div>
                <div className="left">: {this.formatCurrency(formData.total)}</div>
              </div>

              <div className="show-searchroom-layout">
                <div className="right" />
                <div className="left" style={{marginTop: 24}}>
                <this.Button htmlType="submit" onClick={this.handleReceive} style={{ width: "100%" }} loading={this.props.updateReceivePayment.updating} type="info">
                  <span className="icon-payment-report icon-padding-right text-uppercase"></span> { this.props.buttonReceivePaymentTitle ? this.props.buttonReceivePaymentTitle : <this.Translate id="text_receive_payment" /> }
                </this.Button>
                </div>
              </div>

            </div>

          </div>

        </div>
            
        }
      </div>
       
    );
  }
}

FormItem.defaultProps = {
  formData: {
    receiveAmount: "",
    paymentDate: ""
  }
};