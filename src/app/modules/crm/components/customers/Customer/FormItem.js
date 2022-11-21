import React from "react";
import moment from "moment";
import FormContact from "./FormContact";
import Enum from "../../../enum";
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
    this.customerTypes = [
      {
        title: <this.Translate id="text_retail_sale" />,
        value: Enum.CUSTOMER_TYPE.RETAIL_SALE
      },
      {
        title: <this.Translate id="text_whole_sale" />,
        value: Enum.CUSTOMER_TYPE.WHOLE_SALE
      },
      {
        title: <this.Translate id="text_distributor" />,
        value: Enum.CUSTOMER_TYPE.DISTRIBUTOR
      }
    ];
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
        <this.TabPane tab={<this.Translate id="text_general" />} key="1">
          <this.Row>
            <this.Col md="6">
              <this.InputText
                name="firstName"
                label={<this.Translate id="text_first_name" />}
                data={formData.firstName}
                placeholder={this.CATranslate("text_first_name",this.props.locale)}
                isAutoFocus={true}
                errorRequired={<this.Translate id="error_required_first_name" />}
                max={100}
                form={this.props.form}/>
            </this.Col>

            <this.Col md="6">
              <this.InputText
                name="lastName"
                label={<this.Translate id="text_last_name" />}
                data={formData.lastName}
                placeholder={this.CATranslate("text_last_name", this.props.locale)}
                errorRequired={<this.Translate id="error_required_last_name" />}
                max={100}
                form={this.props.form}/>
            </this.Col>

            <this.Col md="12" className="customerType">
              <this.RadioButton
                name="type"
                label={<this.Translate id="text_type" />}
                defaultValue={formData.type}
                dataSource={this.customerTypes}
                form={this.props.form} />
            </this.Col>

            <this.Col md="12">
              <this.InputText
                name="company"
                label={<this.Translate id="text_company" />}
                required={true}
                data={formData.company}
                placeholder={this.CATranslate("text_company", this.props.locale)}
                max={100}
                form={this.props.form} />
            </this.Col>

            <this.Col md="12">
              <this.InputText
                name="phoneNumber"
                label={<this.Translate id="text_phone_number" />}
                required={true}
                data={formData.phoneNumber}
                placeholder={this.CATranslate("text_phone_number", this.props.locale)}
                max={100}
                form={this.props.form}/>
            </this.Col>

            <this.Col md="12">
              <this.InputEmail
                name="email"
                label={<this.Translate id="text_email" />}
                data={formData.email}
                placeholder={this.CATranslate("text_email", this.props.locale)}
                max={100}
                form={this.props.form} />
            </this.Col> 

            <this.Col md="12">
              <this.DatePickers
                name="dob"
                label={<this.Translate id="text_date_of_birth" />}
                placeholder={this.CATranslate("text_date_of_birth", this.props.locale)}
                defaultValue={formData.dob ? formData.dob : null}
                form={this.props.form} />
            </this.Col>

            <this.Col md="12">
              <this.InputText
                name="VATNo"
                label={<this.Translate id="text_vat_no" />}
                data={formData.VATNo}
                placeholder={this.CATranslate("text_vat_no", this.props.locale)}
                form={this.props.form} />
            </this.Col> 

            <this.Col md="12">
              <this.SelectSearch
                name="groupCustomerId"
                label={<this.Translate id="text_group" />}
                placeholder={this.CATranslate("select_customer_place_holder_group", this.props.locale)}
                defaultValue={formData.groupCustomer ? formData.groupCustomerId : groupCustomers.list.length > 0 ? groupCustomers.list[0].id: ""}
                dataSource={groupCustomers.list}
                valueKey="id"
                addNew={this.props.handleAddCustomerGroup}
                form={this.props.form}/>
            </this.Col>   

            {/* <this.Col md="12">
              <this.InputTextArea
                name="description"
                label={<this.Translate id="text_description" />}
                data={formData.description}
                placeholder={this.CATranslate("text_description", this.props.locale)}
                max={100}
                form={this.props.form}/>
            </this.Col>   */}

            <this.Col md="12">
              <this.InputTextArea
                name="address"
                label={<this.Translate id="text_address" />}
                data={formData.address}
                placeholder={this.CATranslate("text_address", this.props.locale)}
                max={100}
                form={this.props.form}/>
            </this.Col> 
              
            <this.Col md="12" className="hidden">
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
        <this.TabPane tab={<this.Translate id="text_contact" />} key="2">
              
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
                  remove={() => this.remove(contact, index)}/>
            )
          } 
          <div className="btn-addcontact">
            <this.Button onClick={this.add}>
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
    type: 0,
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