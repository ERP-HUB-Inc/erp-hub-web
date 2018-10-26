import React from "react";
import Enum from "../../../enums";
import FormItem from "./FormItem";
import Constant from "../../../constants/stock/purchaseOrder";
import Modal from "../../../../common/components/shares/Modal";
import PurchaseOrderAction from "../../../actions/stock/purchaseOrder";
import PurchaseOrderShowEmailAction from "../../../actions/stock/purchaseOrderSendEmail";
import FormCreatePurchseOrderSendEmail from "../../../containers/stock/PurchaseOrder/ConfirmEmail/FormCreate";
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
        
        const purchaseEntries = [];
        if ("productId" in values) {
          values.productId.forEach((productId, index) => {
            purchaseEntries.push({
              id: values.purchaseEntryId[index],
              productId,
              requestQuantity: parseInt(values.purchaseQty[index], 10),
              price: parseFloat(values.purchasePrice[index]),
              status: values.purchaseEntryStatus[index]
            });
          });
        } else {
          // HAVE NO PURCHASE ENTRY INCLUDE
          this.Message.warning(this.CATranslate("error_purchase_order_no_entry", this.props.locale), 3);
          return;
        }

        values["requestTotal"] = parseFloat(values["requestTotalValue"]);

        this.Util.clearObjProperty(values, [
          "id",
          "productId",
          "purchaseQty",
          "purchasePrice",
          "purchaseEntryStatus",
          "totalPrice",
          "totalAmount",
          "totalPriceValue",
          "requestTotalValue",
          "searchProduct",
          "isFocusOnSearchCompositeProduct"
        ]);

        values["shippingFee"] = 0;
        values["returnTotal"] = 0;
        values["receiveTotal"] = 0;
        values["step"] = Enum.PO_STEP.DRAFT;
        values["type"] = Enum.CLIENT_AUTO_NUMBER_TYPE.PURCHASE;
        values["status"] = this.Enum.ACTIVE;

        values["POEntries"] = purchaseEntries;
      
        this.dispatch(PurchaseOrderAction.add(values));
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
      requestOrderNumber,
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
          requestOrderNumber={requestOrderNumber}
          dispatch={dispatch} 
          locale={locale}
        />
      );
    
      return super.render();
    } else {
      return <div/>;
    }
  }
}