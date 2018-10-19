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
              label={<this.Translate id="input_products_brand_name" />}
              data={formData.name}
              placeholder={this.CATranslate("input_products_brand_name", locale)}
              required={true}
              isAutoFocus={true}
              errorRequired={<this.Translate id="input_error_products_brand_name" />}
              max={100}
              min={3}
              form={form}/> 
          </this.Col>
          <this.Col md="12">
            <this.InputTextArea
              name="description"
              label={<this.Translate id="input_products_brand_description" />}
              data={formData.description}
              placeholder={this.CATranslate("input_products_brand_description", locale)}
              required={true}
              errorRequired={<this.Translate id="input_error_products_brand_description" />}
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