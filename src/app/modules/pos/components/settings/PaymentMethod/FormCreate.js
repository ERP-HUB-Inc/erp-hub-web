import React from "react";
import FormItem from "./FormItem";
import PaymentMethodAction from "../../../action/settings/paymentMethod";
import Modal from "../../../../common/components/shares/Modal";

export default class FormCreate extends Modal {
  constructor(props) {
    super(props);
    this.title = <this.Translate id="text_payment_method" />;
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values["isEnableOnPOS"] = this.Util.checkValueSwitch(values.isEnableOnPOS);
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