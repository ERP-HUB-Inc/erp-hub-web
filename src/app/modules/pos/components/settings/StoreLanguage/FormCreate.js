import React from "react";
import Modal from "../../shares/Modal";
import { InputText } from "../../../../common/elements/ant-ui/InputText";
import { InputNumber } from "../../../../common/elements/ant-ui/InputNumber";
import TaxMethodAction from "../../../action/settings/tax";

export default class Form extends Modal {
  constructor(props) {
    super(props);
    this.title = "Tax";
    this.addingPropReducer = "TaxAdd";
    this.dispatch = this.props.dispatch;
  }
  handleSubmit() {
    const { formAdd } = this.props;
    this.dispatch(TaxMethodAction.add(formAdd.values));
  }
    
  handleCancel() {
    this.dispatch(TaxMethodAction.reset());
  }
  
  render() {
    const { formLanguageAdd } = this.props;
    if (formLanguageAdd.showForm) {
      this.content = (
        <div>
          {formLanguageAdd.error != null ? <this.Alert message={this.requiredMessage} type="error" /> : ""}
          <InputText name="name" label="Name" placeholder="Please input your name" required={true} max={100}/>
          <InputNumber  type="number" name="rate" label="Rate"/>
          <InputText name="labelOnInvoice" label="Label On Invoice" placeholder="Description" max={255}/>
        </div>
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}