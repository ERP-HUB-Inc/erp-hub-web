import React from "react";
import FormItem from "./FormItem";
import ReceiptAction from "../../../action/settings/receiptTemplate";
import Modal from "../../../../common/components/shares/Modal";

export default class FormReciptTemplateCreate extends Modal {
  constructor(props) {
    super(props);
    this.title = <this.Translate id="text_receipt_template"/>;
    this.wrapClassName = "modal-fix-footer";
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
  }
    
  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values["isDefault"] = this.Util.checkValueSwitch(values.isDefault);
        values["isShowStoreName"] = this.Util.checkValueSwitch(values.isShowStoreName);
        values["isShowCustomerInfo"] = this.Util.checkValueSwitch(values.isShowCustomerInfo);
        values["isShowDevelopBy"] = this.Util.checkValueSwitch(values.isShowDevelopBy);
        values["isDefault"] = this.Util.checkValueSwitch(values.isDefault);
        values["logo"] = this.getImageFromUpload(values, "logo");
        this.dispatch(ReceiptAction.add(values));
      }
    });
  }
    
  handleCancel() {
    this.dispatch(ReceiptAction.reset());
  }
  
  render() {
    const {receiptAdd, form, locale} = this.props;

    this.submitLoading = receiptAdd.adding;

    this.validatorAddRecord(receiptAdd);
    
    if (receiptAdd.showForm) {
      this.content = (
        <FormItem form={form} locale={locale}/>
      );
      return super.render();
    } else {
      return <div />;
    }
  }
}