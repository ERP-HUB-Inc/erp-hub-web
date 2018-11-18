import React from "react";
import FormItem from "./FormItem";
import CurrencyExchangeAction from "../../../action/settings/currencyExchange";
import Modal from "../../../../common/components/shares/Modal";

export default class Form extends Modal {
  constructor(props) {
    super(props);
    this.title = <this.Translate id="currency_exchange" />;
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const {currencyExchangeUpdate} = this.props;
        values["id"] = currencyExchangeUpdate.data.id;
        values["value"] = Number(values.value);
        this.dispatch(CurrencyExchangeAction.update(values));
      }
    });
  }
    
  handleCancel() {
    this.dispatch(CurrencyExchangeAction.reset());
  }
  
  render() {
    const {currencyExchangeUpdate, form, currency, dispatch, locale} = this.props;

    this.submitLoading = currencyExchangeUpdate.updating;

    this.validatorUpdateRecord(currencyExchangeUpdate);

    if (currencyExchangeUpdate.showForm) {
      this.content = (
        <FormItem formData={currencyExchangeUpdate.data} currency={currency} dispatch={dispatch} form={form} locale={locale}/>
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}