import React from "react";
import FormItem from "./FormItem";
import CustomerAction from "../../../actions/customers/customer";
import GroupCustomerAction from "../../../actions/customers/group";
import CreateCustomerGroup from "../../../containers/customers/GroupCustomers/FormCreate";
import ConstantGroupCustomer from "../../../constants/customers/groupCustomer";
import Constant from "../../../constants/customers/managementCutomers";
import Modal from "../../../../common/components/shares/Modal";

export default class FormCreate extends Modal {
  constructor(props) {
    super(props);
    this.title = <this.Translate id="create_management_customer_title" />;
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAddCustomerGroup = this.handleAddCustomerGroup.bind(this);
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
  handleAddCustomerGroup(){
    const {dispatch} = this.props;
    dispatch(GroupCustomerAction.showForm());
    this.modal1 = <CreateCustomerGroup/>;
  }

  render() {
    const {
      manageCustomersAdd,
      groupCustomers,
      groupCustomersAdd
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
          form={this.props.form}
          locale={this.props.locale}
          dispatch={this.props.dispatch}
          groupCustomers={groupCustomers}
          groupCustomersAdd={groupCustomersAdd}
          handleAddCustomerGroup={this.handleAddCustomerGroup}/>
      );
      return super.render();
    } else {
      return <div/>;
    }
  }
}
