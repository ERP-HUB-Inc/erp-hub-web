import React from "react";
import { Modal }  from "../../shares/Modal/modal";

export default class FormItem extends Modal {
  render() {
    const { form,locale,formData } = this.props;
    return (
      <div>
        <this.Row>
          <this.Col md="12">
            <this.InputText
              name="name"
              label={<this.Translate id="input_products_unit_name" />}
              data={formData.name}
              placeholder={this.CATranslate("input_products_unit_name", locale)}
              required={true}
              errorRequired={<this.Translate id="input_error_products_unit_name" />}
              max={100}
              min={3}
              form={form}/>
          </this.Col>
          <this.Col md="12">
            <this.InputNumber
              name="multiple"
              label={<this.Translate id="input_products_number_in_unit" />}
              data={formData.multiple}
              placeholder={this.CATranslate("input_products_number_in_unit", locale)}
              required={true}
              errorRequired={<this.Translate id="input_error_products_in_unit" />}
              max={100}
              form={form}/>
          </this.Col>
        </this.Row>
      </div>
    );
  }
}

FormItem.defaultProps = {
  formData: {
    name:"",
    multiple:"",
    status: 1
  }
};