import React from "react";
import BaseModal from "@layout/BaseModal";
import CategoryService from "@services/CategoryService";

export default class FormItem extends BaseModal {
  state = {
    parents: []
  }

  componentDidMount() {
    CategoryService.get(50)
    .then(response => {
      this.setState({parents: response.data.data});      
    });
  }

  render() {
    const {formData} = this.props;
    let image = {};

    if (formData.id) {
      image = {
        uid: "-1",
        name: formData.image,
        status: "done",
        url: this.Util.getProductImage(formData.image, this.Enum.IMAGE_SPACE.CATEGORY).url
      };
    }

    return <this.Row>
      <this.Col md="12">
        <this.Select
          name="parentId"
          label={<this.Translate id="text_parent_category" />}
          placeholder={this.CATranslate("text_parent_category", this.props.locale)}
          dataSource={this.state.parents}
          valueKey="id"
          allowClear={true}
          defaultValue={formData.parentId}
          form={this.props.form} />
      </this.Col>
      <this.Col md="12">
          <this.InputText
            name="name"
            data={formData.name}
            label={<this.Translate id="text_name" />}
            placeholder={this.CATranslate("text_name", this.props.locale)}
            errorRequired={<this.Translate id="error_require_name" />}
            max={100}
            isAutoFocus={true}
            form={this.props.form} />
      </this.Col>
      <this.Col md="12">
          <this.InputText
            name="label"
            data={formData.label}
            label={<this.Translate id="text_label" />}
            placeholder={this.CATranslate("text_label", this.props.locale)}
            form={this.props.form} />
      </this.Col>
      <this.Col md="12">
          <this.InputText
            name="description"
            data={formData.description}
            label={<this.Translate id="text_description" />}
            placeholder={this.CATranslate("text_description", this.props.locale)}
            form={this.props.form} />
      </this.Col>
      <this.Col md="12">
        <this.Select 
          name="isFeature"
          label={<this.Translate id="text_feature_category" />}
          placeholder={`${this.CATranslate("text_feature_category", this.props.locale)}`}
          defaultValue={formData.isFeature}
          valueKey="value"
          dataSource={[
            {value: false, name: "No"},
            {value: true, name: "Yes"}
          ]}
          form={this.props.form} />
      </this.Col>
      <this.Col md="12">
        <this.UploadImg
          name="image" 
          label={<this.Translate id="text_image" />}
          data={{file: image}}
          fileList={[image]}
          endPoint={`${this.Util.getAPIURL()}/file/v1/upload/category`}
          endPointDelete={`${this.Util.getAPIURL()}/file/v1/category/delete`}
          accessToken={this.Util.getAccessToken()}
          form={this.props.form} />
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