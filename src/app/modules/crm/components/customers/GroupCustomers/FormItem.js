import React from "react";
import Component from "../../Component";
import Modal from "../../shares/Modal";
import GroupCustomerAction from "../../../actions/customers/groupCustomer";
import "./index.css";

export default class FormItem extends Modal {
  constructor(props) {
    super(props);
  }

  render() {
    const {formData, form, locale} = this.props;
    return (
      <div>
        <this.InputText
          name="name"
          label={<this.Translate id="input_group_customer_name" />}
          data={formData.name}
          placeholder={this.CATranslate("input_group_customer_name",locale)}
          required={true}
          errorRequired={<this.Translate id="input_error_group_customer_name" />}
          max={100}
          form={form}/>
      </div>
    );
  }
}

FormItem.defaultProps = {
  formData: {
    name: "",
    status: 1
  }
};