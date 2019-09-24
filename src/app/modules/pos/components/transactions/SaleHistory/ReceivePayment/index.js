import React from "react";
import Enum from "../../../../enums";
import FormItem from "./FormItem";
import ReceivePaymentAction from "../../../../action/transaction/receivePayment";
import Modal from "../../../../../common/components/shares/Modal";

export default class Form extends Modal {
  constructor(props) {
    super(props);
    this.state = {
      transactionPaymentEntries: []
    };
    this.title = <this.Translate id="text_receive_payment" />;
    this.wrapClassName = `${this.wrapClassName} wrap-modal-po modal-po-full-screen`;
    this.width = window.innerWidth < 1000 ? window.innerWidth : 1200;
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.transactionPaymentEntries = this.transactionPaymentEntries.bind(this);
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values["id"] = this.props.detailTransaction.data.id;
        values["deposit"] = 0;
        values["payDate"] = this.Util.formatDateForMYSQL(values.payDate);
        values["type"] = Enum.TRANSACTION_TYPE.RECEIPT;
        values["status"] = this.props.status;
        values["step"] =  Enum.TRANSACTION_STEP.PAID;
        if(this.props.status === Enum.TRANSACTION_STEP.CREDIT){
          values["step"] = this.props.status;
        }
        values["transactionPaymentEntries"] = this.state.transactionPaymentEntries;
        this.dispatch(ReceivePaymentAction.update(values));
      }
    });
  }

  transactionPaymentEntries(values){
    this.setState({transactionPaymentEntries: values});
  }
    
  handleCancel() {
    this.dispatch(ReceivePaymentAction.reset());
  }

  renderCrudAction(){}
  
  render() {
    const { updateReceivePayment, detailTransaction, form, locale } = this.props;

    this.submitLoading = updateReceivePayment.updating;

    this.validatorAddRecord(updateReceivePayment);

    if (updateReceivePayment.showForm && detailTransaction.showForm) {
      this.content = <FormItem
        formData={detailTransaction.data}
        updateReceivePayment={updateReceivePayment}
        customer={this.props.customer}
        transactionPaymentEntries={this.transactionPaymentEntries}
        form={form}
        dispatch={this.props.dispatch}
        buttonReceivePaymentTitle={this.props.buttonReceivePaymentTitle}
        locale={locale} />;
      return super.render();
    } else {
      return <div />;
    }
  }
}

Form.defaultProps = {
  status: Enum.TRANSACTION_STATUS.PAID
};