import React from "react";
import FormContact from "./FormContact";
import GroupCustomerAction from "../../../actions/customers/group";
import Modal from "../../../../common/components/shares/Modal";
import "./index.css";

export default class FormItem extends Modal {
  constructor(props) {
    super(props);
    this.state = {
      removeContactKeys: [],
      contactList: []
    };
    this.contactIndex = 0;
    this.add = this.add.bind(this);
    this.remove = this.remove.bind(this);
    this.handleOnChangContactField = this.handleOnChangContactField.bind(this);
  }
  componentDidMount() {
    const {dispatch} = this.props;
    this.setState({contactList: this.props.formData.contacts});
    this.props.callBack(this.props.formData.contacts);
    dispatch(GroupCustomerAction.fetch());
  }

  componentDidUpdate() {
    if (this.props.groupCustomersAdd.added) {
      this.props.form.setFieldsValue({groupCustomerId: this.props.groupCustomersAdd.response.data.id});
      this.props.dispatch(GroupCustomerAction.reset());
    }
  }

  handleOnChangContactField(event, contactIndex, field = "name") {
    const existingContactList = this.state.contactList;
    existingContactList[contactIndex][field] = event.target.value;
    this.setState({contactList: existingContactList});
    this.props.callBack(existingContactList);
  }

  appendContact() {

  }

  add(){
    const existingContactList = this.state.contactList;
    existingContactList.push({
      id: "",
      name: "",
      phoneNumber: "",
      address: "",
      status: this.Enum.ACTIVE
    });
    
    this.setState({
      contactList: existingContactList
    });
    this.props.callBack(existingContactList);
  }

  remove(contact, contactIndex){
    let existingContactList = this.state.contactList;
    if (contact.id === "") {
      existingContactList = existingContactList.filter((value, index) => index !== contactIndex);
    } else {
      existingContactList[contactIndex]["status"] = this.Enum.ARCHIVE;
    }
    this.setState({contactList: existingContactList});
    this.props.callBack(existingContactList);
  }
  
  render() {
    const {
      formData,
      groupCustomers,
    } = this.props;

    // APPEND GROUP CUSTOMER TO LIST
    if (this.props.groupCustomersAdd.response != null) {
      groupCustomers.list = [this.props.groupCustomersAdd.response.data, ...groupCustomers.list];
    }

    return (
      <this.Tabs type="card">
        <this.TabPane tab="General" key="1">
          <this.Row>
            <this.Col md="6">
              <this.InputText
                name="firstName"
                label={<this.Translate id="input_management_customer_first_name" />}
                data={formData.firstName}
                placeholder={this.CATranslate("input_management_customer_first_name",this.props.locale)}
                required={true}
                isAutoFocus={true}
                errorRequired={<this.Translate id="input_error_management_customer_first_name_length" />}
                max={100}
                form={this.props.form}/>
            </this.Col>

            <this.Col md="6">
              <this.InputText
                name="lastName"
                label={<this.Translate id="input_management_customer_last_name" />}
                data={formData.lastName}
                placeholder={this.CATranslate("input_management_customer_last_name", this.props.locale)}
                required={true}
                errorRequired={<this.Translate id="input_management_customer_last_name_length" />}
                max={100}
                form={this.props.form}/>
            </this.Col>   

            <this.Col md="12">
              <this.InputText
                name="phoneNumber"
                label={<this.Translate id="input_management_customer_phone_number" />}
                data={formData.phoneNumber}
                placeholder={this.CATranslate("input_management_customer_phone_number", this.props.locale)}
                max={100}
                form={this.props.form}/>
            </this.Col>

            <this.Col md="12">
              <this.SelectSearch
                name="groupCustomerId"
                label={<this.Translate id="input_management_customer_customer_group" />}
                placeholder={this.CATranslate("select_customer_place_holder_group", this.props.locale)}
                defaultValue={formData.groupCustomerId}
                dataSource={groupCustomers.list}
                valueKey="id"
                addNew={this.props.handleAddCustomerGroup}
                form={this.props.form}/>
            </this.Col>  

            <this.Col md="12">
              <this.InputText   
                name="company"
                label={<this.Translate id="text_company" />}
                data={formData.company}
                placeholder={this.CATranslate("text_company", this.props.locale)}
                max={100}
                form={this.props.form}/>
            </this.Col>  

            <this.Col md="12">
              <this.InputText   
                name="email"
                label={<this.Translate id="input_management_customer_email" />}
                data={formData.email}
                placeholder={this.CATranslate("input_management_customer_email", this.props.locale)}
                max={100}
                form={this.props.form}/>
            </this.Col>  

            <this.Col md="12">
              <this.InputTextArea
                name="description"
                label={<this.Translate id="text_description" />}
                data={formData.description}
                placeholder={this.CATranslate("text_description", this.props.locale)}
                max={100}
                form={this.props.form}/>
            </this.Col>  

            <this.Col md="12">
              <this.InputTextArea
                name="address"
                label={<this.Translate id="text_address" />}
                data={formData.address}
                placeholder={this.CATranslate("text_address", this.props.locale)}
                max={100}
                form={this.props.form}/>
            </this.Col> 
              
            <this.Col md="12">
              <this.Select
                name="status"
                label={<this.Translate id="text_status" />}
                dataSource={this.statusDataSource}
                defaultValue={formData.status}
                form={this.props.form}/>
            </this.Col> 

          </this.Row>
        </this.TabPane>

        {/* =======================CONTACT CUSTOMER============== */}
        <this.TabPane tab="Contact" key="2">
              
          {
            this.state.contactList.map((contact, index) =>
              contact.isSystem === this.Enum.IS_SYSTEM ?
                ""
                :
                <FormContact
                  key={index}
                  index={index}
                  contact={contact}
                  handleOnChangContactField={this.handleOnChangContactField}
                  form={this.props.form}
                  locale={this.props.locale}
                  remove={() => this.remove(contact, index)}
                />
            )
          } 
          <div className="btn-addcontact">
            <this.Button onClick={this.add} style={{ width: "60%" }}>
              <span className="icon-add"></span> <span><this.Translate id="text_add" /></span>
            </this.Button>
          </div>
        </this.TabPane>
      </this.Tabs>
    );
  }
}

FormItem.defaultProps = {
  formData: {
    id: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    company: "",
    email: "",
    description: "",
    address: "",
    contacts: [],
    status: 1
  }
};