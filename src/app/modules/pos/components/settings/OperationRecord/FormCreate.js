import React from "react";
import FormItem from "./FormItem";
import Modal from "../../shares/Modal";
import operationRecordAction from "../../../action/settings/operationRecord";
import "./index.css"; 

export default class Form extends Modal {
  constructor(props) {
    super(props);
    this.title = "operation Record";
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.operationTypes = [
      {title: <this.Translate id="operation_record_income" />, value: this.Enum.OPERATION_TYPE.INCOME},
      {title: <this.Translate id="operation_record_expense" />, value: this.Enum.OPERATION_TYPE.EXPENSE}
    ];
  } 


  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values["amount"] = Number(values.amount);
        values["status"] = this.Enum.ACTIVE;
        this.dispatch(operationRecordAction.add(values));
      }
    }); 
  }
    
  handleCancel() {
    this.dispatch(operationRecordAction.reset());
  }
  
  render() {
    const {operationRecordAdd, form, locale} = this.props;

    this.submitLoading = operationRecordAdd.adding;

    this.validatorAddRecord(operationRecordAdd);
    
    if (operationRecordAdd.showForm) {
      this.content = (
        <FormItem form={form} locale={locale}/>
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}