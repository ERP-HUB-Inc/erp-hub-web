import React from "react";
import FormItem from "./FormItem";
import Modal from "../../../../common/components/shares/Modal";
import PurchaseOrderAction from "../../../actions/stock/purchaseOrder";

export default class Form extends Modal {
  constructor(props) {
    super(props);
    this.width = "80%";
    this.state = {
      disabled: false
    };

    this.title = <this.Translate id="update_stock_purchase_order_title" />;
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values["id"] = this.props.purchaseOrderUpdate.data.id;
        values["status"] = this.Enum.ACTIVE;
        this.dispatch(PurchaseOrderAction.update(values));
      }
    });
  }
    
  handleCancel() {
    this.dispatch(PurchaseOrderAction.reset());
  }

  render() {
    const {purchaseOrderUpdate, form, locale,supplier,dispatch} = this.props;

    this.submitLoading = purchaseOrderUpdate.updating;

    if (purchaseOrderUpdate.showForm) {
      this.content = (
        <div>
          {purchaseOrderUpdate.error != null ? <this.Alert message={this.requiredMessage} type="error" /> : ""}
          <FormItem formData={purchaseOrderUpdate.data} supplier={supplier} dispatch={dispatch} form={form} locale={locale}/>
        </div>
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}