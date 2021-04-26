import React from "react";
import FormItem from "./FormItem";
import Enum from "../../../../enums";
import Constant from "../../../../constants/stock/purchaseOrder";
import PurchaseOrderAction from "../../../../actions/stock/purchaseOrder";
import Modal from "../../../../../common/components/shares/Modal";
import "./index.css";

export default class FormCreate extends Modal {
  constructor(props) {
    super(props);
    this.title = <div><span className="icon-help icon-padding-right"></span> <span><this.Translate id="create_stock_purchase_order_send_mail_title" /></span></div>;
    this.confirmTextAction = <this.Translate id="purchase_order_confirm_push_to_supplier"/>;
    this.wrapClassName = "wrap-confirm-purchase-order";
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {      
        let purchaseOrder =  this.props.formvalue;
        purchaseOrder["step"] = Enum.PO_STEP.PROCESS;
        this.props.callBackGetEmail(values.supplierEmail);
        this.dispatch(PurchaseOrderAction.pushToSupplier(purchaseOrder));
      }
    });
  }
  
  handleCancel() {
    this.dispatch(PurchaseOrderAction.reset(Constant.PUSH_PURCHASE_ORDER_TO_SUPPLIER_RESET));    
  }
  
  renderCrudAction(){
    return(
      <div className="ant-modal-footer">
        <this.Button className="danger" onClick={() => this.handleCancel()}>
          <span className="icon-cancel icon-padding-right"></span><this.Translate id="text_cancel" />
        </this.Button>  
        <this.Button htmlType="submit" loading={this.submitLoading} className="info" onClick={this.handlePush}>
          <span className="icon-push-button icon-padding-right"></span> <this.Translate id="button_stock_purchase_order_push" />
        </this.Button>  
      </div>
    );
  }


  render() {
    const {
      purchaseOrderPushToSupplier,
      purchaseOrderDetail} = this.props;

    this.submitLoading = purchaseOrderPushToSupplier.updating;

    if (purchaseOrderPushToSupplier.showForm) {
      this.content = <FormItem
        form={this.props.form}
        dispatch={this.props.dispatch}
        supplierDetail={this.props.supplier}
        purchaseOrderDetail={purchaseOrderDetail}
        locale={this.props.locale} />;
      return super.render();
    } else {
      return <div/>;
    }
  }
}