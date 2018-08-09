import React from "react";
import Modal from "../../shares/Modal";
import ReceiptAction from "../../../action/settings/receiptTemplate";

function checkValue(values){
  return values == true ? 1 : 0;
}

export default class FormReciptTemplateUpdate extends Modal {
  constructor(props) {
    super(props);
    this.title = "Receipt Template:Update";
    this.addingPropReducer = "receiptUpdate";
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values["id"] = this.props.receiptUpdate.data.id;
        values["isDefault"] = checkValue(values.isDefault);
        values["isShowStoreName"] = checkValue(values.isShowStoreName);
        values["isShowCustomerInfo"] = checkValue(values.isShowCustomerInfo);
        values["isShowDevelopBy"] = checkValue(values.isShowDevelopBy);
        values["status"] = 1;
        // alert(JSON.stringify(values));
        this.dispatch(ReceiptAction.update(values));
      }
    });
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
          <this.InputText
            name="name"
            label="Name"
            placeholder="Please input your name"
            required={true}
            errorRequired="Please input your name"
            max={100}
            data={ receiptUpdate.data.name }
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
            data={ receiptUpdate.data.tax }
            label="Tax name on receipt"
            placeholder="Tax name on receipt"
            form={ form }
          /> */}
          <thisInputNumber 
            type="number" 
            name="code" 
            data={ receiptUpdate.data.code }
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
            checked={ receiptUpdate.data.isDefault }
            form={form}
          />
          <this.Switchs
            label="Show Store Name"
            checked={ receiptUpdate.data.isShowStoreName }
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
            checked={ receiptUpdate.data.isShowCustomerInfo }
            form={form}
          />
          <this.Switchs
            label="Show Develop By"
            name="isShowDevelopBy"
            checked={ receiptUpdate.data.isShowDevelopBy }
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