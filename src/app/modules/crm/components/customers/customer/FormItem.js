import React from "react";
import FormContact from "./FormContact";
import GroupCustomerAction from "../../../actions/customers/group";
import Modal from "../../../../common/components/shares/Modal";
import "./index.css";

export default class FormItem extends Modal {
  constructor(props) {
    super(props);
    this.state = {
      removeContactKeys: []
    };
    this.contactIndex = 0;
    this.add = this.add.bind(this);
    this.remove = this.remove.bind(this);
    this.renderContact = this.renderContact.bind(this);
  }
  componentDidMount(){
    const {dispatch} = this.props;
    dispatch(GroupCustomerAction.fetch());
  }

  componentDidUpdate() {
    if (this.props.groupCustomersAdd.added) {
      this.props.form.setFieldsValue({groupCustomerId: this.props.groupCustomersAdd.response.data.id});
      this.props.dispatch(GroupCustomerAction.reset());
    }
  }

  add(newContact){
    const {form, formData} = this.props;
    console.log("add new",newContact);
    const contactKeys = formData.contacts.concat([newContact]);
    form.setFieldsValue({
      keys: contactKeys
    });
  }

  remove(contactIndex){
    const {form} = this.props;
    
    const contactKeys = form.getFieldValue("keys");
    
    if (contactKeys.length > 1) {
      const remainContactKeys = [];
      contactKeys.forEach((contact, index) => {
        if (index !== contactIndex) {
          remainContactKeys.push(contact);
        } else if (contact != null && contact.id !== "") {
          contact["status"] = this.Enum.ARCHIVE;
          remainContactKeys.push(contact);
        }
      });

      form.setFieldsValue({
        keys: remainContactKeys
      });
    }
  }

