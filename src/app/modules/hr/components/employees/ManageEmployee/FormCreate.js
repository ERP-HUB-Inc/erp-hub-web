import React from "react";
import { Modal } from "../../shares/Modal/modal";
import ManagementEmployeeAction from "../../../actions/employees/manageEmployee";

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

export default class FormCreate extends Modal {
  constructor(props) {
    super(props);
    this.title = "Manage Employee";
    this.addingPropReducer = "manageEmployeeAdd";
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.dispatch(ManagementEmployeeAction.add(values));
      }
    });
  }
      
  handleCancel() {
    this.dispatch(ManagementEmployeeAction.reset());
  }

  render() {
    const {manageEmployeeAdd, form} = this.props;

    if (manageEmployeeAdd.showForm) {
      this.content = (
        <this.Tabs type="card">
          <this.TabPane tab="General" key="1">
            <div>
              { manageEmployeeAdd.error != null ? <this.Alert message={this.requiredMessage} type="error" /> : "" }
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
                    label="Last Name"
                    placeholder="Please input your name"
                    required={true}
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
                    form={form}/>
                </this.Col>
                <this.Col md="6">
                  <this.DatePickers
                    name="dob" 
                    form={form} 
                    label="Date of Birth"
                  />
                </this.Col>
                <this.Col md="12">
                  <this.InputNumber
                    name="phonenumber" 
                    placeholder="Phone Number"
                    form={form} 
                    label="Phone Number"
                  />
                </this.Col>
                <this.Col md="12">
                  <this.InputEmail
                    name="email" 
                    placeholder="Email Address"
                    form={form} 
                    label="Email Address"
                  />
                </this.Col>
                <this.Col md="12">
                  <this.InputNumber
                    name="idcard" 
                    placeholder="Identification Card"
                    form={form} 
                    label="Identification Card"
                  />
                </this.Col>
                <this.Col md="12">
                  <this.UploadImg
                    name="idcard" 
                    placeholder="Identification Card"
                    form={form}   
                    label="Identification Card" 
                  />
                </this.Col>
              </this.Row>
            </div>
          </this.TabPane>
          <this.TabPane tab="User Access" key="2">
            <this.Row>
              <this.Col md="12">
                <this.InputText
                  name="username"
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
                  form={form}/>
              </this.Col>
              <this.Col md="6">
                <this.Switchs
                  label="Auto generate"
                  form={form}
                />
              </this.Col>

              <this.Col md="6">
                <this.Switchs
                  label="Will be expired"
                  form={form}
                />
              </this.Col>
              <this.Col md="6">
                <this.Switchs
                  label="Must change password"
                  form={form}
                />
              </this.Col>
              <this.Col md="6">
                <this.DatePickers
                  label="Expired date"
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
            </this.Row>
          </this.TabPane>
        </this.Tabs>
      );
      return super.render();
    } else {
      return (<div></div>);
    }
  }
}