import React from "react";
import FormItem from "./FormItem";
import Constant from "../../../constants/stock/stockAdjustmentRequest";
import Modal from "../../../../common/components/shares/Modal";
import StockAdjustmentRequestAction from "../../../actions/stock/stockAdjustmentRequest";
import "../PurchaseOrder/index.css";

export default class FormCreate extends Modal {
  constructor(props) {
    super(props);
    this.title = <this.Translate id="text_stock_adjustment_request" />;
    this.wrapClassName = `${this.wrapClassName} wrap-modal-po modal-po-full-screen`;
    this.width = window.innerWidth < 1400 ? window.innerWidth : 1400;
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
  }
 

  renderCrudAction(){
    return(
      <div className="ant-modal-footer">
        <this.Button className="danger" onClick={() => this.handleCancel()}>
          <span className="icon-cancel icon-padding-right"></span><this.Translate id="text_cancel" />
        </this.Button>  
        <this.Button htmlType="submit" loading={this.submitLoading} className="info">
          <span className="icon-save icon-padding-right"></span><this.Translate id="text_adjust" />
        </this.Button>
      </div>
    );
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        
        const stockAdjustmentEntries = [];

        if("productVariantId" in values){
          values.productVariantId.forEach((productVariantId, index) => {
            stockAdjustmentEntries.push({
              currentQuantity: parseInt(values.currentQty[index], 10),
              productVariantId,
              unitId: values.unitId[index],
              adjustQuantity: values.adjustQuantity[index]
            });
          });
        }else{
          this.Message.warning(this.CATranslate("error_stock_adjustment_no_entry", this.props.locale), 3);
          return;
        }

        this.Util.clearObjProperty(values, [
          "id",
          "productVariantId",
          "stockAdjustmentRequestId",
          "stockAdjustmentRequestStatus",
          "variantName",
          "isFocusOnSearchCompositeProduct",
          "adjust",
          "currentQty",
          "different",
          "searchProduct",
          "productName",
          "unitId",
          "adjustQuantity"
        ]);

        values["entries"] = stockAdjustmentEntries;
        values["locationId"] = parseFloat(values.locationId);
        this.dispatch(StockAdjustmentRequestAction.add(values));
      }
    });
  }
      
  handleCancel() {
    this.dispatch(StockAdjustmentRequestAction.reset(Constant.RESET_STOCK_ADJUSTMENT_REQUEST));
  }

  render() {
    const {
      stockAdjustmentRequestAdd, 
      form, 
      locale, 
      productSearch, 
      dispatch
    } = this.props;
    
    this.submitLoading = stockAdjustmentRequestAdd.adding;

    if (stockAdjustmentRequestAdd.showForm) {
      this.content = 
        <FormItem 
          form={form} 
          accessLocation={this.props.accessLocation}
          productSearch={productSearch} 
          productVariant={this.props.productVariant}
          seletList={this.props.seletList}
          dispatch={dispatch} 
          locale={locale} />;
      return super.render();
    } else {
      return <div/>;
    }
  }
}