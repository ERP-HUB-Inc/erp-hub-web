import React from "react";
import Component from "../../Component";
import Modal from "../../shares/Modal";
import GroupCustomerAction from "../../../actions/customers/groupCustomer";
import "./index.css";

export default class FormItem extends Modal {
  constructor(props) {
    super(props);
    this.languageCodes = [
      {name: "en", value: "en"},
      {name: "km", value: "km"},
      {name: "bm", value: "bm"},
    ];

    this.contactIndex = 0;

    this.add = this.add.bind(this);
    this.remove = this.remove.bind(this);

  }
  componentDidMount(){
    const {dispatch} = this.props;
    dispatch(GroupCustomerAction.fetch());
  }

  add(existContactIndex){
    this.contactIndex = existContactIndex; 
    const {form} = this.props;
    const keys = form.getFieldValue("keys");
    const nextContactKeys = keys.concat(this.contactIndex);  
    this.contactIndex++;
    form.setFieldsValue({
      keys: nextContactKeys
    });
  }

  remove(contactIndex){
    const {form} = this.props;
    const contactKeys = form.getFieldValue("keys");
    
    if (contactKeys.length === 0) {
      return;
    }

    form.setFieldsValue({
      keys: contactKeys.filter(key => key !== contactIndex)
    });
  }
  
  render() {
    const {
      formData,
      form,
      groupCustomers,
      locale
    } = this.props;

    const {
      getFieldDecorator,
      getFieldValue
    } = this.props.form;

    // APPEND GROUP CUSTOMER TO LIST
    if (groupCustomers.response != null) {
      // groupCustomers.list = [manageCustomersUpdate.response.data, ...groupCustomers.list];
      // this.props.dispatch({type: Constant.RESET_MANAGEMENT_GROUP_CUSTOMERS});
    }

    const customer = this.Util.renameObjectKey({ name: "name", id: "value" }, groupCustomers.list);

    getFieldDecorator("keys", {initialValue: this.props.formData.contacts});

    const keys = getFieldValue("keys");
    
    return (
      <div className="main-management-customer">
        <this.Tabs type="card">
          <this.TabPane tab="General" key="1">
            <this.Row>
              <this.Col md="6">
                <this.InputText
                  name="firstName"
                  label={<this.Translate id="input_management_customer_first_name" />}
                  data={formData.firstName}
                  // placeholder={this.CATranslate("input_management_customer_first_name", locale)}
                  required={true}
                  errorRequired="Please input your name"
                  max={100}
                  form={form}/>
              </this.Col>

              <this.Col md="6">
                <this.InputText
                  name="lastName"
                  label={<this.Translate id="input_management_customer_last_name" />}
                  data={formData.lastName}
                  // placeholder={this.CATranslate("input_management_customer_first_name", locale)}
                  required={true}
                  errorRequired="Please input your last Name"
                  max={100}
                  form={form}/>
              </this.Col>   

              <this.Col md="12">
                <this.InputText
                  name="phoneNumber"
                  label={<this.Translate id="input_management_customer_phone_number" />}
                  data={formData.phoneNumber}
                  placeholder="Phone number"
                  
                  max={100}
                  form={form}/>
              </this.Col>
                
              <this.Col md="12">
                <this.Select
                  name="groupCustomerId"
                  label={<this.Translate id="input_management_customer_customer_group" />}
                  placeholder="Please select customer"
                  defaultValue={formData.groupCustomer !=null ? formData.groupCustomer.id : ""  }
                  dataSource={customer}
                  showSearch={true}
                  addNew={this.props.addCustomerGroup}
                  form={form}/>
              </this.Col>  

              <this.Col md="12">
                <this.InputText   
                  name="company"
                  label={<this.Translate id="input_management_customer_company" />}
                  data={formData.company}
                  placeholder="Company"
                  max={100}
                  form={form}/>
              </this.Col>  

              <this.Col md="12">
                <this.InputText   
                  name="email"
                  label={<this.Translate id="input_management_customer_email" />}
                  data={formData.email}
                  placeholder="Email address"
                  max={100}
                  form={form}/>
              </this.Col>  

              <this.Col md="12">
                <this.InputTextArea
                  name="description"
                  label={<this.Translate id="input_management_customer_description" />}
                  data={formData.description}
                  placeholder="Description"
                  max={100}
                  form={form}/>
              </this.Col>  

              <this.Col md="12">
                <this.InputTextArea
                  name="address"
                  label={<this.Translate id="input_management_customer_address" />}
                  data={formData.address}
                  placeholder="Address"
                  max={100}
                  form={form}/>
              </this.Col>  

            </this.Row>
          </this.TabPane>

          {/* =======================CONTACT CUSTOMER============== */}
          <this.TabPane tab="Contact" key="2">
              
            {
              keys.map((contact, index) =>
                <div key={index}>
                  <this.Row>
                    <this.Col md="12">
                      <h6>{<this.Translate id="input_management_contact_number" />}  {`${index + 1}`} </h6>
                      <hr/>
                    </this.Col>
                    <this.Col md="6">
                      <this.InputText 
                        name={`cont_name[${index}]`} 
                        data={ contact.name }
                        label={<this.Translate id="input_management_contact_name" />} 
                        placeholder="name"  
                        form={ form } />
                    </this.Col>
    
                    <this.Col md="6">
                      <this.InputText
                        name={`const_phoneNumber[${index}]`}     
                        data={contact.phoneNumber}
                        label={<this.Translate id="input_management_contact_phone_number" />} 
                        placeholder="Phone number"
                        max={100}
                        form={form}/> 
                    </this.Col> 
    
                    <this.Col md="12">    
                      <this.InputTextArea
                        name={`const_address[${index}]`}
                        data={contact.address}
                        label={<this.Translate id="input_management_contact_address" />} 
                        placeholder="Address"
                        max={100}  
                        form={form}/>
                    </this.Col>
                  </this.Row>
                  {
                    keys.length > 1 ?
                      (<this.Icon
                        className="dynamic-delete-button"
                        type="minus-circle-o"
                        disabled={keys.length === 0 }
                        onClick={() => this.remove(index)} />
                      )
                      :
                      null
                  }
                </div>
              )
            } 
            <div className="btn-addcontact">
              <this.Button onClick={() => this.add(keys.length)} style={{ width: "60%" }}>
                <span className="icon-add"></span> Add Contact
              </this.Button>
            </div>
          </this.TabPane>
        </this.Tabs>
      </div>
    );
  }
}

FormItem.defaultProps = {
  formData: {
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