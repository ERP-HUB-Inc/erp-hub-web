import React from "react";
import Modal from "../../shares/Modal";
import { InputText } from "../../../../common/elements/ant-ui/InputText";
import { Select } from "../../../../common/elements/ant-ui/Select";
import PaymentMethodAction from "../../../action/settings/paymentMethod";

export default class FormCreate extends Modal {
  constructor(props) {
    super(props);
    this.title = "Payment Method";
    this.addingPropReducer = "paymentMethodAdd";
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.dispatch(PaymentMethodAction.add(values));
      }
    });
  }
    
  handleCancel() {
    this.dispatch(PaymentMethodAction.reset());
  }

  render() {
    const {paymentMethodAdd, form} = this.props;

    if (paymentMethodAdd.showForm) {
      this.content = (
        <div>
          {paymentMethodAdd.error != null ? <this.Alert message={this.requiredMessage} type="error" /> : ""}
          <InputText
            name="name"
            label="Name"
            placeholder="Please input your name"
            required={true}
            errorRequired="Please input your name"
            max={100}
            form={form}/>
          <InputText
            type="number"
            name="description"
            label="Description"
            placeholder="Description"
            max={255}
            form={form}/>
          <Select
            name="status"
            label="Status"
            placeholder="Please select status"
            dataSource={this.statusDataSource}
            defaultValue={1}
            form={form}/>
        </div>
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}