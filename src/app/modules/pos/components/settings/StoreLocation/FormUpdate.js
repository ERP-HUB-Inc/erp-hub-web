import React from "react";
import Modal from "../../shares/Modal";
import { InputText } from "../../../../common/elements/ant-ui/InputText";
import { InputNumber } from "../../../../common/elements/ant-ui/InputNumber";
import StoreLocationAction from "../../../action/settings/storeLocation";

export default class FormUpdate extends Modal {
  constructor(props) {
    super(props);
    this.title = "Store Location:Update";
    this.addingPropReducer = "storeLocationUpdate";
    this.dispatch = this.props.dispatch;
  }
  
  handleSubmit() {
    const { formUpdate } = this.props;
    alert(JSON.stringify(formUpdate.values));
    this.dispatch(StoreLocationAction.update(formUpdate.values));
  }
    
  handleCancel() {
    this.dispatch(StoreLocationAction.reset());
  }
  
  render() {
    const { storeLocationUpdate } = this.props;
    if (storeLocationUpdate.showForm) {
      this.content = (
        <div>
          {storeLocationUpdate.error != null ? <this.Alert message={this.requiredMessage} type="error" /> : ""}
          <InputText name="name" data={ storeLocationUpdate.data.name } label="Name" placeholder="Please input your name" required={true} max={100}/>
          <InputNumber type="number" data={ storeLocationUpdate.data.code } name="code" placeholder="Code"  label="Code"/>
          <InputText type="text" data={ storeLocationUpdate.data.address } name="address" placeholder="Address"  label="Address"/>
        </div>
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}