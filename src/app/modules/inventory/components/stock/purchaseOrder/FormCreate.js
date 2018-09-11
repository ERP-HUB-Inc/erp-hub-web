import React from "react";
import Enum from "../../../enums";
import FormItem from "./FormItem";
import Constant from "../../../constants/stock/purchaseOrder";
import Modal from "../../../../common/components/shares/Modal";
import PurchaseOrderAction from "../../../actions/stock/purchaseOrder";
import PurchaseOrderShowEmailAction from "../../../actions/stock/purchaseOrderSendEmail";
import FormCreatePurchseOrderSendEmail from "../../../containers/stock/purchaseOrder/creatSendEmail/FormCreate";
import "./index.css";

export default class FormCreate extends Modal {
  constructor(props) {
    super(props);
    this.title = <this.Translate id="create_stock_purchase_order_title" />;
    this.addingPropReducer = "purchaseOrderAdd";
    this.width = "65%";
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.pushToSupplier = this.pushToSupplier.bind(this);
    this.handlePushToSupplier = this.handlePushToSupplier.bind(this);
  }

  handlePushToSupplier(){
    const form = this.props.form.getFieldsValue();
    this.dispatch(PurchaseOrderShowEmailAction.showForm(form));
    this.modal1 = <FormCreatePurchseOrderSendEmail formvalue={form}/>;
  }

  pushToSupplier(){
    this.handlePushToSupplier();
  }  


  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {      
        const listPurchase = 
        {
          purchaseId: values.purchaseId,
          requestQuantity: values.purchaseQty,
          price: values.purchasePrice
        };
        console.log("List purchase",JSON.stringify(listPurchase));

        delete values["purchaseId"];
        delete values["productId"];
        delete values["purchaseQty"];
        delete values["purchasePrice"];
        delete values["purchaseDescription"];

        if(listPurchase.purchaseId == null){
          listPurchase.purchaseId = [];
        }

        const purchases = [];

        listPurchase.purchaseId.forEach((purchaseId, index) => {
          if (
            purchaseId != null || 
            listPurchase.requestQuantity[index] != null ||
            listPurchase.price[index] != null
          ) {
            purchases.push({
              productId: listPurchase.purchaseId[index],
              requestQuantity: listPurchase.requestQuantity[index],
              price: listPurchase.price[index]
            });
          }
        });

        values["shippingFee"] = 0;
        values["requestTotal"] = 105;
        values["returnTotal"] = 0;
        values["receiveTotal"] = 0;
        values["step"] = Enum.PO_STEP.DRAFT;
        values["type"] = Enum.CLIENT_AUTO_NUMBER_TYPE.QUOTATION;
        values["status"] = 1;

        if(purchases) {
          values["POEntries"] = purchases;
        } 

        console.log("get values",values);
      
        this.dispatch(PurchaseOrderAction.add(values));   
        this.dispatch(PurchaseOrderAction.fetch(10));

      }
    });
  }
      
  handleCancel() {
    this.dispatch(PurchaseOrderAction.reset(Constant.RESET_PURCHASE_ORDER));
  }

  render() {
    const {
      purchaseOrderAdd, 
      form, 
      locale, 
      supplier, 
      product, 
      storeLocation, 
      productSearch, 
      productUpdate,
      dispatch
    } = this.props;
    
    this.submitLoading = purchaseOrderAdd.adding;

    if (purchaseOrderAdd.showForm) {
      this.content = (
        <FormItem 
          form={form} 
          supplier={supplier} 
          product={product} 
          storeLocation={storeLocation} 
          productSearch={productSearch} 
          productUpdate={productUpdate}
          dispatch={dispatch} 
          locale={locale}
        />
      );
    
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}