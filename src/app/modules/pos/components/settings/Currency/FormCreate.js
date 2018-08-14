import React from "react";
import FormItem from "./FormItem";
import Modal from "../../shares/Modal";
import CurrencyAction from "../../../action/settings/currency";

export default class Form extends Modal {
  constructor(props) {
    super(props);
    this.title = <this.Translate id="create_currency_title" />;
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values["value"] = Number(values.value);
        this.dispatch(CurrencyAction.add(values));
      }
    });
  }
    
  handleCancel() {
    this.dispatch(CurrencyAction.reset());
  }
  
  render() {
    const {currencyAdd, form, locale} = this.props;

    this.submitLoading = currencyAdd.adding;

    this.validatorAddRecord(currencyAdd);
    
    if (currencyAdd.showForm) {
      this.content = (
        <FormItem form={form} locale={locale}/>
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}