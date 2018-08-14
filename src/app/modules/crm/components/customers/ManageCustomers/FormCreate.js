import React from "react";
import Modal from "../../shares/Modal";
import ManagementEmployeeAction from "../../../actions/customers/manageCustomers";


let uuid = 0;

export default class FormCreate extends Modal {
  constructor(props) {
    super(props);
    this.title = "Management Customer";
    this.addingPropReducer = "manageCustomersAdd";
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.add = this.add.bind(this);
    this.remove = this.remove.bind(this);
    this.customers =  [
      {
        name: "Male",
        value: "1"
      },
      {
        name: "Female",
        value: "2"
      }
    ];


  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        alert(JSON.stringify(values));

        // this.dispatch(ManagementEmployeeAction.add(values));
      }
    });
  }
      
  handleCancel() {
    this.dispatch(ManagementEmployeeAction.reset());
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
    const {manageCustomersAdd, form} = this.props;

    getFieldDecorator("keys", { initialValue: [] });
    const keys = getFieldValue("keys");
    const formItems = keys.map((k, index) => {
      return (
        <div key={ k }>
          <this.Row>

            <this.Col md="6">
              <this.InputText 
                name={`name[${k}]`} 
                label="name" 
                placeholder="name"  
                required={false}
                form={ form } />
            </this.Col>

            <this.Col md="6">
              <this.InputText
                name={`phonenumber[${k}]`}     
                label="Phone number"
                placeholder="Phone number"
                max={100}
                required={false}
                 
                form={form}/> 
            </this.Col> 

            <this.Col md="12">    
              <this.InputTextArea
                name={`address[${k}]`}
                label="Address"
                placeholder="Address"
                max={100}
                required={false}
                    
                form={form}/>
            </this.Col>


          </this.Row>


          {keys.length > 0 ? (
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

    if (manageCustomersAdd.showForm) {
      this.content = (
        <div>
          <this.Tabs type="card">
            <this.TabPane tab="General" key="1">
              <this.Row>
                <this.Col md="6">
                  <this.InputText
                    name="firstname"
                    label="First name"
                    placeholder="First Name"
                    required={true}
                    errorRequired="Please input your name"
                    max={100}
                    form={form}/>
                </this.Col>
                <this.Col md="6">
                  <this.InputText
                    name="lastname"
                    label="Last name"
                    placeholder="Last name"
                    required={true}
                    errorRequired="Last Name"
                    max={100}
                    form={form}/>
                </this.Col>   

                <this.Col md="12">
                  <this.InputText
                    name="phoneno"
                    label="Phone number"
                    placeholder="Phone number"
                    errorRequired="Last Name"
                    max={100}
                    form={form}/>
                </this.Col>  

                <this.Col md="12">
                  <this.Select
                    name="gender"
                    label="Customer"
                    placeholder="Please select customer"
                    dataSource={ this.customers }
                    form={form}/>
                </this.Col>  

                <this.Col md="12">
                  <this.InputText   
                    name="company"
                    label="Company"
                    placeholder="Company"
                    max={100}
                    form={form}/>
                </this.Col>  

                <this.Col md="12">
                  <this.InputText   
                    name="email"
                    label="Email address"
                    placeholder="Email address"
                    max={100}
                    form={form}/>
                </this.Col>  

                <this.Col md="12">
                  <this.InputTextArea
                    name="description"
                    label="Description"
                    placeholder="Description"
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

              </this.Row>
            </this.TabPane>
            <this.TabPane tab="Contact" key="2">
              <this.Row>
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
              </this.Row>

              {formItems}

              <div className="btn-addcontact">
                <this.Button type="dashed" onClick={ this.add } style={{ width: "60%" }}>
                  <this.Icon type="plus" /> Add Contact
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