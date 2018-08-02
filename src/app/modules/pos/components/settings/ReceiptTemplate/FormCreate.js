import React from "react";
import Modal from "../../shares/Modal";
import ReceiptAction from "../../../action/settings/receiptTemplate";

export default class FormReciptTemplateCreate extends Modal {
  constructor(props) {
    super(props);
    this.title = "Receipt Template";
    this.addingPropReducer = "receiptAdd";
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
  }
    
  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        alert(JSON.stringify(values));
        this.dispatch(ReceiptAction.add(values));
      }
    });
  }
    
  handleCancel() {
    this.dispatch(ReceiptAction.reset());
  }
  
  render() {
    const { receiptAdd,form } = this.props;
    if (receiptAdd.showForm) {
      this.content = (
        <div>
          { receiptAdd.error != null ? <this.Alert message={this.requiredMessage} type="error" /> : ""}
          <this.InputText
            name="name"
            label="Name"
            placeholder="Please input your name"
            required={true}
            errorRequired="Please input your name"
            max={100}
            form={form}/>
          <thisInputNumber 
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
          <this.Select
            name="status"
            label="Status"
            placeholder="Please select status"
            dataSource={this.statusDataSource}
            defaultValue={1}
            form={form}/>
        </div>
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}