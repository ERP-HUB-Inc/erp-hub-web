import React from "react";
import Modal from "../../../../../common/components/shares/Modal";
import InventoryUtil from "../../../../../inventory/utils";
import "./index.css";

export default class FormItem extends Modal {
  constructor(props){
    super(props);
    this.columns = [
      {
        title: <this.Translate id="text_description" />,
        dataIndex: "name",
        key: "name"
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
        render: (price) => this.Util.formatCurrency(price) 
      },
      {
        title: <this.Translate id="text_amount" />,
        dataIndex: "amount",
        key: "amount",
        render: (text, record, index) => this.Util.formatCurrency(record.price * record.quantity) 
      }
    ];
  }

  getProductOrderList(data) {
    let productOrderList = [];
    if (this.Util.isValidCollectionInObj(data, "transactionEntries")) {
      data.transactionEntries.forEach(transactionEntry => {
        if (transactionEntry.productVariant && transactionEntry.productVariant.product) {
          const productVariant = transactionEntry.productVariant;
          productOrderList.push({
            quantity: transactionEntry.quantity,
            name: InventoryUtil.getProductName(productVariant.product),
            price: transactionEntry.price
          });
        }
      });
    }
    return productOrderList;
  }

  render() {
    const {formData, customer, form, locale} = this.props;
    const productOrderList = this.getProductOrderList(formData);
    return (
    
      <div className="receive-payment-layout">

        <div style={{display: "flex", flexDirection: "row", height: "100%"}}>
          <div style={{flexGrow: 1, marginBottom: 15}}>
            <div className="main-table-receive main-receive-payment">
              <this.Table 
                dataSource={productOrderList}
                columns={this.columns}
                locale={{emptyText: <this.Translate id="table_empty_data"/>}}
              />
            </div>
          </div>
          <div style={{width: 320, marginLeft: 15, marginBottom: 15}}>


            <div className="main-receive-payment" style={{height: "100%", overflow: "auto"}}>

              <div className="showSummery">
                <div className="right"><this.Translate id="text_invoice_no"/></div>
                <div className="left">: {formData ? formData.receiptNumber : "N/A"}</div>
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
                <div className="right" style={{ marginTop: "-22px" }}><this.Translate id="text_payment_date"/></div>
                <div className="left">
                  <this.DatePickers
                    defaultValue={this.Util.formatDatePicker(formData.createdAt)} 
                    name="paymentDate"
                    placeholder={this.CATranslate("text_payment_date", locale)}
                    required={true}
                    form={form}/> 
                </div>
              </div>
              <div className="showSummery" style={{ marginTop: "-4px" }}>
                <div className="right" style={{ marginTop: "-22px" }}><this.Translate id="text_receive_amount"/></div>
                <div className="left">
                  <this.InputNumber
                    name="receiveAmount"
                    placeholder={this.CATranslate("text_receive_amount", locale)}
                    // required={true}
                    isAutoFocus={true}
                    form={form}/> 
                </div>
              </div>

              <div className="show-searchroom-layout">
                <div className="right" />
                <div className="left" style={{marginTop: 10}}>
                  <this.Button htmlType="submit" style={{ width: "100%" }} type="info">
                    <span className="icon-payment-report icon-padding-right text-uppercase"></span> <this.Translate id="text_receive"/>
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