import React from "react";
import FormItem from "./FormItem";
import Constant from "../../../constants/stock/stockTransfer";
import Modal from "../../../../common/components/shares/Modal";
import StockTransferAction from "../../../actions/stock/stockTransfer";
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
    this.dispatch(StockTransferAction.reset(Constant.RESET_ADD_STOCK_TRANSFER));
  }

  render() {
    const {
      stockTransferAdd
    } = this.props;
    
    this.submitLoading = stockTransferAdd.adding;

    if (stockTransferAdd.showForm) {
      this.content = 
        <FormItem 
          form={this.props.form} 
          storeLocation={this.props.location}
          accessLocation={this.props.accessLocation}
          productSearch={this.props.productSearch} 
          productVariant={this.props.productVariant}
          dispatch={this.props.dispatch} 
          locale={this.props.locale} />;
    
      return super.render();
    } else {
      return <div/>;
    }
  }
}