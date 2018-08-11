import React from "react";
import Modal from "../../shares/Modal";
import CustomerAction from "../../../actions/customers/manageCustomers";

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
        const {manageCustomersUpdate} = this.props;
        values["id"] = manageCustomersUpdate.data.id;
        this.dispatch(CustomerAction.update(values));
      }
    });
  }
    
  handleCancel() {
    this.dispatch(CustomerAction.reset());
  }

  render() {
    const {manageCustomersUpdate, form} = this.props;

    if (manageCustomersUpdate.showForm) {
      this.content = (
        <div>
          {manageCustomersUpdate.error != null ? <this.Alert message={this.requiredMessage} type="error" /> : ""}
          <this.InputText
            data={manageCustomersUpdate.data.name}
            name="name"
            label="Name"
            placeholder="Please input your name"
            required={true}
            max={100}
            form={form}/>
          <this.InputText
            data={manageCustomersUpdate.data.description}
            name="description"
            label="Description"
            placeholder="Description"
            max={255}
            form={form}/>
          <this.Select
            name="status"
            label="Status"
            placeholder="Please select status"
            dataSource={this.statusDataSource}
            defaultValue={manageCustomersUpdate.data.status}
            form={form}/>
        </div>
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}