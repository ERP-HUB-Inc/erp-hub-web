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
          label={<this.Translate id="input_payment_method_name" />}
          placeholder={this.CATranslate("input_payment_method_name", locale)}
          required={true}
          min={3}
          max={100}
          errorLenght={<this.Translate id="error_payment_method_name_length" />}
          form={form}/>
        <this.InputText
          data={formData.description}
          name="description"
          label={<this.Translate id="input_payment_method_description" />}
          placeholder={this.CATranslate("input_placeholder_description", locale)}
          max={255}
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
    description: "",
    status: 1
  }
};