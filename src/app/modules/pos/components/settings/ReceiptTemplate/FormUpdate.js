import React from "react";
import FormItem from "./FormItem";
import ReceiptAction from "../../../action/settings/receiptTemplate";
import Modal from "../../../../common/components/shares/Modal";

export default class FormReciptTemplateUpdate extends Modal {
  constructor(props) {
    super(props);
    this.title = <this.Translate id="text_receipt_template"/>;
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values["id"] = this.props.receiptUpdate.data.id;
        values["logo"] = this.getImageFromUpload(values, "logo");
        this.dispatch(ReceiptAction.update(values));
      }
    });
  }
    
  handleCancel() {
    this.dispatch(ReceiptAction.reset());
  }
  
  render() {
    const {receiptUpdate, form, locale} = this.props;

    this.submitLoading = receiptUpdate.updating;

    this.validatorUpdateRecord(receiptUpdate);
    
    if (receiptUpdate.showForm) {
      this.content = (
        <FormItem formData={receiptUpdate.data} form={form} locale={locale}/>
      );
      return super.render();
    } else {
      return <div />;
    }
  }
}