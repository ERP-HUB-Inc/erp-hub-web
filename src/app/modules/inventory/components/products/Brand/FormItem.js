import React from "react";
import Modal from "../../../../common/components/shares/Modal";

export default class FormItem extends Modal {
  render() {
    const { form,locale,formData } = this.props;
    return (
      <div id="scroll-layout">
        <this.Row>
          <this.Col md="12">
            <this.InputText
              name="name"
              label={<this.Translate id="text_name" />}
              data={formData.name}
              placeholder={this.CATranslate("text_name", locale)}
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
              label={<this.Translate id="text_description" />}
              data={formData.description}
              placeholder={this.CATranslate("text_description", locale)}
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