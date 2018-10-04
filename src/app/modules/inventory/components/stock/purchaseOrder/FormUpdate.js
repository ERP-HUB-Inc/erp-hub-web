import React from "react";
import FormItem from "./FormItem";
import Enum from "../../../enums";
import Constant from "../../../constants/stock/purchaseOrder";
import Modal from "../../../../common/components/shares/Modal";
import PurchaseOrderAction from "../../../actions/stock/purchaseOrder";
import FormCreatePurchseOrderSendEmail from "../../../containers/stock/purchaseOrder/ConfirmEmail/FormCreate";

export default class Form extends Modal {
  constructor(props) {
    super(props);
    this.width = "65%";
    this.state = {
      disabled: false
    };

    this.title = <div><this.Translate id="update_stock_purchase_order_title" /></div>;
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePushToSupplier = this.handlePushToSupplier.bind(this);
    this.prepareFormDataForUpdate = this.prepareFormDataForUpdate.bind(this);
  }

  handleSubmit (e) {
    e.preventDefault();
    if (this.props.purchaseOrderDetail.data.step !== Enum.PO_STEP.DRAFT) {
      this.Message.error(this.CATranslate("error_purchase_order_update_warning", this.props.locale), 3);
      return;
    }
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values = this.prepareFormDataForUpdate(values);

        if (values["POEntries"].length > 0) {
          this.dispatch(PurchaseOrderAction.update(values)); 
        } else {
          // HAVE NO PURCHASE ENTRY INCLUDE
          this.Message.warning(this.CATranslate("error_purchase_order_no_entry", this.props.locale), 3);
        }
      }
      
    });
  }

  prepareFormDataForUpdate(values) {
    values["id"] = this.props.purchaseOrderDetail.data.id;

    // PREPARE PO ENTRIES
    const purchaseEntries = [];
    if (values.purchaseQty) {
      values.productId.forEach((productId, index) => {
        purchaseEntries.push({
          id: values.purchaseEntryId[index],
          productId,
          requestQuantity: parseInt(values.purchaseQty[index], 10),
          price: parseFloat(values.purchasePrice[index]),
          status: values.purchaseEntryStatus[index]
        });
      });
    }

    values["requestTotal"] = parseFloat(values["requestTotalValue"]);

    this.Util.clearObjProperty(values, [
      "productId",
      "purchaseQty",
      "purchasePrice",
      "purchaseEntryStatus",
      "totalPrice",
      "totalAmount",
      "totalPriceValue",
      "searchProduct",
      "isFocusOnSearchCompositeProduct"
    ]);

    values["shippingFee"] = this.props.purchaseOrderDetail.data.shippingFee;
    values["receiveTotal"] = this.props.purchaseOrderDetail.data.receiveTotal;
    values["returnTotal"] = this.props.purchaseOrderDetail.data.returnTotal;
    values["step"] = this.props.purchaseOrderDetail.data.step;
    values["type"] = this.props.purchaseOrderDetail.data.type;
    values["status"] = this.props.purchaseOrderDetail.data.status;

    values["POEntries"] = purchaseEntries;
    console.log("values push to supplier",values);
    return values;
  }

  handlePushToSupplier(){
    let values = this.props.form.getFieldsValue();
    values = this.prepareFormDataForUpdate(values);

    if (values["POEntries"].length > 0) {
      this.dispatch(PurchaseOrderAction.showForm(null, Constant.SHOW_PUSH_PURCHASE_ORDER_TO_SUPPLIER_FORM));
      this.modal1 = <FormCreatePurchseOrderSendEmail
        formvalue={this.prepareFormDataForUpdate(values)}
        purchaseOrderDetail={this.props.purchaseOrderDetail.data}/>;
    } else {
      // HAVE NO PURCHASE ENTRY INCLUDE
      this.Message.warning(this.CATranslate("error_purchase_order_no_entry", this.props.locale), 3);
    }
  }

  renderOtherAction(){
    
    if(this.props.purchaseOrderDetail.data == null) {
      return;
    }

    return (
      this.props.purchaseOrderDetail.data.step === Enum.PO_STEP.DRAFT ?
        <this.Button onClick={this.handlePushToSupplier} className="info btn-push-to-supplier">
          <span className="icon-push-button"></span> <this.Translate id="button_stock_purchase_order_push_to_supplier" />
        </this.Button>
        :
        ""
    );
  }
  
  handleCancel() {
    this.dispatch(PurchaseOrderAction.reset(Constant.REQUEST_PURCHASE_ORDER_DETAIL_FULL_RESET));
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
      requestOrderNumber,
      purchaseOrderDetail,
      dispatch,
      buttonPushToSupplier
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
          requestOrderNumber={requestOrderNumber}
          dispatch={dispatch} 
          buttonPushToSupplier={buttonPushToSupplier}
          locale={locale}/>
      );
      return super.render();
    } else {
      return <div/>;
    }
  }
}