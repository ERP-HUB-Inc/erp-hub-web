import React from "react";
import Modal from "../../shares/Modal";
import InputText from "../../../../common/elements/ant-ui/InputText";
import Select from "../../../../common/elements/ant-ui/Select";
import PaymentMethodAction from "../../../action/settings/paymentMethod";

export default class Form extends Modal {
  constructor(props) {
    super(props);
    this.title = "Payment Method:Update";
    this.addingPropReducer = "paymentMethodUpdate";
    this.dispatch = this.props.dispatch;
  }
  handleSubmit() {
    const { formUpdate } = this.props;
    this.dispatch(PaymentMethodAction.update(formUpdate.values, formUpdate.values.id));
  }
    
  handleCancel() {
    this.dispatch(PaymentMethodAction.reset());
  }

  render() {
    const {paymentMethodUpdate} = this.props;
    
    // For Now we reset state in the list
    // if (paymentMethodUpdate.response != null) {
    //   this.dispatch(PaymentMethodAction.reset());
    // }

    if (paymentMethodUpdate.showForm) {
      this.content = (
        <div>
          {paymentMethodUpdate.error != null ? <this.Alert message={this.requiredMessage} type="error" /> : ""}
          <InputText data={paymentMethodUpdate.data.name} name="name" label="Name" placeholder="Please input your name" required={true} max={100}/>
          <InputText data={paymentMethodUpdate.data.description} name="description" label="Description" placeholder="Description" max={255}/>
          <Select name="status" label="Status" placeholder="Please select status" dataSource={this.statusDataSource} defaultValue={paymentMethodUpdate.data.status}/>
        </div>
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}