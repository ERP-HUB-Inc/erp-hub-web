import React from "react";
import Modal from "../../shares/Modal";

export default class FormItem extends Modal {
  render() {
    const {formData, form, locale} = this.props;
    return (
      <div>
        <this.InputText
          name="name"
          label={<this.Translate id="input_receipt_template_name" />}
          placeholder={this.CATranslate("input_receipt_template_name", locale)}
          errorLenght={<this.Translate id="error_receipt_template_name_length" />}
          max={100}
          min={4}
          data={formData.name}
          required={true}
          form={form}/>

        {/* <this.UploadImg 
            name="upload" 
            label="Receipt Logo" 
            required={ false }
            form={form} 
          />    */}
          
        <this.Switchs
          name="isShowStoreName"
          label={<this.Translate id="input_receipt_template_is_store_name" />}
          checked={formData.isShowStoreName}
          form={form}
        />

        <this.Switchs
          name="isShowCustomerInfo"
          label={<this.Translate id="input_receipt_template_is_customer_info" />}
          checked={formData.isShowCustomerInfo}
          form={form}
        />

        <this.Switchs
          name="isShowDevelopBy"
          label={<this.Translate id="input_receipt_template_is_develop_by" />}
          checked={formData.isShowDevelopBy}
          form={form}
        />

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
    isShowStoreName: 0,
    isShowCustomerInfo: 0,
    isShowDevelopBy: 0,
    status: 1
  }
};