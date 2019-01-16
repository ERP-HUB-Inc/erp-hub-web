import React from "react";
import FormItem from "./FormItem";
import Enum from "../../../enums";
import Constant from "../../../constants/stock/stockTransfer";
import Modal from "../../../../common/components/shares/Modal";
import StockTransferAction from "../../../actions/stock/stockTransfer";
import EnumSetting from "../../../../pos/enums";
import "./index.css";

export default class FormCreate extends Modal {
  constructor(props) {
    super(props);
    this.title = <this.Translate id="text_stock_transfer" />;
    this.wrapClassName = `${this.wrapClassName} wrap-modal-po modal-po-full-screen`;
    this.width = window.innerWidth < 1400 ? window.innerWidth : 1400;
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidUpdate() {
    if (this.props.stockTransferAdd.error) {
      const errorCode = this.Util.getErrorCodeFromState(this.props.stockTransferAdd.error);
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

      this.props.dispatch(StockTransferAction.reset(Constant.RESET_ADD_STOCK_TRANSFER));
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const transferEntries = [];
        if ("productVariantId" in values) {
          values.productVariantId.forEach((productVariantId, index) => {
            transferEntries.push({
              id: values.transferEntryId[index],
              productVariantId,
              unitId: values.unitId[index],
              transferQuantity: parseInt(values.transferQuantity[index], 10),
              status: values.transferEntryStatus[index]
            });
          });
        } else {
          // HAVE NO PURCHASE ENTRY INCLUDE
          this.Message.warning(this.CATranslate("error_purchase_order_no_entry", this.props.locale), 3);
          return;
        }

        this.Util.clearObjProperty(values, [
          "id",
          "productVariantId",
          "transferEntryId",
          "transferEntryStatus",
          "transferQuantity",
          "searchProduct",
          "productName",
          "variantName",
          "isFocusOnSearchCompositeProduct",
          "unitId"
        ]);

        values["deliveryDueDate"] = this.Util.formatDateForMYSQL(values.deliveryDueDate);

        values["transferEntries"] = transferEntries;
      
        this.dispatch(StockTransferAction.add(values));

      }
    });
  }
      
  handleCancel() {
    this.dispatch(StockTransferAction.reset(Constant.RESET_PURCHASE_ORDER));
  }

  render() {
    const {
      stockTransferAdd, 
      form, 
      locale, 
      storeLocation, 
      productSearch,
      dispatch
    } = this.props;
    
    this.submitLoading = stockTransferAdd.adding;

    if (stockTransferAdd.showForm) {
      this.content = 
        <FormItem 
          form={form} 
          storeLocation={storeLocation} 
          productSearch={productSearch} 
          productVariant={this.props.productVariant}
          dispatch={dispatch} 
          locale={locale} />;
    
      return super.render();
    } else {
      return <div/>;
    }
  }
}