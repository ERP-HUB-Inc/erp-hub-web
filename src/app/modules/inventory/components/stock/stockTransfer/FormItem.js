import React from "react";
import { Modal  } from "../../shares/Modal/modal";

export default class FormItem extends Modal {
  render() {
    const { form,locale,formData } = this.props;
    return (
      <div>
        <this.Row>
          <this.Col md="6">
            <this.InputText
              name="name"
              label={<this.Translate id="input_stock_supplier_name" />}
              data={formData.name}
              placeholder={this.CATranslate("input_stock_supplier_name", locale)}
              required={true}
              errorRequired={<this.Translate id="input_error_stock_supplier_name" />}
              max={100}
              min={3}
              form={form}/> 
          </this.Col>
          <this.Col md="6">
            <this.InputText
              name="phoneNumber"
              label={<this.Translate id="input_stock_supplier_phone_number" />}
              data={formData.phoneNumber}
              placeholder={this.CATranslate("input_stock_supplier_phone_number", locale)}
              errorRequired={<this.Translate id="input_error_stock_supplier_phone_number" />}
              max={100}
              min={3}
              form={form}/> 
          </this.Col>
          <this.Col md="12">
            <this.InputEmail
              name="email"
              label={<this.Translate id="input_stock_supplier_email" />}
              data={formData.email}
              placeholder={this.CATranslate("input_stock_supplier_email", locale)}
              errorRequired={<this.Translate id="input_error_stock_supplier_phone_number" />}
              form={form}/> 
          </this.Col>
          <this.Col md="12">
            <this.InputTextArea
              name="description"
              label={<this.Translate id="input_stock_supplier_description" />}
              data={formData.description}
              placeholder={this.CATranslate("input_stock_supplier_description", locale)}
              required={true}
              errorRequired={<this.Translate id="input_error_stock_supplier_description" />}
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
    description:"",
    status: 1
  }
};