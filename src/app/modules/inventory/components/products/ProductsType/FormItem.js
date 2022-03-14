import React from "react";
import Modal from "../../../../common/components/shares/Modal";

export default class FormItem extends Modal {
  render() {
    return <this.Row>
      <this.Col md="12">
          <this.InputText
            name="name"
            data={this.props.formData["name"]}
            label={<this.Translate id="text_name" />}
            placeholder={this.CATranslate("text_name", this.props.locale)}
            errorRequired={<this.Translate id="error_require_name" />}
            max={100}
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