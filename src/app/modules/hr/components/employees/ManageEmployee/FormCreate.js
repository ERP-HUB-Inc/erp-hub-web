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

export default class FormCreate extends Modal {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
      value: "123"
    };

    this.title = "Manage Employee";
    this.addingPropReducer = "manageEmployeeAdd";
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onChange = this.onChange.bind(this);

  }

  onChange(checked){
    this.setState({
      disabled : checked == 1,
    });
    this.props.form.setFieldsValue({password: ""});
  }


  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      
      // const formData = new FormData();
      // formData.append("image",values.image.file);
  
      // this.dispatch(ManageEmployeeAction.add(formData));

      // alert(JSON.stringify(values));

      // console.log(values);

      if (!err) {
        const formData = new FormData();
        formData.append("image",values.image.file);
        formData.append("firstname",values.firstname);
        formData.append("firstname",values.lastname);
        formData.append("gender",values.gender);

        // console.log(JSON.stringify(formData));

        this.dispatch(ManageEmployeeAction.add(values));
      }

    });
  }
      
  handleCancel() {
    this.dispatch(ManageEmployeeAction.reset());
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
                    required={ false }
                    label="Date of Birth"
                  />
                </this.Col>
                <this.Col md="12">
                  <this.InputText
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
                  disabled = { this.state.disabled }

                  // value={ this.state.value }
                  form={form}/>
              </this.Col>
              <this.Col md="6">
                <this.Switchs
                  label="Auto generate"
                  onChange={ this.onChange }
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
                  name="datepicker"
                  form={form}
                />
              </this.Col> 
              <this.Col md="12">  
                <this.InputTextArea
                  label="Address"
                  name="expiredDate"
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