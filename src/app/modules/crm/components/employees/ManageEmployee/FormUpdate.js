import React from "react";
import { Modal } from "../../shares/Modal/modal";
import { InputText } from "../../../../common/elements/ant-ui/InputText";
import { Select } from "../../../../common/elements/ant-ui/Select";
import PaymentMethodAction from "../../../actions/employees/manageEmployee";

export default class Form extends Modal {
  constructor(props) {
    super(props);
    this.title = "Payment Method:Update";
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const {paymentMethodUpdate} = this.props;
        values["id"] = paymentMethodUpdate.data.id;
        this.dispatch(PaymentMethodAction.update(values));
      }
    });
  }
    
  handleCancel() {
    this.dispatch(PaymentMethodAction.reset());
  }

  render() {
    const {paymentMethodUpdate, form} = this.props;

    if (paymentMethodUpdate.showForm) {
      this.content = (
        <div>
          {paymentMethodUpdate.error != null ? <this.Alert message={this.requiredMessage} type="error" /> : ""}
          <InputText
            data={paymentMethodUpdate.data.name}
            name="name"
            label="Name"
            placeholder="Please input your name"
            required={true}
            max={100}
            form={form}/>
          <InputText
            data={paymentMethodUpdate.data.description}
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
            defaultValue={paymentMethodUpdate.data.status}
            form={form}/>
        </div>
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}