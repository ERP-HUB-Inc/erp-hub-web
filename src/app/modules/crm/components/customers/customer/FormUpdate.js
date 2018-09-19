import React from "react";
import FormItem from "./FormItem";
import Modal from "../../shares/Modal";
import CustomerAction from "../../../actions/customers/customer";
import GroupCustomerAction from "../../../actions/customers/group";
import CreateCustomerGroup from "../../../containers/customers/GroupCustomers/FormCreate";
import Constant from "../../../constants/customers/managementCutomers";

export default class FormCreate extends Modal {
  constructor(props) {
    super(props);
    this.title = <this.Translate id="update_management_customer_title" />;
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
          
        let id = this.props.customerDetail.data.id;
        if(id !== null){
          values["id"] = this.props.customerDetail.data.id;
        }
       
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
              status: listContacts.status[index],
            });
          }
        });

        if(contacts) {
          values["listContact"] = contacts;
        }

        values["status"] = values["state"];
        
        this.dispatch(CustomerAction.update(values));
      }
    });
  }
      
  handleCancel() {
    this.dispatch(CustomerAction.reset(Constant.RESET_DETAIL_CUSTOMERS));
  }

  addCustomerGroup(){
    const {dispatch} = this.props;
    dispatch(GroupCustomerAction.showForm());
    this.modal1 = <CreateCustomerGroup/>;
  }

  render() {
    const {customerDetail, customerUpdate, form, groupCustomers, locale} = this.props;

    this.submitLoading = customerUpdate.updating;
    
    if (customerDetail.showForm && customerDetail.fetched) {
      this.content = (
        <FormItem
          form={form}
          dispatch={this.props.dispatch}
          formData={customerDetail.data}
          groupCustomers={groupCustomers}
          addCustomerGroup={this.addCustomerGroup}
          locale={locale}
        />
      );
      return super.render();
    } else {
      return <div/>;
    }
  }
}
