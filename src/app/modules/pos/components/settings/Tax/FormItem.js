import React from "react";
import Modal from "../../../../common/components/shares/Modal";

export default class FormItem extends Modal {
  constructor(props) {
    super(props);
    this.languageCodes = [
      {name: "en", value: "en"},
      {name: "km", value: "km"},
      {name: "bm", value: "bm"},
    ];
  }
  render() {
    const {formData, form, locale} = this.props;
    return (
      <div id="scroll-layout">
        <this.InputText
          data={formData.name}
          name="name"
          label={<this.Translate id="text_name" />}
          placeholder={this.CATranslate("text_name", locale)}
          form={form}
          required={true}
          isAutoFocus={true}
          min={3}
          max={100}
          errorRequired={<this.Translate id="error_require_name" />}
          errorLenght={<this.Translate id="error_tax_name_length" />} />
        <this.InputNumber
          data={formData.rate}
          name="rate"
          label={<this.Translate id="input_tax_rate" />}
          placeholder={this.CATranslate("input_tax_rate", locale)}
          form={form}
          required={true}
          max={99999}
          errorRequired={<this.Translate id="error_require_rate" />}
          errorLength={<this.Translate id="error_tax_rate_length" />} />
        <this.InputText
          data={formData.labelOnInvoice}
          name="labelOnInvoice"
          label={<this.Translate id="input_tax_label_on_invoice" />}
          placeholder={this.CATranslate("input_tax_label_on_invoice", locale)}
          form={form}
          max={255}
          errorLenght={<this.Translate id="error_tax_name_length" />} />
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
    rate: 0,
    labelOnInvoice: "",
    status: 1
  }
};