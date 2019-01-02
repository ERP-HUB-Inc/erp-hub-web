import React from "react";
import FormItem from "./FormItem";
import CurrencyAction from "../../../action/settings/currency";
import Modal from "../../../../common/components/shares/Modal";

export default class Form extends Modal {
  constructor(props) {
    super(props);
    this.title = <this.Translate id="text_currency" />;
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const {currencyUpdate} = this.props;
        values["id"] = currencyUpdate.data.id;
        values["value"] = Number(values.value);
        values["isDefault"] = currencyUpdate.data.isDefault;
        values["isSystem"] = currencyUpdate.data.isSystem;
        values["isForBilling"] = currencyUpdate.data.isForBilling;
        this.dispatch(CurrencyAction.update(values));
      }
    });
  }
    
  handleCancel() {
    this.dispatch(CurrencyAction.reset());
  }
  
  render() {
    const {currencyUpdate, form, locale} = this.props;

    this.submitLoading = currencyUpdate.updating;

    this.validatorUpdateRecord(currencyUpdate);

    if (currencyUpdate.showForm) {
      this.content = (
        <FormItem formData={currencyUpdate.data} form={form} locale={locale}/>
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}