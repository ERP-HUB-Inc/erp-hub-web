import React from "react";
import Modal from "../../shares/Modal";
import { InputText } from "../../../../common/elements/ant-ui/InputText";
import { InputNumber } from "../../../../common/elements/ant-ui/InputNumber";
import { Select } from "../../../../common/elements/ant-ui/Select";
import TaxMethodAction from "../../../action/settings/tax";

export default class Form extends Modal {
  constructor(props) {
    super(props);
    this.title = "Payment Method";
    this.addingPropReducer = "paymentMethodAdd";
    this.dispatch = this.props.dispatch;
  }
  handleSubmit() {
    const { formAdd } = this.props;
    alert(JSON.stringify(formAdd.values));
    this.dispatch(TaxMethodAction.add(formAdd.values));
  }
    
  handleCancel() {
    this.dispatch(TaxMethodAction.reset());
  }

  render() {

    const {paymentMethodAdd} = this.props;

    if (paymentMethodAdd.showForm) {
      this.content = (
        <div>
          {paymentMethodAdd.error != null ? <this.Alert message={this.requiredMessage} type="error" /> : ""}
          <InputText name="name" label="Name" placeholder="Please input your name" required={true} max={100}/>
          <InputNumber name="rate" defaultValue={1} label="Rate"/>
          <InputText name="labelOnInvoice" label="Label On Invoice" placeholder="Description" max={255}/>
        </div>
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}