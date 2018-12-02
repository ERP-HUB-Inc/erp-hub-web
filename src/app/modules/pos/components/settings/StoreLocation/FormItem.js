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
          form={form}
          required={true}
          isAutoFocus={true}
          min={3}
          max={100}
          errorRequired={<this.Translate id="error_require_name" />}
          errorLenght={<this.Translate id="error_location_name_length" />} />
        <this.InputText
          data={formData.address}
          name="address"
          label={<this.Translate id="input_location_address" />}
          placeholder={this.CATranslate("input_location_address", locale)}
          form={form}
          min={3}
          max={100}
          errorLenght={<this.Translate id="error_location_address_length" />} />
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