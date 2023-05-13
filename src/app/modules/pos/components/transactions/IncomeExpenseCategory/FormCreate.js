import React from "react";
import FormItem from "./FormItem";
import Action from "../../../action/transaction/incomeExpenseCategory";
import Modal from "../../../../common/components/shares/Modal";

export default class FormCreate extends Modal {
  constructor(props) {
    super(props);
    this.title = <this.Translate id="text_condition" />;
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.dispatch(Action.add(values));   
      }
    });
  }
      
  handleCancel() {
    this.dispatch(Action.reset());
  }

  render() {
    const {incomeExpenseCategoryAdd, form, locale} = this.props;
    
    this.submitLoading = incomeExpenseCategoryAdd.adding;

    if (incomeExpenseCategoryAdd.showForm) {
      this.content = <FormItem form={form} locale={locale} />;
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}