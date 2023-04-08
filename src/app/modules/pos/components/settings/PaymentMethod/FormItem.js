import React from "react";
import Modal from "../../../../common/components/shares/Modal";

export default class FormItem extends Modal {
  render() {
    const {formData, form, locale} = this.props;
    const image = {
      uid: "-1",
      name: formData.logo,
      status: "done",
      url: this.Util.getGeneralImage(`${this.Util.getClientId()}/payment_method/${formData.logo}`, this.Enum.IMAGE_SPACE.GENERAL).url
    };
    return (
      <div>
        <this.InputText
          data={formData.name}
          name="name"
          label={<this.Translate id="text_name" />}
          placeholder={this.CATranslate("text_name", locale)}
          errorRequired={<this.Translate id="error_require_name" />}
          errorLenght={<this.Translate id="error_payment_method_name_length" />}
          required={true}
          isAutoFocus={true}
          max={100}
          form={form}/>
        <this.UploadImg 
          name="logo" 
          label={<this.Translate id="text_bank_logo" />}
          data={{file: image}}
          fileList={[image]}
          endPoint={`${this.Util.getAPIURL()}/file/v1/upload/payment_method`}
          endPointDelete={`${this.Util.getAPIURL()}/file/v1/delete`}
          accessToken={this.Util.getAccessToken()}
          form={form} />
        <this.InputText
          data={formData.bankAccNo}
          name="bankAccNo"
          label={<this.Translate id="text_bank_acc_no" />}
          placeholder={this.CATranslate("text_enter_bank_acc_no", locale)}
          max={255}
          form={form}
        />
        <this.InputText
          data={formData.bankAccName}
          name="bankAccName"
          label={<this.Translate id="text_bank_acc_name" />}
          placeholder={this.CATranslate("text_enter_bank_acc_name", locale)}
          max={255}
          form={form}
        />
        <this.InputText
          data={formData.phoneNumber}
          name="phoneNumber"
          label={<this.Translate id="text_transfer_phone_no" />}
          placeholder={this.CATranslate("text_enter_transfer_phone_no", locale)}
          form={form}
        />
        <this.Switchs
          name="isEnableOnPOS"
          label={<this.Translate id="text_enable_on_pos" />}
          checked={formData.isEnableOnPOS}
          form={form}/>
        <this.Select
          name="type"
          label={<this.Translate id="text_type" />}
          dataSource={[{name: "Bank Transfer", value: "BANK_TRANSFER"}, {name: "Transfer Agent", value: "TRANSFER_AGENT"}]}
          defaultValue={formData.type}
          form={form}/>
      </div>
    );
  }
}

FormItem.defaultProps = {
  formData: {
    name: "",
    description: "",
    isEnableOnPOS: 0,
    status: 1
  }
};