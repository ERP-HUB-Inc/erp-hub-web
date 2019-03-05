import React from "react";
import FormItem from "./FormItem";
import LanguageAction from "../../../action/settings/storeLanguage";
import Constant from "../../../constants/settings/storeLanguage";
import Modal from "../../../../common/components/shares/Modal";
import Enum from "../../../enums";

export default class Form extends Modal {
  constructor(props) {
    super(props);
    this.title = <this.Translate id="text_language" />;
    this.languageCodes = [
      {name: "en", value: "en"},
      {name: "km", value: "km"},
      {name: "bm", value: "bm"},
    ];
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidUpdate() {
    if (this.props.storeLanguageAdd.error && this.Util.getErrorCodeFromState(this.props.storeLanguageAdd.error) === Enum.LANGUAGE_ALREADY_EXIST) {
      this.Message.error(this.CATranslate("language_exist", this.props.locale));
      this.props.dispatch(LanguageAction.reset(Constant.RESET_LANGUAGE_ADD));
    }
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.dispatch(LanguageAction.add(values));
      }
    });
  }
    
  handleCancel() {
    this.dispatch(LanguageAction.reset());
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