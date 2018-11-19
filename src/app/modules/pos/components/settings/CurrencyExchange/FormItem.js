import React from "react";
import CurrencyAction from "../../../../pos/action/settings/currency";
import Modal from "../../../../common/components/shares/Modal";

export default class FormItem extends Modal {
  constructor(props) {
    super(props);
    this.state = {
      switchLanguage: 1
    };
    this.currencyList = [{name: <this.Translate id="text_all_brand"/>, id: 0}];
    this.switchLanguage = this.switchLanguage.bind(this);
  }

  componentDidMount(){
    this.props.dispatch(CurrencyAction.fetch());
  }

  switchLanguage(checked){
    this.setState({
      switchLanguage: checked === 0
    });
    this.props.form.setFieldsValue({checkedSwitch: checked});
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
    const { switchLanguage } = this.state;
    return (
      <div>
        <div style={{ display: "none" }}>
          <this.InputNumber
            type="hidden"
            name="checkedSwitch"
            data={0}
            form={form}
          /> 
        </div>

        {/* default based currency */}
        { switchLanguage ?
          <div>
           
            <this.Select
              name="currencyId"
              label={<this.Translate id="based_currency"/>}
              dataSource={this.getCurrency().defaultCurrency}
              valueKey="id"
              nameKey="name"
              disabled={true}
              defaultValue={this.getCurrency().defaultCurrency.length > 0 ? this.getCurrency().defaultCurrency[0].id : ""}
              form={form}
            />
          </div>
          : 
          <div>
            <this.Select
              name="basedCurrencyId"
              label={<this.Translate id="to_currency"/>}
              valueKey="id"
              required={true}
              defaultValue={formData.basedCurrencyId}
              dataSource={this.getCurrency().listCurrency}
              form={form}
            />
          </div>
        }

        <this.InputNumber
          data="1"
          name="valuehidden"
          placeholder={this.CATranslate("input_tax_value", locale)}
          disabled={true}
          form={form}
        /> 

        <this.Switchs 
          name="switch" 
          icon="icon-operation"
          label={<this.Translate id="switch_currency"/>}
          checked={this.state.isShowDiagram ? 1 : 0} 
          onChange={this.switchLanguage} 
          checkedicon={1} 
          form={form} 
        />

        { switchLanguage ?
          <div>
            <this.Select
              name="basedCurrencyId"
              label={<this.Translate id="to_currency"/>}
              valueKey="id"
              required={true}
              defaultValue={this.props.formData.basedCurrencyId}
              dataSource={this.getCurrency().listCurrency}
              form={form}
            />
          </div> 
          : 
          <this.Select
            name="currencyId"
            label={<this.Translate id="based_currency"/>}
            dataSource={this.getCurrency().defaultCurrency}
            valueKey="id"
            nameKey="name"
            disabled={true}
            defaultValue={this.getCurrency().defaultCurrency.length > 0 ? this.getCurrency().defaultCurrency[0].id : ""}
            form={form}
          />
        }
       
        <this.InputNumber
          name="value"
          label={<this.Translate id="input_tax_value"/>}
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