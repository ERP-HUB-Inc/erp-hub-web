import React from "react";
import FormItem from "./FormItem";
import Modal from "../../../../common/components/shares/Modal";
import ReceivePurchaseAction from "../../../actions/stock/receivePurchase";

export default class Form extends Modal {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false
    };

    this.title = <this.Translate id="update_stock_supplier_title" />;
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values["id"] = this.props.supplierUpdate.data.id;
        values["status"] = this.Enum.ACTIVE;
        this.dispatch(ReceivePurchaseAction.update(values));
      }
    });
  }
    
  handleCancel() {
    this.dispatch(ReceivePurchaseAction.reset());
  }

  render() {
    const {supplierUpdate, form, locale} = this.props;

    this.submitLoading = supplierUpdate.updating;

    if (supplierUpdate.showForm) {
      this.content = (
        <div>
          {supplierUpdate.error != null ? <this.Alert message={this.requiredMessage} type="error" /> : ""}
          <FormItem formData={supplierUpdate.data} form={form} locale={locale}/>
        </div>
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}