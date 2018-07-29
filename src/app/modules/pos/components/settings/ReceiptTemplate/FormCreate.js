import React from "react";
import Modal from "../../shares/Modal";
import { InputText } from "../../../../common/elements/ant-ui/InputText";
import { InputNumber } from "../../../../common/elements/ant-ui/InputNumber";
import ReceiptAction from "../../../action/settings/receiptTemplate";

export default class FormStoreLocationCreate extends Modal {
  constructor(props) {
    super(props);
    this.title = "Receipt Template";
    this.addingPropReducer = "receiptAdd";
    this.dispatch = this.props.dispatch;
  }
    
  handleSubmit() {
    const { receiptFormAdd } = this.props;
    this.dispatch(ReceiptAction.add(receiptFormAdd.values));
  }
    
  handleCancel() {
    this.dispatch(ReceiptAction.reset());
  }
  
  render() {
    const { receiptAdd } = this.props;
    if (receiptAdd.showForm) {
      this.content = (
        <div>
          { receiptAdd.error != null ? <this.Alert message={this.requiredMessage} type="error" /> : ""}
          <InputText name="name" label="Name" placeholder="Please input your name" required={true} max={100}/>
          <InputNumber type="number" name="code" placeholder="Code"  label="Code"/>
          <this.UploadImg name="upload" label="Receipt Logo" />
          <InputText type="text" name="address" placeholder="VAT"  label="Tax name on receipt"/>
        </div>
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}