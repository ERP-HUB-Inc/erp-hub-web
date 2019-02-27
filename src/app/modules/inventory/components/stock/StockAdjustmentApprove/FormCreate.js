import React from "react";
import FormItem from "./FormItem";
import Constant from "../../../constants/stock/stockAdjustmentApprove";
import Modal from "../../../../common/components/shares/Modal";
import StockAdjustmentRequestAction from "../../../actions/stock/stockAdjustmentApprove";
import "./index.css";

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
          <span className="icon-save icon-padding-right"></span><this.Translate id="stock_adjustment_approve" />
        </this.Button>
      </div>
    );
  }


  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log("values",values);
        // this.dispatch(StockAdjustmentRequestAction.add(values));
      }
    });
  }
      
  handleCancel() {
    this.dispatch(StockAdjustmentRequestAction.reset(Constant.RESET_STOCK_ADJUSTMENT_APPROVE));
  }

  render() {
    const {
      stockAdjustmentApproveAdd, 
      form, 
      locale, 
      storeLocation, 
      productSearch, 
      dispatch
    } = this.props;
    
    this.submitLoading = stockAdjustmentApproveAdd.adding;

    if (stockAdjustmentApproveAdd.showForm) {
      this.content = 
        <FormItem 
          form={form} 
          storeLocation={storeLocation} 
          accessLocation={this.props.accessLocation}
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