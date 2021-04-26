import React from "react";
import FormItem from "./FormItem";
import TaxAction from "../../../action/settings/tax";
import Modal from "../../../../common/components/shares/Modal";

export default class Form extends Modal {
  constructor(props) {
    super(props);
    this.title = <this.Translate id="create_tax_title" />;
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values["rate"] = Number(values.rate);
        this.dispatch(TaxAction.add(values));
      }
    });
  }
    
  handleCancel() {
    this.dispatch(TaxAction.reset());
  }
  
  render() {
    this.submitLoading = this.props.taxAdd.adding;

    this.validatorAddRecord(this.props.taxAdd);
    
    if (this.props.taxAdd.showForm) {
      this.content = <FormItem form={this.props.form} locale={this.props.locale} />;
      return super.render();
    } else {
      return <div />;
    }
  }
}