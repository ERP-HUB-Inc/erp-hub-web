import React from "react";
import Modal from "../../../../common/components/shares/Modal";

export default class FormItem extends Modal {
  render() {
    const { form,locale,formData } = this.props;
    return (
      <this.Row>
        <this.Col md="12">
          <this.InputText
            name="name"
            label={<this.Translate id="text_name" />}
            data={formData.name}
            placeholder={this.CATranslate("text_name", locale)}
            required={true}
            isAutoFocus={true}
            errorRequired={<this.Translate id="input_error_products_unit_name" />}
            max={100}
            min={3}
            form={form}/>
        </this.Col>
        <this.Col md="12">
          <this.InputNumber
            name="multiple"
            label={<this.Translate id="text_number_in_unit" />}
            data={formData.multiple}
            placeholder={this.CATranslate("text_number_in_unit", locale)}
            required={true}
            errorRequired={<this.Translate id="input_error_products_in_unit" />}
            max={100}
            form={form}/>
        </this.Col>
        <this.Col md="12">
          <this.Select
            name="isDefault"
            label={<this.Translate id="text_is_default" />}
            dataSource={this.isDefaultDataSource}
            defaultValue={formData.isDefault}
            form={form}/>
        </this.Col>
      </this.Row>
    );
  }
}

FormItem.defaultProps = {
  formData: {
    name:"",
    multiple:"",
    status: 1,
    isDefault: 0
  }
};