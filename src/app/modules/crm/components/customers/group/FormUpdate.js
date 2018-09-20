import React from "react";
import FormItem from "./FormItem";
import Constant from "../../../constants/customers/groupCustomer";
import GroupCustomerAction from "../../../actions/customers/group";
import Modal from "../../../../common/components/shares/Modal";

export default class FormCreate extends Modal {
  constructor(props) {
    super(props);
    this.title = <this.Translate id="update_group_customer_title" />;
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.RESET_CONSTANT = Constant.RESET_PAYMENT_METHOD;
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values["id"] = this.props.groupCustomersUpdate.data.id;
        this.dispatch(GroupCustomerAction.update(values));
        
      }
    });
  }
    
  handleCancel() {
    this.dispatch(GroupCustomerAction.reset());
  }

  render() {
    const {groupCustomersUpdate, form, locale} = this.props;

    this.submitLoading = groupCustomersUpdate.updating;

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