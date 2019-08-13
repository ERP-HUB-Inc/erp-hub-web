import React from "react";
import FormItem from "./FormItem";
import ReceivePaymentAction from "../../../../action/transaction/receivePayment";
import Modal from "../../../../../common/components/shares/Modal";

export default class Form extends Modal {
  constructor(props) {
    super(props);
    this.title = <this.Translate id="text_receive_payment" />;
    this.wrapClassName = `${this.wrapClassName} wrap-modal-po modal-po-full-screen`;
    this.width = window.innerWidth < 1000 ? window.innerWidth : 1200;
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.dispatch(ReceivePaymentAction.add(values));
      }
    });
  }
    
  handleCancel() {
    this.dispatch(ReceivePaymentAction.reset());
  }

  renderCrudAction(){}
  
  render() {
    const { addReceivePayment, detailTransaction, form, locale } = this.props;

    this.submitLoading = addReceivePayment.adding;

    this.validatorAddRecord(addReceivePayment);
    if (addReceivePayment.showForm && detailTransaction.showForm) {
      this.content = (
        <div>
          <FormItem
            formData={detailTransaction.data}
            customer={this.props.customer}
            form={form}
            dispatch={this.props.dispatch}
            locale={locale}
          />
        </div>
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}