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
      [Enum.STOCK_ADJUST_STEP.COMPLETE]: {name: <this.Translate id="text_complete" />, color: this.Enum.STOCK_ADJUST_COLOR.COMPLETE}
    };

    this.title = <this.Translate id="text_stock_adjustment_approve" />;  
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  renderCrudAction(){
    return(
      <div className="ant-modal-footer">
        <this.Button className="danger" onClick={() => this.handleCancel()}>
          <span className="icon-cancel icon-padding-right"></span><this.Translate id="text_cancel" />
        </this.Button>  
        <this.Button htmlType="submit" className="info">
          <span className="icon-save icon-padding-right"></span><this.Translate id="stock_adjustment_approve" />
        </this.Button>
      </div>
    );
  }

  handleSubmitConfirmAction(){
    this.props.form.validateFieldsAndScroll((err, values) => {  
      values["id"] = this.props.stockAdjustmentApproveDetail.data.id;
      const stockAdjustmentEntries = [];
      if("stockApproveId" in values){
        values.productVariantId.forEach((productVariantId, index) => {
          stockAdjustmentEntries.push({
            id: values.stockApproveId[index],
            currentQuantity: parseInt(values.currentQty[index], 10),
            productVariantId,
            unitId: values.unitId[index],
            adjustQuantity: values.adjustQuantity[index],
            isApprove: values.isApprove[index]
          });
        });
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
        "adjustQuantity",
        "isApprove",
        "stockApproveId"
      ]);

      values["entries"] =  stockAdjustmentEntries;
      values["step"] = Enum.STOCK_ADJUST_STEP.COMPLETE;
      values["locationId"] = parseFloat(values.locationId);
      this.dispatch(StockAdjustmentAction.update(values));
    }); 
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      this.setState({modalVisible: true});
      this.renderModalConfirmAction();
    }); 
  }

  renderModalConfirmAction() {
    return (
      <this.Modal
        visible={this.state.modalVisible}
        wrapClassName="confirm-delete"  
        footer={null}>
        <div>
          <span className="icon-help icon-padding-right"></span>
          <span className="title">{this.confirmTitle}</span><br/>
          <span>
            <this.Translate id="stock_adjustment_approve_when_click_yes"/>
          </span>
        </div>
        <div className="ant-modal-footer">
          <this.Button className="danger" onClick={() => this.handleCancelConfirmAction()}>
            <span className="icon-cancel icon-padding-right"></span><this.Translate id="text_no" />
          </this.Button>
          <this.Button onClick={() => this.handleSubmitConfirmAction()} loading={this.submitLoading} className="info">
            <span className="icon-checked icon-padding-right"></span><this.Translate id="text_yes" />
          </this.Button>
        </div>
      </this.Modal>
    );
  }
  
  handleCancel() {
    this.dispatch(StockAdjustmentAction.reset(Constant.RESET_STOCK_ADJUSTMENT_APPROVE));

  }

  render() {
    const {
      stockAdjustmentApproveDetail,
      form, 
      locale, 
      dispatch
    } = this.props;

    this.submitLoading = this.props.stockAdjustmentApproveUpdate.updating;

    if (stockAdjustmentApproveDetail.showForm) {
      this.content = (
        <div>
          <FormItem 
            form={form} 
            formData={stockAdjustmentApproveDetail.data} 
            accessLocation={this.props.accessLocation} 
            dispatch={dispatch} 
            locale={locale}
          />
          {this.renderModalConfirmAction()}
        </div>
      );
      return super.render();
    } else {
      return <div/>;
    }
  }
}