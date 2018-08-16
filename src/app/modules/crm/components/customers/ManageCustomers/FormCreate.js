import React from "react";
import FormItem from "./FormItem";
import Modal from "../../shares/Modal";
import CustomerAction from "../../../actions/customers/manageCustomers";
import GroupCustomerAction from "../../../actions/customers/groupCustomer";
import CreateCustomerGroup from "../../../containers/customers/GroupCustomers/FormCreate";
import Constant from "../../../constants/customers/groupCustomer";

export default class FormCreate extends Modal {
  constructor(props) {
    super(props);
    this.title = "Management Customer";
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.addCustomerGroup = this.addCustomerGroup.bind(this);
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        
        const listContacts = 
          {
            name : values.cont_name,
            address: values.const_address,
            phoneNumber: values.const_phoneNumber
          };

        delete values["cont_name"];
        delete values["const_phoneNumber"];
        delete values["const_address"];

        const contacts = listContacts.name.map((name, index)=> {
          if (
            name != null &&
            listContacts.address[index] != null &&
            listContacts.phoneNumber[index] != null
          ) {
            return {
              name: name,
              address: listContacts.address[index],
              phoneNumber: listContacts.phoneNumber[index]
            };
          }

          
        });

        values["contacts"] = contacts;
        delete values["keys"]; 
        this.dispatch(CustomerAction.add(values));
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
    const {
      manageCustomersAdd,
      form,
      groupCustomers,
      groupCustomersAdd
    } = this.props;

    // APPEND GROUP CUSTOMER TO LIST
    if (groupCustomersAdd.response != null) {
      groupCustomers.list = [groupCustomersAdd.response.data, ...groupCustomers.list];
      this.props.dispatch({type: Constant.RESET_MANAGEMENT_GROUP_CUSTOMERS});
    }

    if (manageCustomersAdd.showForm) {
      this.content = (
        <FormItem
          form={form}
          dispatch={this.props.dispatch}
          groupCustomers={groupCustomers}
          addCustomerGroup={this.addCustomerGroup}
        />
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}
