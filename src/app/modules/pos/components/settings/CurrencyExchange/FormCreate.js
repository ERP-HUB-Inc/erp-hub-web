import React from "react";
import FormItem from "./FormItem";
import CurrencyExchangeAction from "../../../action/settings/currencyExchange";
import Modal from "../../../../common/components/shares/Modal";

export default class FormCreate extends Modal {
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
        let getvalues = 0;
        values["value"] = Number(values.value);

        //default values
        if(values["checkedSwitch"] === 0){
          getvalues = values["value"] / 1; 
        }else if(values["checkedSwitch"] === 1){
          getvalues = 1 / values["value"] ; 
        }
        
        this.Util.clearObjProperty(values, [
          "checkedSwitch",
          "switch",
          "valuehidden"
        ]);

        values["value"] = Number(getvalues);
        this.dispatch(CurrencyExchangeAction.add(values));
      }
    });
  }
    
  handleCancel() {
    this.dispatch(CurrencyExchangeAction.reset());
  }
  
  render() {
    const {currencyExchangeAdd, form, currency,dispatch, locale} = this.props;

    this.submitLoading = currencyExchangeAdd.adding;

    this.validatorAddRecord(currencyExchangeAdd);
    
    if (currencyExchangeAdd.showForm) {
      this.content = (
        <FormItem form={form} currency={currency} dispatch={dispatch} locale={locale}/>
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}