import React from "react";
import Modal from "../../shares/Modal";
import { InputText } from "../../../../common/elements/ant-ui/InputText";
import { InputNumber } from "../../../../common/elements/ant-ui/InputNumber";
import StoreLocationAction from "../../../action/settings/storeLocation";

export default class FormStoreLocationCreate extends Modal {
  constructor(props) {
    super(props);
    this.title = "Store Location";
    this.addingPropReducer = "storeLocationAdd";
    this.dispatch = this.props.dispatch;
  }
  
  handleSubmit() {
    const { storeLocationFormAdd } = this.props;
    this.dispatch(StoreLocationAction.add(storeLocationFormAdd.values));
  }
    
  handleCancel() {
    this.dispatch(StoreLocationAction.reset());
  }
  
  render() {
    const { storeLocationAdd } = this.props;
    if (storeLocationAdd.showForm) {
      this.content = (
        <div>
          {storeLocationAdd.error != null ? <this.Alert message={this.requiredMessage} type="error" /> : ""}
          <InputText name="name" label="Name" placeholder="Please input your name" required={true} max={100}/>
          <InputNumber type="number" name="code" placeholder="Code"  label="Code"/>
          <InputText type="text" name="address" placeholder="Address"  label="Address"/>
        </div>
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}