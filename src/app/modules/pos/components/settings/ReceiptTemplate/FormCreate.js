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
        values["isDefault"] = this.Util.checkValueSwitch(values.isDefault);
        values["isShowStoreName"] = this.Util.checkValueSwitch(values.isShowStoreName);
        values["isShowCustomerInfo"] = this.Util.checkValueSwitch(values.isShowCustomerInfo);
        values["isShowDevelopBy"] = this.Util.checkValueSwitch(values.isShowDevelopBy);
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
            min={3}
            max={100}
            form={form}/>
          {/* <this.Select
            name="status"
            label="Receipt Type"
            placeholder="Please select status"
            dataSource={this.statusDataSource}
            defaultValue={1}
            form={form}/> */}
          {/* <this.InputText
            name="tax"
            type="text"
            label="Tax name on receipt"
            placeholder="Tax name on receipt"
            form={ form }
          /> */}
          <thisInputNumber 
            type="number" 
            name="code" 
            placeholder="Code"  
            label="Code" 
            form={form} />

          {/* <this.UploadImg 
            name="upload" 
            label="Receipt Logo" 
            required={ false }
            form={form} 
          />    */}
          
          <this.Switchs
            label="Defualt Template"
            name="isDefault"
            form={form}
          />
          <this.Switchs
            label="Show Store Name"
            name="isShowStoreName"
            form={form}
          />
          {/* <this.Switchs
            label="Show Barcode"
            form={form}
          /> */}
          <this.Switchs
            label="Show Customer Information"
            name="isShowCustomerInfo"
            form={form}
          />
          <this.Switchs
            label="Show Develop By"
            name="isShowDevelopBy"
            form={form}
          />
          {/* <this.Select
            name="status"
            label="Status"
            placeholder="Please select status"
            dataSource={this.statusDataSource}
            defaultValue={1}
            form={form}/> */}
        </div>
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}