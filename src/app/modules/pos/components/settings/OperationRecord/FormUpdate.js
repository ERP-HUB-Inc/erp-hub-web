import React from "react";
import FormItem from "./FormItem";
import operationRecordAction from "../../../action/settings/operationRecord";
import Modal from "../../../../common/components/shares/Modal";

export default class Form extends Modal {
  constructor(props) {
    super(props);
    this.title = <this.Translate id="create_operation_record_title"/>;
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
      this.content = <FormItem formData={operationRecordUpdate.data} form={form} locale={locale}/>;
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}