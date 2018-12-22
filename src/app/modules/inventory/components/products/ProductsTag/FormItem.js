import React from "react";
import Modal from "../../../../common/components/shares/Modal";

export default class FormItem extends Modal {
  render() {
    const { form,locale,formData } = this.props;
    return (
      <this.Row>
        <this.Col md="12">
          <this.InputText
            name="tag"
            label={<this.Translate id="text_name" />}
            data={formData.tag}
            placeholder={this.CATranslate("text_name", locale)}
            required={true}
            errorRequired={<this.Translate id="input_error_products_tag_name" />}
            max={100}
            min={3}
            form={form}/> 
        </this.Col>
      </this.Row>
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