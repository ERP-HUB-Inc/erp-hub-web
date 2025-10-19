import React from "react";
import BaseModal from "@layout/base-modal";

export default class FormItem extends BaseModal {
  render() {
    const {form, locale, formData} = this.props;
    return (
      <div>
        <this.Row>
          <this.Col md="12">
            <this.InputText
              name="name"
              label={<this.Translate id="text_name" />}
              data={formData.name}
              placeholder={this.CATranslate("text_name", locale)}
              required={true}
              isAutoFocus={true}
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
    name:""
  }
};