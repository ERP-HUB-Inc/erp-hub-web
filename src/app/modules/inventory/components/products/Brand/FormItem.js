import React from "react";
import Modal from "../../../../common/components/shares/Modal";

export default class FormItem extends Modal {
  render() {
    const { form,locale,formData } = this.props;
    let image = {};

    if (formData.id) {
      image = {
        uid: "-1",
        name: formData.image,
        status: "done",
        url: this.Util.getProductImage(formData.image, this.Enum.IMAGE_SPACE.BRAND).url
      };
    }

    return (
      <this.Row>
        <this.Col md="12">
          <this.InputText
            name="name"
            data={formData.name}
            label={<this.Translate id="text_name" />}
            placeholder={this.CATranslate("text_name", locale)}
            errorRequired={<this.Translate id="error_require_name" />}
            required={true}
            isAutoFocus={true}
            max={100}
            min={0}
            form={form}/> 
        </this.Col>
        <this.Col md="12">
          <this.UploadImg
            name="image" 
            label={<this.Translate id="text_image" />}
            data={{file: image}}
            fileList={[image]}
            endPoint={`${this.Util.getAPIURL()}/file/v1/upload/brand`}
            endPointDelete={`${this.Util.getAPIURL()}/file/v1/brand/delete`}
            accessToken={this.Util.getAccessToken()}
            form={form} />
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