import React from "react";
import FormItem from "./FormItem";
import Modal from "../../shares/Modal";
import CustomerAction from "../../../actions/customers/manageCustomers";
import GroupCustomerAction from "../../../actions/customers/groupCustomer";
import CreateCustomerGroup from "../../../containers/customers/GroupCustomers/FormCreate";

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
          name : values.cont_name,
          address: values.const_address,
          phoneNumber: values.const_phoneNumber,
          id: values.cont_id
        };

        delete values["cont_name"];
        delete values["cont_id"];
        delete values["const_phoneNumber"];
        delete values["const_address"];
        delete values["keys"];
          
        let id = this.props.manageCustomersUpdate.data.id;
        if(id !== null){
          values["id"] = this.props.manageCustomersUpdate.data.id;
        }
       
        if(listContacts.name == null){
          listContacts.name = [];
        }

        const contacts = listContacts.name.map((name, index)=> {
          if (
            name != null &&
            listContacts.address[index] != null &&
            listContacts.phoneNumber[index] != null
          ) {
            return {
              name: name,
              id: listContacts.id[index],
              address: listContacts.address[index],
              phoneNumber: listContacts.phoneNumber[index]
            };
          }
        });

        if(contacts !=="") {
          values["listContact"] = contacts;
        }

        values["status"] = this.Enum.ACTIVE;
        this.dispatch(CustomerAction.update(values));
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

    this.submitLoading = manageCustomersUpdate.updating;
    
    if (manageCustomersUpdate.showForm) {
      this.content = (
        <FormItem
          form={form}
          dispatch={this.props.dispatch}
          formData={manageCustomersUpdate.data}
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
