import React from "react";
import FormItem from "./FormItem";
import Action from "../../../action/transaction/incomeExpenseCategory";
import Modal from "../../../../common/components/shares/Modal";

export default class Form extends Modal {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false
    };

    this.title = <this.Translate id="text_category" />;
    this.dispatch = this.props.dispatch;
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values["id"] = this.props.incomeExpenseCategoryUpdate.data.id;
        this.dispatch(Action.update(values));
      }
    });
  }
    
  handleCancel() {
    this.dispatch(Action.reset());
  }

  render() {
    const {incomeExpenseCategoryUpdate, form, locale} = this.props;

    this.submitLoading = incomeExpenseCategoryUpdate.updating;

    if (incomeExpenseCategoryUpdate.showForm) {
      this.content = (
        <FormItem 
          formData={incomeExpenseCategoryUpdate.data} 
          form={form} locale={locale}
        />
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}