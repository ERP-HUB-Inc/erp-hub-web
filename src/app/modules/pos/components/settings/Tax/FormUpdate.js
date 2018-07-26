import React from "react";
import Modal from "../../shares/Modal";
import { InputText } from "../../../../common/elements/ant-ui/InputText";
import { InputNumber } from "../../../../common/elements/ant-ui/InputNumber";
import TaxMethodAction from "../../../action/settings/tax";

export default class Form extends Modal {
  constructor(props) {
    super(props);
    this.title = "Tax";
    this.addingPropReducer = "taxUpdate";
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
    const { taxUpdate } = this.props;
    if (taxUpdate.showForm) {
      this.content = (
        <div>
          {taxUpdate.error != null ? <this.Alert message={this.requiredMessage} type="error" /> : ""}
          <InputText data={ taxUpdate.data.name } name="name" label="Name" placeholder="Please input your name" required={true} max={100}/>
          <InputNumber data={ taxUpdate.data.rate } type="number" name="rate" label="Rate"/>
          <InputText data={ taxUpdate.data.labelOnInvoice } name="labelOnInvoice" label="Label On Invoice" placeholder="Description" max={255}/>
        </div>
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}