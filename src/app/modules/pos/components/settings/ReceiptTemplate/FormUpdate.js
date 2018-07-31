import React from "react";
import Modal from "../../shares/Modal";
import { InputText } from "../../../../common/elements/ant-ui/InputText";
import { InputNumber } from "../../../../common/elements/ant-ui/InputNumber";
import ReceiptAction from "../../../action/settings/receiptTemplate";

export default class FormReciptTemplateUpdate extends Modal {
  constructor(props) {
    super(props);
    this.title = "Receipt Template:Update";
    this.addingPropReducer = "receiptUpdate";
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  handleSubmit() {
    const { receiptFormAdd } = this.props;
    this.dispatch(ReceiptAction.update(receiptFormAdd.values));
  }
    
  handleCancel() {
    this.dispatch(ReceiptAction.reset());
  }
  
  render() {
    const { receiptUpdate,form } = this.props;
    if (receiptUpdate.showForm) {
      this.content = (
        <div>
          { receiptUpdate.error != null ? <this.Alert message={this.requiredMessage} type="error" /> : ""}
          <InputText
            name="name"
            label="Name"
            placeholder="Please input your name"
            required={true}
            errorRequired="Please input your name"
            max={100}
            form={form}/>
          <InputNumber 
            type="number" 
            name="code" 
            placeholder="Code"  
            label="Code" 
            form={form} />
          <this.UploadImg 
            name="upload" 
            label="Receipt Logo" 
            form={form} 
          />   
        </div>
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}