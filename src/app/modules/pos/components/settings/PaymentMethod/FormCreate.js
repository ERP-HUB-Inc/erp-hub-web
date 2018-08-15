import React from "react";
import FormItem from "./FormItem";
import Modal from "../../shares/Modal";
import PaymentMethodAction from "../../../action/settings/paymentMethod";

export default class FormCreate extends Modal {
  constructor(props) {
    super(props);
    this.title = <this.Translate id="create_payment_method_title" />;
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.dispatch(PaymentMethodAction.add(values));
        this.isRepsonseBackError = "none";
      }
    });
  }
    
  handleCancel() {
    this.dispatch(PaymentMethodAction.reset());
  }

  render() {
    const {paymentMethodAdd, form, locale} = this.props;

    this.submitLoading = paymentMethodAdd.adding;

    this.submited = paymentMethodAdd.added;

    this.validatorAddRecord(paymentMethodAdd);

    if (paymentMethodAdd.showForm) {
      this.content = (
        <FormItem form={form} locale={locale}/>
      );
      return super.render();
    } else {
      return <div />;
    }
  }
}