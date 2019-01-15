import React from "react";
import FormItem from "./FormItem";
import Enum from "../../../enums";
import Constant from "../../../constants/stock/purchaseOrder";
import Modal from "../../../../common/components/shares/Modal";
import PurchaseOrderAction from "../../../actions/stock/purchaseOrder";
import PurchaseOrderShowEmailAction from "../../../actions/stock/purchaseOrderSendEmail";
import FormCreatePurchseOrderSendEmail from "../../../containers/stock/PurchaseOrder/ConfirmEmail/FormCreate";
import EnumSetting from "../../../../pos/enums";
import "./index.css";

export default class FormCreate extends Modal {
  constructor(props) {
    super(props);
    this.title = <this.Translate id="text_po" />;
    this.wrapClassName = `${this.wrapClassName} wrap-modal-po modal-po-full-screen`;
    this.width = window.innerWidth < 1400 ? window.innerWidth : 1400;
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.pushToSupplier = this.pushToSupplier.bind(this);
    this.handlePushToSupplier = this.handlePushToSupplier.bind(this);
  }

  componentDidUpdate() {
    if (this.props.purchaseOrderAdd.error) {
      const errorCode = this.Util.getErrorCodeFromState(this.props.purchaseOrderAdd.error);
      let message = "Something wrong, Please contact system provider";

      if (errorCode === Enum.PO_NUMBER_NOT_ALLOW_EMPTY) {
        message = this.CATranslate("error_po_number_empty", this.props.locale);
      } else if (errorCode === EnumSetting.LOCATION_NOT_FOUND) {
        message = this.CATranslate("error_location_not_found", this.props.locale);
      } else if (errorCode === Enum.SUPPLIER_NOT_FOUND) {
        message = this.CATranslate("error_supplier_not_found", this.props.locale);
      } else if (errorCode === Enum.PO_NUMBER_ALREADY_EXIST) {
        message = this.CATranslate("purchase_order_po_number_already_exist", this.props.locale);
      } else if (errorCode === Enum.PRODUCT_NOT_FOUND) {
        message = this.CATranslate("error_product_not_found", this.props.locale);
      } else if (errorCode === Enum.PRODUCT_UNIT_NOT_FOUND) {
        message = this.CATranslate("error_unit_not_found", this.props.locale);
      }

      this.Message.error(message);
      this.props.dispatch(PurchaseOrderAction.reset(Constant.RESET_ADD_PURCHASE_ORDER));
    }
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
        if ("productVariantId" in values) {
          values.productVariantId.forEach((productVariantId, index) => {
            purchaseEntries.push({
              id: values.purchaseEntryId[index],
              productVariantId,
              unitId: values.unitId[index],
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
          "productVariantId",
          "purchaseQty",
          "purchasePrice",
          "purchaseEntryStatus",
          "totalPrice",
          "totalAmount",
          "totalPriceValue",
          "requestTotalValue",
          "searchProduct",
          "purchaseEntryId",
          "productName",
          "isFocusOnSearchCompositeProduct"
        ]);

        values["shippingFee"] = 0;
        values["returnTotal"] = 0;
        values["receiveTotal"] = 0;
        values["deliveryDueDate"] = this.Util.formatDateForMYSQL(values.deliveryDueDate);
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
      this.content = 
        <FormItem 
          form={form} 
          supplier={supplier} 
          product={product}
          storeLocation={storeLocation} 
          productSearch={productSearch} 
          productUpdate={productUpdate}
          productVariant={this.props.productVariant}
          requestOrderNumber={requestOrderNumber}
          dispatch={dispatch} 
          locale={locale} />;
    
      return super.render();
    } else {
      return <div/>;
    }
  }
}