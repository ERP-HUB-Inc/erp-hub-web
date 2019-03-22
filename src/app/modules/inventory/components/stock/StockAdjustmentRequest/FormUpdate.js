import React from "react";
import FormItem from "./FormItem";
import Enum from "../../../enums";
import Constant from "../../../constants/stock/stockAdjustmentRequest";
import Modal from "../../../../common/components/shares/Modal";
import StockAdjustmentRequestAction from "../../../actions/stock/stockAdjustmentRequest";

export default class Form extends Modal {
  constructor(props) {
    super(props);
    this.state = {
      isClickFilter: false
    };
    this.wrapClassName = `${this.wrapClassName} wrap-modal-po  modal-po-full-screen`;
    this.width = window.innerWidth < 1400 ? window.innerWidth : 1400;
    this.ADJUSTMENT_STEP_STR = {
      [Enum.STOCK_ADJUST_STEP.REQUEST]: {name: <this.Translate id="text_request" />, color:  this.Enum.STOCK_ADJUST_COLOR.REQUEST},
      [Enum.STOCK_ADJUST_STEP.COMPLETE]: {name: <this.Translate id="text_complete" />, color: this.Enum.STOCK_ADJUST_COLOR.COMPLETE}
    };

    this.title = <this.Translate id="text_stock_adjustment_request" />;
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidUpdate() {
    if (this.props.stockAdjustmentRequestDetail.data) {
      const step = this.props.stockAdjustmentRequestDetail.data.step;
      this.title = <div><this.Translate id="text_stock_adjustment_request" />&nbsp;
        {step in this.ADJUSTMENT_STEP_STR ? <this.Tag color={this.ADJUSTMENT_STEP_STR[step].color} 
          className="text-uppercase text-center adjustment-step-tag">{this.ADJUSTMENT_STEP_STR[step].name}</this.Tag> : ""}
      </div>;
    }
  }

  renderCrudAction(){
    return(
      <div className="ant-modal-footer">
        <this.Button className="danger" onClick={() => this.handleCancel()}>
          <span className="icon-cancel icon-padding-right"></span><this.Translate id="text_cancel" />
        </this.Button>  
        <this.Button htmlType="submit" loading={this.state.isClickFilter && this.submitLoading} className="info">
          <span className="icon-save icon-padding-right"></span><this.Translate id="text_adjust" />
        </this.Button>
      </div>
    );
  }

  handleOnChangeLocation(value){
    this.setState({locationId: value});
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values["id"] = this.props.stockAdjustmentRequestDetail.data.id;
        const stockAdjustmentEntries = [];
        if("productVariantId" in values){
          values.productVariantId.forEach((productVariantId, index) => {
            stockAdjustmentEntries.push({
              id: values.stockAdjustmentRequestId[index],
              currentQuantity: parseInt(values.currentQty[index], 10),
              productVariantId,
              unitId: values.unitId[index],
              adjustQuantity: values.adjustQuantity[index],
              status: values.stockAdjustmentRequestStatus[index]
            });
          });
        }else{
          this.Message.warning(this.CATranslate("error_stock_adjustment_no_entry", this.props.locale), 3);
          return;
        }

        this.Util.clearObjProperty(values, [
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
        values["locationId"] = parseFloat(values.locationId);
        values["entries"] = stockAdjustmentEntries;
        this.setState({isClickFilter: true});
        this.dispatch(StockAdjustmentRequestAction.update(values));        
      }
    });
  }

  
  handleCancel() {
    this.dispatch(StockAdjustmentRequestAction.reset(Constant.RESET_STOCK_ADJUSTMENT_FULL_RESET));
  }

  render() {
    const {
      stockAdjustmentRequestDetail,
      form, 
      locale, 
      productSearch,
      dispatch
    } = this.props;

    this.submitLoading = this.props.stockAdjustmentRequestUpdate.updating;

    if (stockAdjustmentRequestDetail.showForm) {
      this.content = (
        <FormItem 
          form={form} 
          formData={stockAdjustmentRequestDetail.data} 
          productVariant={this.props.productVariant}
          accessLocation={this.props.accessLocation} 
          locationId={this.state.locationId}  
          productSearch={productSearch}
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