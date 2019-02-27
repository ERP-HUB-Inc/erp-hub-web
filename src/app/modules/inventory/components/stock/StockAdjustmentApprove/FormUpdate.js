import React from "react";
import FormItem from "./FormItem";
import Enum from "../../../enums";
import Constant from "../../../constants/stock/stockAdjustmentApprove";
import Modal from "../../../../common/components/shares/Modal";
import StockAdjustmentAction from "../../../actions/stock/stockAdjustmentApprove";

export default class Form extends Modal {
  constructor(props) {
    super(props);
    this.wrapClassName = `${this.wrapClassName} wrap-modal-po  modal-po-full-screen`;
    this.width = window.innerWidth < 1400 ? window.innerWidth : 1400;
    this.ADJUSTMENT_STEP_STR = {
      [Enum.STOCK_ADJUST_STEP.REQUEST]: {name: <this.Translate id="stock_adjustment_request_step_request" />, color:  this.Enum.STOCK_ADJUST_COLOR.REQUEST},
      [Enum.STOCK_ADJUST_STEP.COMPLETE]: {name: <this.Translate id="stock_adjustment_request_step_complete" />, color: this.Enum.STOCK_ADJUST_COLOR.COMPLETE}
    };

    this.title = <this.Translate id="text_stock_adjustment_approve" />;
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.prepareFormDataForUpdate = this.prepareFormDataForUpdate.bind(this);
  }

  renderCrudAction(){
    return(
      <div className="ant-modal-footer">
        <this.Button className="danger" onClick={() => this.handleCancel()}>
          <span className="icon-cancel icon-padding-right"></span><this.Translate id="text_cancel" />
        </this.Button>  
        <this.Button htmlType="submit" loading={this.submitLoading} className="info">
          <span className="icon-save icon-padding-right"></span><this.Translate id="stock_adjustment_approve" />
        </this.Button>
      </div>
    );
  }

  componentDidUpdate() {
    if (this.props.stockAdjustmentApproveUpdate.fetched) {
      const step = this.props.stockAdjustmentApproveUpdate.data.step;
      this.title = <div><this.Translate id="text_stock_adjustment_request" /> 
        {step in this.ADJUSTMENT_STEP_STR ? <this.Tag color={this.ADJUSTMENT_STEP_STR[step].color} 
          className="text-uppercase text-center po-step-tag">{this.ADJUSTMENT_STEP_STR[step].name}</this.Tag> : ""}
      </div>;
    }
  }

  handleSubmit (e) {
    e.preventDefault();

  }

  prepareFormDataForUpdate(values) {
  
  }
  
  handleCancel() {
    this.dispatch(StockAdjustmentAction.reset(Constant.RESET_STOCK_ADJUSTMENT_APPROVE));
  }

  render() {
    const {
      stockAdjustmentApproveUpdate, 
      form, 
      locale, 
      storeLocation,
      dispatch
    } = this.props;

    this.submitLoading = stockAdjustmentApproveUpdate.updating;

    if (stockAdjustmentApproveUpdate.showForm) {
      this.content = (
        <FormItem 
          form={form} 
          formData={stockAdjustmentApproveUpdate.data} 
          storeLocation={storeLocation}
          accessLocation={this.props.accessLocation} 
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