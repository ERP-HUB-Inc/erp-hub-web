import React from "react";
import CurrencyAction from "../../../../pos/action/settings/currency";
import Modal from "../../../../common/components/shares/Modal";

export default class FormItem extends Modal {
  constructor(props) {
    super(props);
    this.state = {
      switchCurrency: 1
    };
    this.currencyList = [{name: <this.Translate id="text_all_brand"/>, id: 0}];
    this.switchCurrency = this.switchCurrency.bind(this);
  }

  componentDidMount(){
    this.props.dispatch(CurrencyAction.fetch());
  }

  switchCurrency(checked){
    this.setState({
      switchCurrency: checked === 0
    });
    this.props.form.setFieldsValue({checkedSwitch: checked});
  }

  render() {
    const {form, locale} = this.props;
    const { switchCurrency } = this.state;
    let defaultCurrencyId = "";
    let listCurrency = [];

    if(this.props.currency.list){
      this.props.currency.list.forEach(currency => {
        if(currency.isDefault === this.Enum.IS_DEFAULT){
          defaultCurrencyId = currency.id;
        }else {
          listCurrency.push(
            currency
          );
        }
      });
    }

    return (
      <div>
        <div style={{ display: "none" }}>
          <this.InputNumber
            type="hidden"
            name="checkedSwitch"
            data={0}
            precision="6"
            form={form}/> 
        </div>

        {/* default based currency */}
        { switchCurrency ?
          <div>
           
            <this.Select
              name="basedCurrencyId"
              label={<this.Translate id="from_base_currency"/>}
              dataSource={this.props.currency.list}
              valueKey="id"
              nameKey="name"
              disabled={true}
              defaultValue={defaultCurrencyId}
              form={form}/>
          </div>
          : 
          <div>
            <this.Select
              name="currencyId"
              label={<this.Translate id="from_currency"/>}
              valueKey="id"
              required={true}
              defaultValue={this.props.formData.id ? this.props.formData.basedCurrencyId : listCurrency.length > 0 ? listCurrency[0].id : ""}
              dataSource={listCurrency}
              form={form}/>
          </div>
        }

        <this.InputNumber
          data="1"
          precision="6"
          name="valuehidden"
          label={<this.Translate id="text_value"/>}
          placeholder={this.CATranslate("text_value", locale)}
          disabled={true}
          form={form}/> 

        <this.Switchs 
          name="switch" 
          icon="icon-operation"
          label={<this.Translate id="switch_currency"/>}
          checked={this.state.isShowDiagram ? 1 : 0} 
          onChange={this.switchCurrency} 
          checkedicon={1} 
          form={form} />

        { switchCurrency ?
          <div>
            <this.Select
              name="currencyId"
              label={<this.Translate id="to_currency"/>}
              valueKey="id"
              required={true}
              defaultValue={this.props.formData.id ? this.props.formData.basedCurrencyId : listCurrency.length > 0 ? listCurrency[0].id : ""}
              dataSource={listCurrency}
              form={form}/>
          </div> 
          : 
          <this.Select
            name="basedCurrencyId"
            label={<this.Translate id="to_base_currency"/>}
            dataSource={this.props.currency.list}
            valueKey="id"
            nameKey="name"
            disabled={true}
            defaultValue={defaultCurrencyId}
            form={form}/>
        }
       
        <this.InputNumber
          name="value"
          precision="6"
          label={<this.Translate id="text_value"/>}
          required={true}
          isAutoSelect={true}
          placeholder={this.CATranslate("text_value", locale)}
          form={form}/> 
      </div>
    );
  }
}

FormItem.defaultProps = {
  formData: {
    name: "",
    value: 0,
    status: 1
  }
};