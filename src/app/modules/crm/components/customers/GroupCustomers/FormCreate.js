import React from "react";
import Modal from "../../shares/Modal";
import FormItem from "./FormItem";
import Constant from "../../../constants/customers/groupCustomer";
import GroupCustomerAction from "../../../actions/customers/groupCustomer";

export default class FormCreate extends Modal {
  constructor(props) {
    super(props);
    this.title = "Group Customer";
    this.addingPropReducer = "groupCustomersAdd";
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
    // this.RESET_CONSTANT = "";
    this.RESET_CONSTANT = Constant.RESET_PAYMENT_METHOD;
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
    const {groupCustomersAdd, form, locale} = this.props;

    if (groupCustomersAdd.showForm) {
      this.content = (
        <div>
          {groupCustomersAdd.error != null ? <this.Alert message={this.requiredMessage} type="error" /> : ""}
          <FormItem
            form={form}
            locale={locale}
          />
        </div>
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}