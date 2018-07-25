import React from "react";
import Modal from "../../shares/Modal";
import { InputText } from "../../../../common/elements/ant-ui/InputText";
import { Select } from "../../../../common/elements/ant-ui/Select";
import PaymentMethodAction from "../../../action/settings/paymentMethod";

export default class Form extends Modal {
  constructor(props) {
    super(props);
    this.title = "Payment Method";
    this.addingPropReducer = "paymentMethodAdd";
    this.dispatch = this.props.dispatch;
  }
  handleSubmit() {
    const { formAdd } = this.props;
    this.dispatch(PaymentMethodAction.add(formAdd.values));
  }
    
  handleCancel() {
    this.dispatch(PaymentMethodAction.reset());
  }

  render() {
    const {paymentMethodAdd} = this.props;
    
    // For Now we reset state in the list
    // if (paymentMethodAdd.response != null) {
    //   this.dispatch(PaymentMethodAction.reset());
    // }

    if (paymentMethodAdd.showForm) {
      this.content = (
        <div>
          {paymentMethodAdd.error != null ? <this.Alert message={this.requiredMessage} type="error" /> : ""}
          <InputText name="name" label="Name" placeholder="Please input your name" required={true} max={100}/>
          <InputText name="description" label="Description" placeholder="Description" max={255}/>
          <Select name="status" label="Status" placeholder="Please select status" dataSource={this.statusDataSource} defaultValue={1}/>
        </div>
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}