import React from "react";
import Modal from "../../shares/Modal";
import { InputText } from "../../../../common/elements/ant-ui/InputText";
import { InputNumber } from "../../../../common/elements/ant-ui/InputNumber";
import TaxMethodAction from "../../../action/settings/tax";

export default class Form extends Modal {
  constructor(props) {
    super(props);
    this.title = "Language";
    this.addingPropReducer = "languageUpdate";
    this.dispatch = this.props.dispatch;
  }

  handleSubmit() {
    const { formUpdate } = this.props;
    this.dispatch(TaxMethodAction.update(formUpdate.values));
  }
    
  handleCancel() {
    this.dispatch(TaxMethodAction.reset());
  }
  
  render() {
    const { languageUpdate } = this.props;
    if (languageUpdate.showForm) {
      this.content = (
        <div>
          {languageUpdate.error != null ? <this.Alert message={this.requiredMessage} type="error" /> : ""}
          <InputText  name="name" label="Name" placeholder="Please input your name" required={true} max={100}/>
          <InputNumber type="number" name="rate" label="Rate"/>
          <InputText name="labelOnInvoice" label="Label On Invoice" placeholder="Description" max={255}/>
        </div>
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}