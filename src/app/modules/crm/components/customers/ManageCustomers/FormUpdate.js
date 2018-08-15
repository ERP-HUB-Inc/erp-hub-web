import React from "react";
import Modal from "../../shares/Modal";
import ManagementEmployeeAction from "../../../actions/customers/manageCustomers";
import GroupMangementEmployeeAction from "../../../actions/customers/groupCustomer";
import CreateCustomerGroup from "../../../containers/customers/GroupCustomers/FormCreate";
import Constant from "../../../constants/customers/groupCustomer";

let uuid = 0;

export default class FormCreate extends Modal {
  constructor(props) {
    super(props);
    this.title = "Management Customer:update";
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.add = this.add.bind(this);
    this.remove = this.remove.bind(this);
    this.AddCustomerGroup = this.AddCustomerGroup.bind(this);

    this.addingProp = "groupCustomersUpdate";
    this.updatingProp = "manageCustomersUpdate";

  }


  AddCustomerGroup(){
    const { dispatch } = this.props;
    dispatch(GroupMangementEmployeeAction.showForm());
    this.modal1 = <CreateCustomerGroup/>;
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        // values["contacts"] = 

        //   {
        //     "name" : values.cont_name,
        //     "address": values.const_address,
        //     "phoneNumber": values.const_phoneNumber
        //   }

        // ;
        // delete values["cont_name"];
        // delete values["const_phoneNumber"];
        // delete values["const_address"];
        delete values["keys"];

        console.log(JSON.stringify(values));    
        this.dispatch(ManagementEmployeeAction.add(values));
      }
    });
  }
      
  handleCancel() {
    this.dispatch(ManagementEmployeeAction.reset());
  }

  componentDidMount(){
    const { dispatch } = this.props;
    // this.add();
    dispatch(GroupMangementEmployeeAction.fetch());
  }

  add(){
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue("keys");
    const nextKeys = keys.concat(uuid);  
    uuid++;
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
  }

  remove(k){
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue("keys");    
    // We need at least one passenger
    if (keys.length === 0) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const {manageCustomersUpdate, form, groupCustomers} = this.props;
    // APPEND GROUP CUSTOMER TO LIST
    if (groupCustomers.response != null) {
      groupCustomers.list = [manageCustomersUpdate.response.data, ...groupCustomers.list];
      this.props.dispatch({type: Constant.RESET_MANAGEMENT_GROUP_CUSTOMERS});
    }
    
    const customer = this.Util.renameObjectKey({ name: "name", id: "value" }, groupCustomers.list);

    getFieldDecorator("keys", { initialValue: [] });
    const keys = getFieldValue("keys");
    const formItems = keys.map((k, index) => {
      return (
        <div key={ k }>
          <this.Row>
            <this.Col md="12">
              <h6>Contact</h6>
              <hr/>
            </this.Col>
            <this.Col md="6">
              <this.InputText 
                name={`cont_name[${k}]`} 
                label="name" 
                placeholder="name"  
                form={ form } />
            </this.Col>

            <this.Col md="6">
              <this.InputText
                name={`const_phoneNumber[${k}]`}     
                label="Phone number"
                placeholder="Phone number"
                max={100}
                form={form}/> 
            </this.Col> 

            <this.Col md="12">    
              <this.InputTextArea
                name={`const_address[${k}]`}
                label="Address"
                placeholder="Address"
                max={100}  
                form={form}/>
            </this.Col>


          </this.Row>


          {keys.length > 1 ? (
            <this.Icon
              className="dynamic-delete-button"
              type="minus-circle-o"
              disabled={keys.length === 0 }
              onClick={() => this.remove(k)}
            />  
          ) : null}
        </div>
      );
    });

    if (manageCustomersUpdate.showForm) {
      this.content = (
        <div>
          <this.Tabs type="card">
            <this.TabPane tab="General" key="1">
              <this.Row>
                <this.Col md="6">
                  <this.InputText
                    name="firstName"
                    label="First name"
                    data={ manageCustomersUpdate.data.firstName }
                    placeholder="First Name"
                    required={true}
                    errorRequired="Please input your name"
                    max={100}
                    form={form}/>
                </this.Col>
                <this.Col md="6">
                  <this.InputText
                    name="lastName"
                    label="Last name"
                    data={ manageCustomersUpdate.data.lastName }
                    placeholder="Last name"
                    required={true}
                    errorRequired="Last Name"
                    max={100}
                    form={form}/>
                </this.Col>   

                <this.Col md="12">
                  <this.InputText
                    name="phoneNumber"
                    label="Phone number"
                    data={ manageCustomersUpdate.data.phoneNumber }
                    placeholder="Phone number"
                    errorRequired="Last Name"
                    max={100}
                    form={form}/>
                </this.Col>  

                <this.Col md="12">
                  <this.Select
                    name="groupCustomerId"
                    label="Customer"
                    
                    placeholder="Please select customer"
                    dataSource={ customer }
                    showSearch={ true }
                    addNew={this.AddCustomerGroup}
                    form={form}/>
                </this.Col>  

                <this.Col md="12">
                  <this.InputText   
                    name="company"
                    label="Company"
                    data={ manageCustomersUpdate.data.company }
                    placeholder="Company"
                    max={100}
                    form={form}/>
                </this.Col>  

                <this.Col md="12">
                  <this.InputText   
                    name="email"
                    label="Email address"
                    data={ manageCustomersUpdate.data.email }
                    placeholder="Email address"
                    max={100}
                    form={form}/>
                </this.Col>  

                <this.Col md="12">
                  <this.InputTextArea
                    name="description"
                    data={ manageCustomersUpdate.data.description }
                    label="Description"
                    placeholder="Description"
                    max={100}
                    form={form}/>
                </this.Col>  

                <this.Col md="12">
                  <this.InputTextArea
                    name="address"
                    data={ manageCustomersUpdate.data.address }
                    label="Address"
                    placeholder="Address"
                    max={100}
                    form={form}/>
                </this.Col>  

              </this.Row>
            </this.TabPane>
            <this.TabPane tab="Contact" key="2">

              {/* <this.Row>
                <this.Col md="6">
                  <this.InputText
                    name="name"
                    label="name"
                    placeholder="Contact Name"
                    max={100}
                    form={form}/>
                </this.Col>

                <this.Col md="6">
                  <this.InputText
                    name="phonenumber"
                    label="Phone number"
                    placeholder="Phone number"
                    max={100}
                    form={form}/>
                </this.Col>

                <this.Col md="12">
                  <this.InputTextArea
                    name="address"
                    label="Address"
                    placeholder="Address"
                    max={100}
                    form={form}/>
                </this.Col>
              </this.Row> */}

              {formItems}

              <div className="btn-addcontact">
                <this.Button onClick={ this.add } style={{ width: "60%" }}>
                  <span className="icon-add"> </span> Add Contact
                </this.Button>
              </div>

            </this.TabPane>
          </this.Tabs>
        </div>
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}
