import React from "react";
import Enum from "../../../enums";
import FormItem from "./FormItem";
import Constant from "../../../constants/stock/purchaseOrder";
import Modal from "../../../../common/components/shares/Modal";
import PurchaseOrderShowEmailAction from "../../../actions/stock/purchaseOrderSendEmail";
import PurchaseOrderAction from "../../../actions/stock/purchaseOrder";
import FormCreatePurchseOrderSendEmail from "../../../containers/stock/purchaseOrder/creatSendEmail/FormCreate";

export default class Form extends Modal {
  constructor(props) {
    super(props);
    this.width = "80%";
    this.state = {
      disabled: false
    };

    this.title = <this.Translate id="update_stock_purchase_order_title" />;
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.pushToSupplier = this.pushToSupplier.bind(this);
    this.handlePushToSupplier = this.handlePushToSupplier.bind(this);
  }

  handlePushToSupplier(){
    const form = this.props.form.getFieldsValue();
    this.dispatch(PurchaseOrderShowEmailAction.showForm(form));
    this.setState({modalVisible: false});
    this.modal1 = <FormCreatePurchseOrderSendEmail formvalue={form}/>;
  }

  pushToSupplier(){
    this.handlePushToSupplier();
  } 

  renderOtherAction(){
    return(
      <this.Button onClick={this.pushToSupplier} className="info btn-push-to-supplier">
        <span className="icon-save "></span> <this.Translate id="button_stock_purchase_order_push_to_supplier" />
      </this.Button>
    );
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      
      if (!err) { 

        values["id"] = this.props.purchaseOrderDetail.data.id;
        const listPurchase = 
        {
          purchaseId: values.purchaseId,
          productId: values.productId,
          requestQuantity: values.purchaseQty,
          price: values.purchasePrice
        };
        console.log("List purchase",JSON.stringify(listPurchase));

        delete values["purchaseId"];
        delete values[" "];
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
              id: listPurchase.purchaseId[index],
              productId: listPurchase.productId[index],
              requestQuantity: listPurchase.requestQuantity[index],
              price: listPurchase.price[index]
            });
          }
        });

        values["deliveryDueDate"] =  "2018/11/29";
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
        // console.log("purchase order Entries",values["purchaseOrderEntries"]);
        
        this.dispatch(PurchaseOrderAction.update(values));  
        this.dispatch(PurchaseOrderAction.fetch(10)); 

      }
      
    });
  }
    
  handleCancel() {
    this.dispatch(PurchaseOrderAction.reset(Constant.RESET_PURCHASE_ORDER));

  }

  render() {
    const {
      purchaseOrderUpdate, 
      form, 
      locale, 
      supplier, 
      product, 
      storeLocation, 
      productSearch,
      productUpdate, 
      purchaseOrderDetail,
      dispatch
    } = this.props;

    this.submitLoading = purchaseOrderUpdate.updating;

    if (purchaseOrderDetail.showForm) {
      this.content = (
        <FormItem 
          form={form} 
          formData={purchaseOrderDetail.data} 
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