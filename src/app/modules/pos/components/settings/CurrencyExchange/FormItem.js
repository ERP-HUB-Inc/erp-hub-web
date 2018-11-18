import React from "react";
import CurrencyAction from "../../../../pos/action/settings/currency";
import Modal from "../../../../common/components/shares/Modal";

export default class FormItem extends Modal {
  constructor(props) {
    super(props);
    this.currencyList = [{name: <this.Translate id="text_all_brand"/>, id: 0}];
  }

  componentDidMount(){
    this.props.dispatch(CurrencyAction.fetch());

  }

  getCurrency(){
    const { currency } = this.props;
    let defaultCurrency = [];
    let listCurrency = [];
    if(currency.list){
      currency.list.forEach(currency => {
        if(currency.isSystem === 1){
          defaultCurrency.push(
            currency
          
          );
        }else if(currency.isSystem === 0){
          listCurrency.push(
            currency
          );
        }
      });
    }
    return {defaultCurrency,listCurrency};
  }

  render() {
    const {formData, form, locale} = this.props;
    return (
      <div>
        <this.Select
          name="currencyId"
          label={<this.Translate id="default_currency"/>}
          dataSource={this.getCurrency().defaultCurrency}
          valueKey="id"
          nameKey="name"
          disabled={true}
          defaultValue={this.getCurrency().defaultCurrency.length > 0 ? this.getCurrency().defaultCurrency[0].id : ""}
          form={form}
        />
        {console.log("out put",this.getCurrency().defaultCurrency)}
        <this.Select
          name="basedCurrencyId"
          label={<this.Translate id="to_currency"/>}
          valueKey="id"
          required={true}
          defaultValue={this.props.formData.basedCurrencyId}
          dataSource={this.getCurrency().listCurrency}
          form={form}
        />
          
        <this.InputNumber
          data={formData.value}
          name="value"
          label={<this.Translate id="input_tax_value" />}
          required={true}
          placeholder={this.CATranslate("input_tax_value", locale)}
          form={form}
        />

      </div>
    );
  }
}

FormItem.defaultProps = {
  formData: {
    name: "",
    symbol: "",
    value: 0,
    status: 1
  }
};