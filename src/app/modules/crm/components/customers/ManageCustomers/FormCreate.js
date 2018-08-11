import React from "react";
import Modal from "../../shares/Modal";
import ManagementEmployeeAction from "../../../actions/customers/manageCustomers";

export default class FormCreate extends Modal {
  constructor(props) {
    super(props);
    this.title = "Management Employee";
    this.addingPropReducer = "manageCustomersAdd";
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.dispatch(ManagementEmployeeAction.add(values));
      }
    });
  }
      
  handleCancel() {
    this.dispatch(ManagementEmployeeAction.reset());
  }

  render() {
    const {manageCustomersAdd, form} = this.props;

    if (manageCustomersAdd.showForm) {
      this.content = (
        <div>
          {manageCustomersAdd.error != null ? <this.Alert message={this.requiredMessage} type="error" /> : ""}
          <this.InputText
            name="name"
            label="Name"
            placeholder="Please input your name"
            required={true}
            errorRequired="Please input your name"
            max={100}
            form={form}/>
          <this.InputText
            type="number"
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