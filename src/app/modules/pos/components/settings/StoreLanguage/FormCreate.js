import React from "react";
import FormItem from "./FormItem";
import StoreLanguageAction from "../../../action/settings/storeLanguage";
import Modal from "../../../../common/components/shares/Modal";

export default class Form extends Modal {
  constructor(props) {
    super(props);
    this.title = <this.Translate id="create_language_title" />;
    this.languageCodes = [
      {name: "en", value: "en"},
      {name: "km", value: "km"},
      {name: "bm", value: "bm"},
    ];
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.dispatch(StoreLanguageAction.add(values));
      }
    });
  }
    
  handleCancel() {
    this.dispatch(StoreLanguageAction.reset());
  }
  
  render() {
    this.submitLoading = this.props.storeLanguageAdd.adding;

    this.validatorAddRecord(this.props.storeLanguageAdd);

    if (this.props.storeLanguageAdd.showForm) {
      this.content = <FormItem form={this.props.form} locale={this.props.locale}/>;
      return super.render();
    } else {
      return <div/>;
    }
  }
}