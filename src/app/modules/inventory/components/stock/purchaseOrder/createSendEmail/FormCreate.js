import React from "react";
import Enum from "../../../../enums";
import Constant from "../../../../constants/stock/purchaseOrder";
import FormItem from "./FormItem";
import Modal from "../../../../../common/components/shares/Modal";
import purchaseOrderSendEmailAction from "../../../../actions/stock/purchaseOrderSendEmail";
import PurchaseOrderAction from "../../../../actions/stock/purchaseOrder";
import "./index.css";

export default class FormCreate extends Modal {
  constructor(props) {
    super(props);
    this.title = <this.Translate id="create_stock_purchase_order_send_mail_title" />;
    this.confirmTextAction = "Are You Want to Send Email?";
    this.width = "30%";
    this.addingPropReducer = "purchaseOrderSendEmailAdd";
    this.dispatch = this.props.dispatch;
    this.handlePush = this.handlePush.bind(this);
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {

      if (!err) {      
        const listPurchase =  this.props.formvalue;

        console.log("props purchase",listPurchase);

        if(listPurchase.purchaseId == null){
          listPurchase.purchaseId = [];
        }

        const purchases = [];

        listPurchase.purchaseId.forEach((purchaseId, index) => {
          if (
            purchaseId != null || 
            listPurchase.purchaseQty[index] != null ||
            listPurchase.purchasePrice[index] != null
          ) {
            purchases.push({
              id: listPurchase.purchaseId[index],
              productId: listPurchase.productId[index],
              requestQuantity: listPurchase.purchaseQty[index],
              price: listPurchase.purchasePrice[index]
            });
          }
        });


        values = listPurchase;

        values["id"] = this.props.id;
        values["shippingFee"] = 0;
        values["requestTotal"] = 105;
        values["returnTotal"] = 0;
        values["receiveTotal"] = 0;

        values["step"] = Enum.PO_STEP.PROCESS;
        values["type"] = Enum.CLIENT_AUTO_NUMBER_TYPE.QUOTATION;
        values["status"] = 1;

        delete values["productId"];
        delete values["purchaseId"];
        delete values["purchasePrice"];
        delete values["purchaseQty"];
        delete values["requestQuantity"];
        delete values["purchaseDescription"];
        delete values["searchProduct"];
        delete values["isFocusOnSearchCompositeProduct"];

        if(purchases) {
          values["POEntries"] = purchases;
        } 

        console.log("purchases",values["POEntries"]);
        console.log("values",values);

        this.dispatch(PurchaseOrderAction.update(values));
        this.dispatch(PurchaseOrderAction.fetch(10));

      }
      
    });
  }
  
  handlePush(e){
    this.dispatch(PurchaseOrderAction.reset(Constant.RESET_PURCHASE_ORDER));
  }

  handleCancel() {
    this.dispatch(purchaseOrderSendEmailAction.reset());    
  }
  

  renderCrudAction(){
    return(
      <div>
        <this.Button className="danger" onClick={() => this.handleCancel()}>
          <span className="icon-cancel icon-padding-right"></span><this.Translate id="button_text_cancel" />
        </this.Button>  
        <this.Button loading={this.submitLoading} className="info" onClick={this.handlePush}>
          <span className="icon-cancel icon-padding-right"></span> <this.Translate id="button_stock_purchase_order_push" />
        </this.Button>  
        <this.Button htmlType="submit" loading={this.submitLoading} className="info btn-push-with-send-mail" onClick={this.handleSubmit}>
          <span className="icon-save icon-padding-right"></span> <this.Translate id="button_stock_purchase_order_push_with_send_email" />
        </this.Button>
      </div>
    );
  }


  render() {
    const {purchaseOrderSendEmailAdd,form,locale,dispatch,supplierDetail} = this.props;
    
    this.submitLoading = purchaseOrderSendEmailAdd.adding;

    if (purchaseOrderSendEmailAdd.showForm) {
      this.content = (
        <div>
          { purchaseOrderSendEmailAdd.error != null ? <this.Alert message={this.requiredMessage} type="error" /> : "" }
          <FormItem form={form} dispatch={dispatch} supplierDetail={supplierDetail} locale={locale}/>
          {this.renderModalConfirmAction()}
        </div>
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}