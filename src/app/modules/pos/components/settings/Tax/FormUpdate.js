import React from "react";
import FormItem from "./FormItem";
import Modal from "../../shares/Modal";
import TaxAction from "../../../action/settings/tax";

export default class Form extends Modal {
  constructor(props) {
    super(props);
    this.title = <this.Translate id="update_tax_title" />;
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const {taxUpdate} = this.props;
        values["id"] = taxUpdate.data.id; 
        values["rate"] = Number(values.rate);
        this.dispatch(TaxAction.update(values));
      }
    });
  }
    
  handleCancel() {
    this.dispatch(TaxAction.reset());
  }
  
  render() {
    const {taxUpdate, form, locale} = this.props;

    this.submitLoading = taxUpdate.updating;

    this.validatorUpdateRecord(taxUpdate);
    
    if (taxUpdate.showForm) {
      this.content = (
        <FormItem formData={taxUpdate.data} form={form} locale={locale} />
      );
      return super.render();
    } else {
      return <div />;
    }
  }
}