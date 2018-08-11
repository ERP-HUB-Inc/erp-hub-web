import React from "react";
import { Modal } from "../../shares/Modal/modal";
import ManageEmployeeAction from "../../../actions/employees/manageEmployee";

const gender = [
  {
    name: "Male",
    value: "1"
  },
  {
    name: "Female",
    value: "2"
  }
];

export default class Form extends Modal {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false
    };

    this.title = "Manage Method:Update";
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange(checked){
    this.setState({
      disabled : checked === 1 
    });
    this.props.form.setFieldsValue({password: ""});
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      // this.dispatch(ManageEmployeeAction.add(values.image.file.name));
      if (!err) {
        const {manageEmployeeUpdate} = this.props;
        values["id"] = manageEmployeeUpdate.data.id;
        values["user"] = [{
          password : values.password
        }];
        console.log(values);
        this.dispatch(ManageEmployeeAction.update(values));
      }
    });
  }
    
  handleCancel() {
    this.dispatch(ManageEmployeeAction.reset());
  }

  render() {
    const {manageEmployeeUpdate, form} = this.props;

    if (manageEmployeeUpdate.showForm) {
      this.content = (
        <div>
          {manageEmployeeUpdate.error != null ? <this.Alert message={this.requiredMessage} type="error" /> : ""}
          <this.Tabs type="card">
            <this.TabPane tab="General" key="1">
              <div>
                
                <this.Row>
                  <this.Col md="6">
                    <this.InputText
                      name="firstName"
                      label="First name"
                      placeholder="First Name"
                      required={true}
                      data={ manageEmployeeUpdate.data.firstName }
                      errorRequired="Please input your name"
                      max={100}
                      form={form}/>
                  </this.Col>
                  <this.Col md="6">
                    <this.InputText
                      name="lastName"
                      label="Last Name"
                      placeholder="Please input your name"
                      required={true}
                      data={ manageEmployeeUpdate.data.lastName }
                      errorRequired="Please input your name"
                      max={100}
                      form={form}/>
                  </this.Col>
                  <this.Col md="6"> 
                    <this.Select
                      name="gender"
                      label="Gender"
                      placeholder="Please select gender"
                      dataSource={ gender }
                      defaultValue={ manageEmployeeUpdate.data.gender === 1 ? "Male" : "Female" }
                      form={form}/>
                  </this.Col>
                  <this.Col md="6">
                    <this.DatePickers
                      name="dob" 
                      form={form} 
                      defaultValue={ manageEmployeeUpdate.data.dob }
                      label="Date of Birth"
                    />
                  </this.Col>
                  <this.Col md="12">
                    <this.InputText
                      name="phoneNumber" 
                      placeholder="Phone Number"
                      form={form} 
                      data={ manageEmployeeUpdate.data.phoneNumber }
                      label="Phone Number"
                    />
                  </this.Col>
                  <this.Col md="12">
                    <this.InputEmail
                      name="email" 
                      placeholder="Email Address"
                      form={form} 
                      data={ manageEmployeeUpdate.data.email }
                      label="Email Address"
                    />
                  </this.Col>
                  <this.Col md="12">
                    <this.InputNumber
                      name="idCard" 
                      placeholder="Identification Card"
                      form={form} 
                      data={ manageEmployeeUpdate.data.idCard }
                      label="Identification Card"
                    />
                  </this.Col>
                  <this.Col md="12">
                    <this.UploadImg
                      name="image"    
                      label="Upload" 
                      form={form}   
                    />
                  </this.Col>
                </this.Row>
              </div>
            </this.TabPane>
            <this.TabPane tab="User Access" key="2">
              <this.Row>
                <this.Col md="12">
                  <this.InputText
                    name="userName"
                    label="User name"
                    placeholder="User name"
                    errorRequired="Please input your username"
                    max={100}
                    form={form}/>
                </this.Col>
                <this.Col md="6">
                  <this.InputText
                    type="password"
                    name="password"
                    label="Password"
                    placeholder="Password"
                    errorRequired="Please input your password"
                    defaultValue={ this.state.defaultValue }
                    disabled = { this.state.disabled }
                    form={form}
                  />  
                </this.Col>
                <this.Col md="6">
                  <this.Switchs
                    label="Auto generate"
                    name="autogenerate"
                    onChange={ this.onChange }
                    form={form}
                  />
                </this.Col>

                <this.Col md="6">
                  <this.Switchs
                    label="Will be expired"
                    name="expireds"
                    form={form}
                  />
                </this.Col>
                <this.Col md="6">
                  <this.Switchs
                    label="Must change password"
                    name="mustchange"
                    form={form}
                  />
                </this.Col>
                <this.Col md="6">
                  <this.DatePickers
                    label="Expired date"
                    name="expired"
                    defaultValue={ manageEmployeeUpdate.data.dob }
                    form={form}
                  />
                </this.Col> 
                <this.Col md="12">  
                  <this.InputTextArea
                    label="Address"
                    form={form}
                    min={ 20 }
                  />
                </this.Col> 
                <this.Col md="12">  
                  <this.Select
                    name="status"
                    label="Status"
                    placeholder="Please select status"
                    dataSource={this.statusDataSource}
                    defaultValue={manageEmployeeUpdate.data.status}
                    form={form}/>
                </this.Col>
              </this.Row>
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