import React from "react";
import FormItem from "./FormItem";
import Enum from "../../../enums";
import Constant from "../../../constants/stock/stockAdjustmentRequest";
import Modal from "../../../../common/components/shares/Modal";
import StockAdjustmentAction from "../../../actions/stock/stockAdjustmentRequest";

export default class Form extends Modal {
  constructor(props) {
    super(props);
    this.wrapClassName = `${this.wrapClassName} wrap-modal-po  modal-po-full-screen`;
    this.width = window.innerWidth < 1400 ? window.innerWidth : 1400;
    this.ADJUSTMENT_STEP_STR = {
      [Enum.STOCK_ADJUST_STEP.REQUEST]: {name: <this.Translate id="stock_adjustment_request_step_request" />, color:  this.Enum.STOCK_ADJUST_COLOR.REQUEST},
      [Enum.STOCK_ADJUST_STEP.COMPLETE]: {name: <this.Translate id="stock_adjustment_request_step_complete" />, color: this.Enum.STOCK_ADJUST_COLOR.COMPLETE}
    };

    this.title = <this.Translate id="text_stock_adjustment_request" />;
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidUpdate() {
    if (this.props.stockAdjustmentRequestUpdate.data) {
      const step = this.props.stockAdjustmentRequestUpdate.data.step;
      this.title = <div><this.Translate id="text_stock_adjustment_request" />&nbsp;
        {step in this.ADJUSTMENT_STEP_STR ? <this.Tag color={this.ADJUSTMENT_STEP_STR[step].color} 
          className="text-uppercase text-center po-step-tag">{this.ADJUSTMENT_STEP_STR[step].name}</this.Tag> : ""}
      </div>;
    }
  }

  renderCrudAction(){
    return(
      <div className="ant-modal-footer">
        <this.Button className="danger" onClick={() => this.handleCancel()}>
          <span className="icon-cancel icon-padding-right"></span><this.Translate id="text_cancel" />
        </this.Button>  
        <this.Button htmlType="submit" loading={this.submitLoading} className="info">
          <span className="icon-save icon-padding-right"></span><this.Translate id="col_stock_adjustment_request_adjust" />
        </this.Button>
      </div>
    );
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values["id"] = this.props.purchaseOrderDetail.data.id;
        console.log("values",values);
      }
    });
  }

  
  handleCancel() {
    this.dispatch(StockAdjustmentAction.reset(Constant.RESET_STOCK_ADJUSTMENT_REQUEST));
  }

  render() {
    const {
      stockAdjustmentRequestUpdate, 
      form, 
      locale, 
      productSearch,
      dispatch
    } = this.props;

    this.submitLoading = stockAdjustmentRequestUpdate.updating;

    if (stockAdjustmentRequestUpdate.showForm) {
      this.content = (
        <FormItem 
          form={form} 
          formData={stockAdjustmentRequestUpdate.data} 
          productVariant={this.props.productVariant}
          accessLocation={this.props.accessLocation} 
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