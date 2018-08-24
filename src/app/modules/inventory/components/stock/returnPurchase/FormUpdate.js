import React from "react";
import FormItem from "./FormItem";
import { Modal } from "../../shares/Modal/modal";
import ReturnPurchaseAction from "../../../actions/stock/returnPurchase";

export default class Form extends Modal {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false
    };

    this.title = <this.Translate id="update_stock_return_purchase_title" />;
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values["id"] = this.props.returnPurchaseUpdate.data.id;
        values["status"] = this.Enum.ACTIVE;
        this.dispatch(ReturnPurchaseAction.update(values));
      }
    });
  }
    
  handleCancel() {
    this.dispatch(ReturnPurchaseAction.reset());
  }

  render() {
    const {returnPurchaseUpdate, form, locale} = this.props;

    this.submitLoading = returnPurchaseUpdate.updating;

    if (returnPurchaseUpdate.showForm) {
      this.content = (
        <div>
          {returnPurchaseUpdate.error != null ? <this.Alert message={this.requiredMessage} type="error" /> : ""}
          <FormItem formData={returnPurchaseUpdate.data} form={form} locale={locale}/>
        </div>
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}