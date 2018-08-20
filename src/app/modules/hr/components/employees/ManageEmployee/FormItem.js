import React from "react";
import { Modal }  from "../../shares/Modal/modal";

export default class FormItem extends Modal {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
      value: "123"
    };
    this.onChange = this.onChange.bind(this);
  }

  onChange(checked){
    this.setState({
      disabled : checked === 1 
    });
    this.props.form.setFieldsValue({password: ""});
  }

  render() {
    const { form,locale,formData} = this.props;
    return (
      <div>
        <this.Tabs type="card">
          <this.TabPane tab="General" key="1">
            <div>
              {/* { manageEmployeeAdd.error != null ? <this.Alert message={this.requiredMessage} type="error" /> : "" } */}
              <this.Row>
                <this.Col md="6">
                  <this.InputText
                    name="firstname"
                    label={<this.Translate id="input_hr_employee_first_name" />}
                    data={formData.firstName}
                    placeholder={this.CATranslate("input_hr_employee_first_name", locale)}
                    required={true}
                    errorRequired={<this.Translate id="input_error_hr_employee_first_name" />}
                    max={100}
                    form={form}/>
                </this.Col>
                <this.Col md="6">
                  <this.InputText
                    name="lastname"
                    label={<this.Translate id="input_hr_employee_last_name" />}
                    data={formData.lastName}
                    placeholder={this.CATranslate("input_hr_employee_last_name", locale)}
                    required={true}
                    errorRequired={<this.Translate id="input_error_hr_employee_last_name" />}
                    max={100}
                    form={form}/>
                </this.Col>
                <this.Col md="6">
                  <this.Select
                    name="gender"
                    label={<this.Translate id="input_hr_employee_gender" />}
                    placeholder={this.CATranslate("input_hr_employee_gender", locale)}
                    dataSource={ this.gender }
                    form={form}/>
                </this.Col>
                <this.Col md="6">
                  <this.DatePickers 
                    name="dob" 
                    initialValue={formData.dob}
                    form={form}   
                    required={ false }
                    label={<this.Translate id="input_hr_employee_dob" />}
                  />
                </this.Col>
                <this.Col md="12">
                  <this.InputText
                    name="phoneNumber" 
                    data={formData.phoneNumber}
                    placeholder={this.CATranslate("input_hr_employee_phone_no", locale)}
                    form={form} 
                    label={<this.Translate id="input_hr_employee_phone_no" />}
                  />
                </this.Col>
                <this.Col md="12">
                  <this.InputEmail
                    name="email" 
                    data={formData.email}
                    placeholder={this.CATranslate("input_hr_employee_email_address", locale)}
                    form={form} 
                    label={<this.Translate id="input_hr_employee_email_address" />}
                  />
                </this.Col>
                <this.Col md="12">
                  <this.InputText
                    name="idCard" 
                    data={formData.idCard}
                    placeholder={this.CATranslate("input_hr_employee_id_card", locale)}
                    form={form} 
                    label={<this.Translate id="input_hr_employee_id_card" />}
                  />
                </this.Col>
                {/* <this.Col md="12">
                  <this.UploadImg
                    handleCardChange={ this.handleCardChange }
                    name="image"    
                    label={<this.Translate id="input_hr_employee_upload" />}
                    form={form}   
                  />
                </this.Col> */}
              </this.Row>
            </div>
          </this.TabPane>
          <this.TabPane tab="User Access" key="2">
            <this.Row>
              <this.Col md="12">
                <this.InputText
                  name="userName"
                  data={formData.userName}
                  label={<this.Translate id="input_hr_employee_user_name" />}
                  placeholder={this.CATranslate("input_hr_user_name", locale)}
                  errorRequired={<this.Translate id="input_error_hr_employee_user_name" />}
                  max={100}
                  form={form}/>
              </this.Col>
              <this.Col md="6">
                <this.InputText
                  type="password"
                  name="password"
                  data={formData.password}
                  label={<this.Translate id="input_hr_employee_user_password" />}
                  placeholder={this.CATranslate("input_hr_user_password", locale)}
                  errorRequired="Please input your password"
                  disabled = { this.state.disabled }
                  form={form}/>
              </this.Col>
              <this.Col md="6">
                <this.Switchs
                  label={<this.Translate id="input_hr_employee_auto_generate" />}
                  name="autogenerate"
                  onChange={this.onChange}
                  form={form}
                />
              </this.Col>

              <this.Col md="6">
                <this.Switchs
                  label={<this.Translate id="input_hr_employee_will_be_expired" />}
                  name="isPasswordExpired"
                  form={form}
                />
              </this.Col>
              <this.Col md="6">
                <this.Switchs
                  label={<this.Translate id="input_hr_employee_must_change_password" />}
                  name="isMustChangePWNextLogin"
                  form={form}
                />
              </this.Col>
              <this.Col md="6">
                <this.DatePickers
                  label={<this.Translate id="input_hr_employee_expired_date" />}
                  defaultValue={formData.passwordExpiredAt}
                  name="passwordExpiredAt"
                  form={form}
                />
              </this.Col> 
            </this.Row>
          </this.TabPane>
        </this.Tabs>
      </div>
    );
  }
}

FormItem.defaultProps = {
  formData: {
    firstname:"",
    lastname:"",
    gender:"",
    dob:"",
    phoneNumber:"",
    email:"",         
    idCard:"",
    image:"",
    userName:"",
    password:"",
    autogenerate:"",
    isPasswordExpired:"",
    passwordExpiredAt:"",
    status: 1
  }
};