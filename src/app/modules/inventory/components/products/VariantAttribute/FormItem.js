import React from "react";
import Modal from "../../../../common/components/shares/Modal";

export default class FormItem extends Modal {
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
              min={3}
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