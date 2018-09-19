import React from "react";
import Modal from "../../../../common/components/shares/Modal";

export default class FormItem extends Modal {
  render() {
    const {formData, form, locale} = this.props;
    return (
      <div>
        <this.InputText
          data={formData.name}
          name="name"
          label={<this.Translate id="input_tax_name" />}
          placeholder={this.CATranslate("input_tax_name", locale)}
          required={true}
          min={3}
          max={100}
          errorLenght={<this.Translate id="error_tax_name_length" />}
          form={form}/>
        <this.InputText
          data={formData.symbol}
          name="symbol"
          label={<this.Translate id="input_tax_symbol" />}
          placeholder={this.CATranslate("input_tax_symbol", locale)}
          max={255}
          form={form}/>
        <this.InputNumber
          data={formData.value}
          name="value"
          label={<this.Translate id="input_tax_value" />}
          placeholder={this.CATranslate("input_tax_value", locale)}
          form={form}/>
        <this.Select
          name="status"
          label={<this.Translate id="text_status" />}
          dataSource={this.statusDataSource}
          defaultValue={formData.status}
          form={form}/>
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