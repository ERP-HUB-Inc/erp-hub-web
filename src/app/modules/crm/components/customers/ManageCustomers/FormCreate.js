import React from "react";
import FormItem from "./FormItem";
import Modal from "../../shares/Modal";
import CustomerAction from "../../../actions/customers/manageCustomers";
import GroupCustomerAction from "../../../actions/customers/groupCustomer";
import CreateCustomerGroup from "../../../containers/customers/GroupCustomers/FormCreate";
import ConstantGroupCustomer from "../../../constants/customers/groupCustomer";
import Constant from "../../../constants/customers/managementCutomers";

export default class FormCreate extends Modal {
  constructor(props) {
    super(props);
    this.title = <this.Translate id="create_management_customer_title" />;
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
          id: values.contactId,
          name : values.contactName,
          phoneNumber: values.contactNumber,
          address: values.contactAddress,
          status: values.status
        };

        delete values["contactId"];
        delete values["contactName"];
        delete values["contactNumber"];
        delete values["contactAddress"];
        delete values["keys"];
        delete values["status"];

        if(listContacts.name == null){
          listContacts.name = [];
        }

        const contacts = [];

        listContacts.name.forEach((name, index) => {
          if (
            name != null ||
            listContacts.address[index] != null ||
            listContacts.phoneNumber[index] != null
          ) {
            contacts.push({
              id: listContacts.id[index],
              name: name,
              address: listContacts.address[index],
              phoneNumber: listContacts.phoneNumber[index],
              status: listContacts.status[index]
            });
          }
        });

        if(contacts) {
          values["contacts"] = contacts;
        }

        this.dispatch(CustomerAction.add(values));
        
      }
    });
  }
      
  handleCancel() {
    this.dispatch(CustomerAction.reset(Constant.RESET_MANAGEMENT_CUSTOMERS));
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
      groupCustomersAdd,
      locale
    } = this.props;

    this.submitLoading = manageCustomersAdd.adding;

    // APPEND GROUP CUSTOMER TO LIST
    if (groupCustomersAdd.response != null) {
      groupCustomers.list = [groupCustomersAdd.response.data, ...groupCustomers.list];
      this.props.dispatch({type: ConstantGroupCustomer.RESET_MANAGEMENT_GROUP_CUSTOMERS});
    }

    if (manageCustomersAdd.showForm) {
      this.content = (
        <FormItem
          form={form}
          dispatch={this.props.dispatch}
          groupCustomers={groupCustomers}
          addCustomerGroup={this.addCustomerGroup}
          locale={locale}
        />
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}
