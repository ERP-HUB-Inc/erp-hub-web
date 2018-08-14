import React from "react";
import FormItem from "./FormItem";
import Modal from "../../shares/Modal";
import StoreLanguageAction from "../../../action/settings/storeLanguage";

export default class Form extends Modal {
  constructor(props) {
    super(props);
    this.title = <this.Translate id="update_language_title" />;
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const {languageUpdate} = this.props;
        values["id"] = languageUpdate.data.id;
        this.dispatch(StoreLanguageAction.update(values));
      }
    });
  }
    
  handleCancel() {
    this.dispatch(StoreLanguageAction.reset());
  }
  
  render() {
    const {languageUpdate, form, locale} = this.props;

    this.submitLoading = languageUpdate.updating;

    this.validatorUpdateRecord(languageUpdate);

    if (languageUpdate.showForm) {
      this.content = (
        <FormItem formData={languageUpdate.data} form={form} locale={locale} />
      );
      return super.render();
    } else {
      return <div />;
    }
  }
}