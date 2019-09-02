import React from "react";
import FormItem from "./FormItem";
import QuotationAction from "../../../action/transaction/quotation";
import Modal from "../../../../common/components/shares/Modal";

export default class Form extends Modal {
  constructor(props) {
    super(props);
    this.title = <this.Translate id="text_quotation" />;
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const {quotationUpdate} = this.props;
        values["id"] = quotationUpdate.data.id;
        values["value"] = Number(values.value);
        this.dispatch(QuotationAction.update(values));
      }
    });
  }
    
  handleCancel() {
    this.dispatch(QuotationAction.reset());
  }
  
  render() {
    const {quotationUpdate, customer , location, form, locale} = this.props;

    this.submitLoading = quotationUpdate.updating;

    this.validatorUpdateRecord(quotationUpdate);

    if (quotationUpdate.showForm) {
      this.content = (
        <FormItem 
          formData={quotationUpdate.data} 
          customer={customer}
          location={location} 
          form={form} 
          locale={locale}/>
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}