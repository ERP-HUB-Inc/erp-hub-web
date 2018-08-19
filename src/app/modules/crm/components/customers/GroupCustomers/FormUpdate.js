import React from "react";
import Modal from "../../shares/Modal";
import FormItem from "./FormItem";
import Constant from "../../../constants/customers/groupCustomer";
import GroupCustomerAction from "../../../actions/customers/groupCustomer";

export default class FormCreate extends Modal {
  constructor(props) {
    super(props);
    this.title = <this.Translate id="update_group_customer_title" />;
    this.addingPropReducer = "groupCustomersUpdate";
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.RESET_CONSTANT = Constant.RESET_PAYMENT_METHOD;
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values["id"] = this.props.groupCustomersUpdate.data.id;
        values["status"] = 1;
        this.dispatch(GroupCustomerAction.update(values));
        
      }
    });
  }
    
  handleCancel() {
    this.dispatch(GroupCustomerAction.reset());
  }

  render() {
    const {groupCustomersUpdate, form, locale} = this.props;

    if (groupCustomersUpdate.showForm) {
      this.content = (
        <div>
          {groupCustomersUpdate.error != null ? <this.Alert message={this.requiredMessage} type="error" /> : ""}
          <FormItem
            form={form}
            formData={groupCustomersUpdate.data}
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