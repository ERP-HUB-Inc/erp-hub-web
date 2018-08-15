import React from "react";
import FormItem from "./FormItem";
import Modal from "../../shares/Modal";
import operationRecordAction from "../../../action/settings/operationRecord";

export default class Form extends Modal {
  constructor(props) {
    super(props);
    this.title = "operation Record:Update";
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const {operationRecordUpdate} = this.props;
        values["id"] = operationRecordUpdate.data.id;
        values["amount"] = Number(values.amount);
        values["status"] = this.Enum.ACTIVE;
        this.dispatch(operationRecordAction.update(values));
      }
    });
  }
    
  handleCancel() {
    this.dispatch(operationRecordAction.reset());
  }
  
  render() {
    const {operationRecordUpdate, form, locale} = this.props;

    this.submitLoading = operationRecordUpdate.updating;

    this.validatorUpdateRecord(operationRecordUpdate);
    
    if (operationRecordUpdate.showForm) {
      this.content = (
        <FormItem formData={operationRecordUpdate.data} form={form} locale={locale}/>
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}