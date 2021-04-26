import React from "react";
import LanguageAction from "../../../../pos/action/settings/storeLanguage";
import Modal from "../../../../common/components/shares/Modal";

export default class FormItem extends Modal {
  componentDidMount(){
    this.props.dispatch(LanguageAction.fetch(3));
  }

  render() {
    return <this.Row>
      {
      this.props.languages.map((language, index) =>
        <this.Col md="12" key={index}>
          <this.InputText
            name={`name${this.Util.getProductNameField(language.code)}`}
            data={this.props.formData[`name${this.Util.getProductNameField(language.code)}`]}
            label={<this.Translate id="text_name" />}
            placeholder={this.CATranslate("text_name", this.props.locale)}
            errorRequired={<this.Translate id="error_require_name" />}
            max={255}
            form={this.props.form}
            suffix={this.getLanguageIcon(language.code)} />
        </this.Col>
      )
      }
    </this.Row>;
  }
}

FormItem.defaultProps = {
  formData: {
    name:"",
    description:""
  }
};