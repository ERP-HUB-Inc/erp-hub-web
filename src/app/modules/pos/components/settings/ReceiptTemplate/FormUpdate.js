import React from "react";
import Modal from "../../shares/Modal";
import { InputText } from "../../../../common/elements/ant-ui/InputText";
import { InputNumber } from "../../../../common/elements/ant-ui/InputNumber";
import ReceiptAction from "../../../action/settings/receiptTemplate";

export default class FormStoreLocationCreate extends Modal {
  constructor(props) {
    super(props);
    this.title = "Receipt Template:Update";
    this.addingPropReducer = "receiptUpdate";
    this.dispatch = this.props.dispatch;
  }
  
  handleSubmit() {
    const { receiptFormAdd } = this.props;
    this.dispatch(ReceiptAction.update(receiptFormAdd.values));
  }
    
  handleCancel() {
    this.dispatch(ReceiptAction.reset());
  }
  
  render() {
    const { receiptUpdate } = this.props;
    if (receiptUpdate.showForm) {
      this.content = (
        <div>
          { receiptUpdate.error != null ? <this.Alert message={this.requiredMessage} type="error" /> : ""}
          <InputText name="name" data={ receiptUpdate.data.name } label="Name" placeholder="Please input your name" required={true} max={100}/>
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