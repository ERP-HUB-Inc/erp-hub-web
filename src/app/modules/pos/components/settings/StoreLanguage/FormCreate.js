import React from "react";
import Modal from "../../shares/Modal";
import { InputText } from "../../../../common/elements/ant-ui/InputText";
import { InputNumber } from "../../../../common/elements/ant-ui/InputNumber";
import StoreLanguageAction from "../../../action/settings/storeLanguage";

export default class Form extends Modal {
  constructor(props) {
    super(props);
    this.title = "Store Language";
    this.addingPropReducer = "storeLanguageAdd";
    this.dispatch = this.props.dispatch;
  }
  handleSubmit() {
    const { storeLanguageFormAdd } = this.props;
    this.dispatch(StoreLanguageAction.add(storeLanguageFormAdd.values));
  }
    
  handleCancel() {
    this.dispatch(StoreLanguageAction.reset());
  }
  
  render() {
    const { storeLanguageAdd } = this.props;
    if (storeLanguageAdd.showForm) {
      this.content = (
        <div>
          {storeLanguageAdd.error != null ? <this.Alert message={this.requiredMessage} type="error" /> : ""}
          <InputText name="name" label="Name" placeholder="Please input your name" required={true} max={100}/>
          <InputText type="number" name="code" placeholder="Code"  label="Code"/>
        </div>
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}