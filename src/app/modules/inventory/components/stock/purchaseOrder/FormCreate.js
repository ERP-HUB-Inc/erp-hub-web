import React from "react";
import FormItem from "./FormItem";
import Modal from "../../../../common/components/shares/Modal";
import PurchaseOrderAction from "../../../actions/stock/purchaseOrder";

export default class FormCreate extends Modal {
  constructor(props) {
    super(props);
    this.title = <this.Translate id="create_stock_purchase_order_title" />;
    this.width = "80%";
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {

        console.log("purchase nme:",JSON.stringify(values.purchaseName));
        console.log("purchase order",values);
        
        const listPurchase = 
        {
          purchaseId: values.purchaseId,
          requestQuantity: values.purchaseQty,
          price: values.purchasePrice
        };

        console.log("List purchase",JSON.stringify(listPurchase));

        // delete values["purchaseId"];
        // delete values["purchaseQty"];
        // delete values["purchasePrice"];
       

        if(listPurchase.purchaseId == null){
          listPurchase.purchaseId = [];
        }

        const purchases = [];

        listPurchase.purchaseId.forEach((purchaseId, index) => {
          if (
            purchaseId != null 
            // listPurchase.requestQuantity[index] != null ||
            // listPurchase.price[index] != null
          ) {
            purchases.push({
              productId: listPurchase.purchaseId[index]
              // purchaseQty: listPurchase.requestQuantity[index],
              // price: listPurchase.price[index]
            });
          }
        });

        if(purchases) {
          values["purchaseOrderEntries"] = purchases;
        }

        console.log("get values",values);

        // this.dispatch(PurchaseOrderAction.add(values));   
      }
    });
  }
      
  handleCancel() {
    this.dispatch(PurchaseOrderAction.reset());
  }

  render() {
    const {purchaseOrderAdd, form, locale,supplier,product,storeLocation,dispatch} = this.props;
    
    this.submitLoading = purchaseOrderAdd.adding;

    if (purchaseOrderAdd.showForm) {
      this.content = (
        <div>
          { purchaseOrderAdd.error != null ? <this.Alert message={this.requiredMessage} type="error" /> : "" }
          <FormItem form={form} supplier={supplier} product={product} storeLocation={storeLocation} dispatch={dispatch} locale={locale}/>
        </div>
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}