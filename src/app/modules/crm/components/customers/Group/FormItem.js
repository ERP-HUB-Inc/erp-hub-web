import React from "react";
import Modal from "../../../../common/components/shares/Modal";

export default class FormItem extends Modal {
  render() {
    const {formData, form, locale} = this.props;
    return (
      <div>
        <this.Col md="12">
          <this.InputText
            name="name"
            label={<this.Translate id="text_name" />}
            data={formData.name}
            placeholder={this.CATranslate("text_name", locale)}
            required={true}
            errorRequired={<this.Translate id="input_error_group_customer_name" />}
            max={100}
            form={form}/>
        </this.Col> 
        <this.Col md="12">
          <this.Select
            name="status"
            label={<this.Translate id="text_status" />}
            dataSource={this.statusDataSource}
            defaultValue={formData.status}
            form={form}/>
        </this.Col> 
      </div>
    );
  }
}

FormItem.defaultProps = {
  formData: {
    name: "",
    status: 1
  }
};