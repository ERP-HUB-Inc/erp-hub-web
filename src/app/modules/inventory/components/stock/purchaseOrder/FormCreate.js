import React from "react";
import FormItem from "./FormItem";
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
    this.width = "80%";
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.pushToSupplier = this.pushToSupplier.bind(this);
    this.handlePushToSupplier = this.handlePushToSupplier.bind(this);
  }

  handlePushToSupplier(){
    this.dispatch(PurchaseOrderShowEmailAction.showForm());
    this.setState({modalVisible: false});
    this.modal1 = <FormCreatePurchseOrderSendEmail />;
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
        const listPurchase = 
        {
          purchaseId: values.purchaseId,
          requestQuantity: values.purchaseQty,
          price: values.purchasePrice
        };
        console.log("List purchase",JSON.stringify(listPurchase));

        delete values["purchaseId"];
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
        values["step"] = 0;
        values["type"] = 0;
        values["status"] = 0;

        if(purchases) {
          values["purchaseOrderEntries"] = purchases;
        } 
        console.log("get values",values);
        // console.log("purchase order Entries",values["purchaseOrderEntries"]);
        this.dispatch(PurchaseOrderAction.add(values));   
      }
    });
  }
      
  handleCancel() {
    this.dispatch(PurchaseOrderAction.reset());
  }

  render() {
    const {purchaseOrderAdd, form, locale, supplier, product, storeLocation, productSearch, dispatch} = this.props;
    
    this.submitLoading = purchaseOrderAdd.adding;

    if (purchaseOrderAdd.showForm) {
      this.content = (
        <FormItem form={form} supplier={supplier} product={product} storeLocation={storeLocation} productSearch={productSearch} dispatch={dispatch} locale={locale}/>
      );
    
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}