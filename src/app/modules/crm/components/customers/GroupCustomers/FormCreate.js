import React from "react";
import Modal from "../../shares/Modal";
import GroupCustomerAction from "../../../actions/customers/groupCustomer";

export default class FormCreate extends Modal {
  constructor(props) {
    super(props);
    this.title = "Group Customer";
    this.addingPropReducer = "groupCustomersAdd";
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.dispatch(GroupCustomerAction.add(values));
        
      }
    });
  }
    
  handleCancel() {
    this.dispatch(GroupCustomerAction.reset());
  }

  render() {
    const {groupCustomersAdd, form} = this.props;

    if (groupCustomersAdd.showForm) {
      this.content = (
        <div>
          {groupCustomersAdd.error != null ? <this.Alert message={this.requiredMessage} type="error" /> : ""}
          <this.InputText
            name="name"
            label="Name"
            placeholder="Please input your name"
            required={true}
            errorRequired="Please input your name"
            max={100}
            form={form}/>
        </div>
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}