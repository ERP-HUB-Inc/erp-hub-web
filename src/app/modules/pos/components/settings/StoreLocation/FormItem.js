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
          label={<this.Translate id="text_name" />}
          placeholder={this.CATranslate("text_name", locale)}
          errorRequired={<this.Translate id="error_require_name" />}
          errorLenght={<this.Translate id="error_location_name_length" />}
          required={true}
          isAutoFocus={true}
          form={form}
          max={100} />
        <this.InputText
          data={formData.address}
          name="address"
          label={<this.Translate id="text_address" />}
          placeholder={this.CATranslate("text_address", locale)}
          form={form}
          max={100}
          errorLenght={<this.Translate id="error_location_address_length" />} />
        <this.Select
          name="receiptTemplateId"
          label={<this.Translate id="text_receipt_template" />}
          dataSource={this.props.receiptTemplates}
          defaultValue={formData.id ? formData.receiptTemplateId : this.props.receiptTemplates.length > 0 ? this.props.receiptTemplates[0].id : ""}
          valueKey="id"
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
    address: "",
    status: 1
  }
};