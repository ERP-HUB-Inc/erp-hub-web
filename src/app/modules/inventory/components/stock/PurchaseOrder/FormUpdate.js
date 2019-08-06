import React from "react";
import FormItem from "./FormItem";
import Enum from "../../../enums";
import Constant from "../../../constants/stock/purchaseOrder";
import Modal from "../../../../common/components/shares/Modal";
import PurchaseOrderAction from "../../../actions/stock/purchaseOrder";
import FormCreatePurchseOrderSendEmail from "../../../containers/stock/PurchaseOrder/ConfirmEmail/FormCreate";

export default class Form extends Modal {
  constructor(props) {
    super(props);
    this.wrapClassName = `${this.wrapClassName} wrap-modal-po  modal-po-full-screen`;
    this.width = window.innerWidth < 1400 ? window.innerWidth : 1400;
    this.PO_STEP_STR = {
      [Enum.PO_STEP.DRAFT]: {name: <this.Translate id="purchase_order_step_draff" />, color: this.Enum.PO_STEP_COLOR.DRAFT},
      [Enum.PO_STEP.PROCESS]: {name: <this.Translate id="text_process" />, color:  this.Enum.PO_STEP_COLOR.PROCESS},
      [Enum.PO_STEP.RECEIVED]: {name: <this.Translate id="text_received" />, color:  this.Enum.PO_STEP_COLOR.RECEIVE},
      [Enum.PO_STEP.CANCEL]: {name: <this.Translate id="text_cancel" />, color:  this.Enum.PO_STEP_COLOR.CANCEL},
      [Enum.PO_STEP.RETURN]: {name: <this.Translate id="text_return" />, color:  this.Enum.PO_STEP_COLOR.RETURN},
      [Enum.PO_STEP.PAID]: {name: <this.Translate id="purchase_order_step_paid" />, color:  this.Enum.PO_STEP_COLOR.PAID}
    };
    this.title = <this.Translate id="text_po" />;
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePushToSupplier = this.handlePushToSupplier.bind(this);
    this.prepareFormDataForUpdate = this.prepareFormDataForUpdate.bind(this);
  }

  componentDidUpdate() {
    if (this.props.purchaseOrderDetail.fetched) {
      const step = this.props.purchaseOrderDetail.data.step;
      this.title = <div><this.Translate id="text_po" /> {step in this.PO_STEP_STR ? <this.Tag color={this.PO_STEP_STR[step].color} className="text-uppercase text-center po-step-tag">{this.PO_STEP_STR[step].name}</this.Tag> : ""}</div>;
    }
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
      values.productVariantId.forEach((productVariantId, index) => {
        purchaseEntries.push({
          id: values.purchaseEntryId[index],
          productVariantId,
          productName: values.productName[index],
          variantName: values.variantName[index],
          unitId: values.unitId[index],
          requestQuantity: parseInt(values.purchaseQty[index], 10),
          price: parseFloat(values.purchasePrice[index]),
          status: values.purchaseEntryStatus[index]
        });
      });
    }

    values["requestTotal"] = parseFloat(values["requestTotalValue"]);

    this.Util.clearObjProperty(values, [
      "productVariantId",
      "purchaseEntryId",
      "unitId",
      "productName",
      "variantName",
      "purchaseQty",
      "purchasePrice",
      "purchaseEntryStatus",
      "totalPrice",
      "totalAmount",
      "totalPriceValue",
      "searchProduct",
      "isFocusOnSearchCompositeProduct"
    ]);

    values["deliveryDueDate"] = this.Util.formatDateForMYSQL(values.deliveryDueDate);
    values["referenceId"] = this.props.purchaseOrderDetail.data.referenceId;
    values["shippingFee"] = this.props.purchaseOrderDetail.data.shippingFee;
    values["receiveTotal"] = this.props.purchaseOrderDetail.data.receiveTotal;
    values["returnTotal"] = this.props.purchaseOrderDetail.data.returnTotal;
    values["step"] = this.props.purchaseOrderDetail.data.step;
    values["type"] = this.props.purchaseOrderDetail.data.type;
    values["status"] = this.props.purchaseOrderDetail.data.status;

    values["POEntries"] = purchaseEntries;

    return values;
  }

  handlePushToSupplier(){
    let values = this.props.form.getFieldsValue();
    values = this.prepareFormDataForUpdate(values);
    
    if (values["POEntries"].length > 0) {
      const supplier = this.Util.getDBFromLocalStorageById(Enum.LOCAL_SCHEMA.SUPPLIER, values["supplierId"]);
      this.dispatch(PurchaseOrderAction.showForm(null, Constant.SHOW_PUSH_PURCHASE_ORDER_TO_SUPPLIER_FORM));
      this.modal1 = <FormCreatePurchseOrderSendEmail
        formvalue={values}
        purchaseOrderDetail={this.props.purchaseOrderDetail.data}
        supplier={supplier}
        callBackGetEmail={this.props.callBackGetEmail}/>;
      
      // APPEND MORE DATA FOR EMAIL PO
      values["number"] = this.props.purchaseOrderDetail.data.number;
      values["referenceNumber"] = this.props.purchaseOrderDetail.data.reference ? this.props.purchaseOrderDetail.data.reference.number : null;
      values["supplier"] = supplier;
      values["location"] = this.Util.getDBFromLocalStorageById(Enum.LOCAL_SCHEMA.LOCATION, values["locationId"]);
      values["employee"] = this.props.purchaseOrderDetail.data.user;
      if (this.props.callBackGetEmailData) {
        this.props.callBackGetEmailData(values);
      }
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
          productVariant={this.props.productVariant}
          storeLocation={storeLocation} 
          productSearch={productSearch}
          requestOrderNumber={requestOrderNumber}
          dispatch={dispatch} 
          buttonPushToSupplier={buttonPushToSupplier}
          reportProduct={this.props.reportProduct}
          locale={locale}/>
      );
      return super.render();
    } else {
      return <div/>;
    }
  }
}