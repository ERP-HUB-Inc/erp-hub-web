import React from "react";
import FormItem from "./FormItem";
import Modal from "../../shares/Modal";
import CustomerAction from "../../../actions/customers/manageCustomers";

export default class FormCreate extends Modal {
  constructor(props) {
    super(props);
    this.title = "Management Customer:update";
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.addCustomerGroup = this.addCustomerGroup.bind(this);
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {

        // this.dispatch(CustomerAction.update(values));
      }
    });
  }
      
  handleCancel() {
    this.dispatch(CustomerAction.reset());
  }

  addCustomerGroup(){
    const {dispatch} = this.props;
    dispatch(GroupCustomerAction.showForm());
    this.modal1 = <CreateCustomerGroup/>;
  }

  render() {
    const {manageCustomersUpdate, form, groupCustomers,locale} = this.props;
     
    if (manageCustomersUpdate.showForm) {
      this.content = (
        <FormItem
          form={form}
          locale={locale}
        />
      );
      return super.render();
    } else {
      return <div/>;
    }
  }
}
