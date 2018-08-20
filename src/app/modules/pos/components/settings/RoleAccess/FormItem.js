import React from "react";
import Modal from "../../shares/Modal";

export default class FormItem extends Modal {
  render() {
    const {formData, form, locale} = this.props;
    return (
      <div>
        <this.InputText
          data={formData.name}
          name="name"
          label={<this.Translate id="input_text_role_name" />}
          placeholder={this.CATranslate("input_text_role_name", locale)}
          required={true}
          min={3}
          max={100}
          errorLenght={<this.Translate id="error_role_name_length" />}
          form={form}/>
        <this.InputText
          data={formData.code}
          name="code"
          label={<this.Translate id="place_holder_role_code" />}
          placeholder={this.CATranslate("place_holder_role_code", locale)}
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
    code: "",
    status: 1
  }
};