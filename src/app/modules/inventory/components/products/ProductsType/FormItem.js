import React from "react";
import Modal from "../../../../common/components/shares/Modal";

export default class FormItem extends Modal {
  render() {
    let image = {};

    if (this.props.formData.id) {
      image = {
        uid: "-1",
        name: this.props.formData["image"],
        status: "done",
        url: this.Util.getProductImage(this.props.formData["image"], this.Enum.IMAGE_SPACE.CATEGORY).url
      };
    }

    return <this.Row>
      <this.Col md="12">
          <this.InputText
            name="name"
            data={this.props.formData["name"]}
            label={<this.Translate id="text_name" />}
            placeholder={this.CATranslate("text_name", this.props.locale)}
            errorRequired={<this.Translate id="error_require_name" />}
            max={100}
            isAutoFocus={true}
            form={this.props.form} />
      </this.Col>
      <this.Col>
        <this.UploadImg 
          name="image"
          endPoint={`${this.Util.getAPIURL()}/file/v1/upload/category`}
          endPointDelete={`${this.Util.getAPIURL()}/file/v1/category/delete`}
          accessToken={this.Util.getAccessToken()}
          fileList={[image]}
          data={{file: image}}
          form={this.props.form}
        />
      </this.Col>
    </this.Row>;
  }
}

FormItem.defaultProps = {
  formData: {
    name:"",
    description:""
  }
};