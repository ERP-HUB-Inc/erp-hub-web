import React from "react";
import FormItem from "./FormItem";
import CustomerAction from "../../../actions/customers/customer";
import GroupCustomerAction from "../../../actions/customers/group";
import CreateCustomerGroup from "../../../containers/customers/Group/FormCreate";
import Constant from "../../../constants/customers/customer";
import Modal from "../../../../common/components/shares/Modal";

export default class FormCreate extends Modal {
  constructor(props) {
    super(props);
    this.state = {
      contact: []
    };
    this.title = <this.Translate id="update_management_customer_title" />;
    this.wrapClassName = "modal-fix-footer wrap-customer";
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAddCustomerGroup = this.handleAddCustomerGroup.bind(this);
    this.getContactListCallBack = this.getContactListCallBack.bind(this);
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values["id"] = this.props.customerDetail.data.id;
        values["listContact"] = this.state.contact;
        this.dispatch(CustomerAction.update(values));
      }
    });
  }

  getContactListCallBack(contactList) {
    this.setState({contact: contactList});
  }
      
  handleCancel() {
    this.dispatch(CustomerAction.reset(Constant.RESET_DETAIL_CUSTOMERS));
  }

  handleAddCustomerGroup(){
    const {dispatch} = this.props;
    dispatch(GroupCustomerAction.showForm());
    this.modal1 = <CreateCustomerGroup/>;
  }

  render() {
    this.submitLoading = this.props.customerUpdate.updating;
    
    if (this.props.customerDetail.showForm && this.props.customerDetail.fetched) {
      this.content = (
        <FormItem
          form={this.props.form}
          dispatch={this.props.dispatch}
          formData={this.props.customerDetail.data}
          groupCustomers={this.props.groupCustomers}
          addCustomerGroup={this.addCustomerGroup}
          groupCustomersAdd={this.props.groupCustomersAdd}
          handleAddCustomerGroup={this.handleAddCustomerGroup}
          callBack={this.getContactListCallBack}
          locale={this.props.locale}/>
      );
      return super.render();
    } else {
      return <div/>;
    }
  }
}
