import React from "react";
import FormItem from "./FormItem";
import Modal from "../../shares/Modal";
import PaymentMethodAction from "../../../action/settings/paymentMethod";

export default class Form extends Modal {
  constructor(props) {
    super(props);
    this.title = <this.Translate id="update_payment_method_title" />;
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const {paymentMethodUpdate} = this.props;
        values["id"] = paymentMethodUpdate.data.id;
        values["isSystem"] = paymentMethodUpdate.data.isSystem;
        values["isDefault"] = paymentMethodUpdate.data.isDefault;
        this.dispatch(PaymentMethodAction.update(values));
      }
    });
  }
    
  handleCancel() {
    this.dispatch(PaymentMethodAction.reset());
  }

  render() {

    const {paymentMethodUpdate, form, locale} = this.props;

    this.submitLoading = paymentMethodUpdate.updating;

    this.validatorUpdateRecord(paymentMethodUpdate);

    if (paymentMethodUpdate.showForm) {
      this.content = (
        <FormItem formData={paymentMethodUpdate.data} form={form} locale={locale}/>
      );
      return super.render();
    } else {
      return <div />;
    }
  }
}