import React from "react";
import Modal from "../../../../common/components/shares/Modal";

export default class FormItem extends Modal {
  render() {
    const {formData, form, locale} = this.props;
    const image = {
      uid: "-1",
      name: formData.logo,
      status: "done",
      url: this.Util.getProductImage(formData.logo, this.Enum.IMAGE_SPACE.GENERAL).url
    };
    return (
      <this.Row>
        <this.Col md="12">
          <this.InputText
            name="name"
            label={<this.Translate id="text_name" />}
            placeholder={this.CATranslate("text_name", locale)}
            errorRequired={<this.Translate id="error_require_name" />}
            errorLenght={<this.Translate id="error_receipt_template_name_length" />}
            max={100}
            data={formData.name}
            required={true}
            isAutoFocus={true}
            form={form}/>
        </this.Col>
        <this.Col md="12">
          <this.UploadImg 
            name="logo" 
            label={<this.Translate id="receipt_logo" />}
            data={{file: image}}
            fileList={[image]}
            endPoint={`${this.Util.getAPIURL()}/file/v1/upload/general`}
            endPointDelete={`${this.Util.getAPIURL()}/file/v1/general/delete`}
            accessToken={this.Util.getAccessToken()}
            form={form} />
        </this.Col>
        <this.Col md="12">
          <this.Switchs
            name="isShowStoreName"
            label={<this.Translate id="input_receipt_template_is_store_name" />}
            checked={formData.isShowStoreName}
            form={form}/>
        </this.Col>
        <this.Col md="12">
          <this.Switchs
            name="isShowCustomerInfo"
            label={<this.Translate id="text_show_customer_info" />}
            checked={formData.isShowCustomerInfo}
            form={form}/>
        </this.Col>
        <this.Col md="12">
          <this.Switchs
            name="isShowDevelopBy"
            label={<this.Translate id="text_develop_by" />}
            checked={formData.isShowDevelopBy}
            form={form}/>
        </this.Col>
        <this.Col md="12">
          <this.Switchs
            name="isDefault"
            label={<this.Translate id="text_is_default" />}
            checked={formData.isDefault}
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
      </this.Row>
    );
  }
}

FormItem.defaultProps = {
  formData: {
    name: "",
    isShowStoreName: 0,
    isShowCustomerInfo: 0,
    isShowDevelopBy: 0,
    isDefault: 0,
    status: 1
  }
};