  renderContact(keys, contacts) {
    const {locale, form} = this.props;
    if (contacts.length === 0) {
      return <div/>;
    }

    return (
      keys.map((contact, index) =>
        <div key={index}>
          <this.Row>
            <this.Col md="12">
              <h6>{<this.Translate id="input_management_contact_number" />}  {`${index + 1}`} </h6>
              <hr className="line-contact"/>
            </this.Col>
            <this.InputText 
              name={`cont_id[${index}]`} 
              type="hidden"
              data={contacts.id !== null ? contacts.id : ""}
              form={form} />
            <this.Col md="6">
              <this.InputText 
                name={`cont_name[${index}]`} 
                data={contacts.name}
                label={<this.Translate id="input_management_contact_name" />} 
                placeholder={this.CATranslate("input_management_contact_name", locale)}  
                form={ form } />
            </this.Col>

            <this.Col md="6">
              <this.InputText
                name={`const_phoneNumber[${index}]`}     
                data={contacts.phoneNumber}
                label={<this.Translate id="input_management_contact_phone_number" />} 
                placeholder={this.CATranslate("input_management_contact_phone_number", locale)}  
                max={100}
                form={form}/> 
            </this.Col> 

            <this.Col md="12">    
              <this.InputTextArea
                name={`const_address[${index}]`}
                data={contacts.address + keys.length}
                label={<this.Translate id="input_management_contact_address" />} 
                placeholder={this.CATranslate("input_management_contact_address", locale)}  
                max={100}  
                form={form}/>
            </this.Col>
          </this.Row>
          {
            keys.length > 0 ?
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
    );
  }
  
  render() {
    const {
      formData,
      form,
      groupCustomers,
      groupCustomersAdd,
      locale
    } = this.props;

    const {
      getFieldDecorator,
      getFieldValue
    } = this.props.form;

    // APPEND GROUP CUSTOMER TO LIST
    if (groupCustomersAdd.response != null) {
      groupCustomers.list = [groupCustomersAdd.response.data, ...groupCustomers.list];
    }

    getFieldDecorator("keys", {initialValue: formData.contacts});

    let keys = getFieldValue("keys");
    if(keys == null){
      keys = [];
    }

    const keysLength = keys.length;
    const contactLength = formData.contacts.length;

    if (keysLength === contactLength) {
      keys = formData.contacts;
    }

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
                  placeholder={this.CATranslate("input_management_customer_first_name",locale)}
                  required={true}
                  errorRequired={<this.Translate id="input_error_management_customer_first_name_length" />}
                  max={100}
                  form={form}/>
              </this.Col>

              <this.Col md="6">
                <this.InputText
                  name="lastName"
                  label={<this.Translate id="input_management_customer_last_name" />}
                  data={formData.lastName}
                  placeholder={this.CATranslate("input_management_customer_last_name", locale)}
                  required={true}
                  errorRequired={<this.Translate id="input_management_customer_last_name_length" />}
                  max={100}
                  form={form}/>
              </this.Col>   

              <this.Col md="12">
                <this.InputText
                  name="phoneNumber"
                  label={<this.Translate id="input_management_customer_phone_number" />}
                  data={formData.phoneNumber}
                  placeholder={this.CATranslate("input_management_customer_phone_number", locale)}
                  max={100}
                  form={form}/>
              </this.Col>
                
              {/* <this.Col md="12">
                <this.SelectSearch
                  name="groupCustomerId"
                  label={<this.Translate id="input_management_customer_customer_group" />}
                  placeholder="Please select customer"
                  defaultValue={formData.groupCustomerId}
                  dataSource={customer}
                  showSearch={true}
                  addNew={this.props.addCustomerGroup}
                  form={form}/>
              </this.Col>   */}

              <this.Col md="12">
                <this.SelectSearch
                  name="groupCustomerId"
                  label={<this.Translate id="input_management_customer_customer_group" />}
                  placeholder={this.CATranslate("select_customer_place_holder_group", locale)}
                  defaultValue={formData.groupCustomerId}
                  dataSource={groupCustomers.list}
                  valueKey="id"
                  addNew={this.props.handleAddCustomerGroup}
                  form={form}/>
              </this.Col>  

              <this.Col md="12">
                <this.InputText   
                  name="company"
                  label={<this.Translate id="input_management_customer_company" />}
                  data={formData.company}
                  placeholder={this.CATranslate("input_management_customer_company", locale)}
                  max={100}
                  form={form}/>
              </this.Col>  

              <this.Col md="12">
                <this.InputText   
                  name="email"
                  label={<this.Translate id="input_management_customer_email" />}
                  data={formData.email}
                  placeholder={this.CATranslate("input_management_customer_email", locale)}
                  max={100}
                  form={form}/>
              </this.Col>  

              <this.Col md="12">
                <this.InputTextArea
                  name="description"
                  label={<this.Translate id="input_management_customer_description" />}
                  data={formData.description}
                  placeholder={this.CATranslate("input_management_customer_description", locale)}
                  max={100}
                  form={form}/>
              </this.Col>  

              <this.Col md="12">
                <this.InputTextArea
                  name="address"
                  label={<this.Translate id="input_management_customer_address" />}
                  data={formData.address}
                  placeholder={this.CATranslate("input_management_customer_address", locale)}
                  max={100}
                  form={form}/>
              </this.Col> 
              
              <this.Col md="12">
                <this.Select
                  name="state"
                  label={<this.Translate id="text_status" />}
                  dataSource={this.statusDataSource}
                  defaultValue={formData.status}
                  form={form}/>
              </this.Col> 

            </this.Row>
          </this.TabPane>

          {/* =======================CONTACT CUSTOMER============== */}
          <this.TabPane tab="Contact" key="2">
              
            {
              keys.map((contact, index) =>
                contact.isSystem === this.Enum.IS_SYSTEM ?
                  ""
                  :
                  <FormContact
                    key={index}
                    totalKeys={keys}
                    index={index}
                    contact={contact}
                    form={form}
                    locale={locale}
                    remove={() => this.remove(index)}
                  />
              )
            } 
            <div className="btn-addcontact">
              <this.Button onClick={() => this.add({id: "", status: this.Enum.ACTIVE})} style={{ width: "60%" }}>
                <span className="icon-add"></span> <span><this.Translate id="text_add" /></span>
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