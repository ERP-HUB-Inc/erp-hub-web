import React from "react";
import Enum from "../../../enums";
import EmployeeProfileAction from "../../../../hr/actions/employees/employee";
import "./index.css";
import Component from "../../../../common/components/Component";

export default class Profile extends Component {
  constructor(props){
    super(props);
    this.gender = [
      {
        name: <this.Translate id="text_male"/>,
        value: Enum.GENDER.MALE
      },
      {
        name: <this.Translate id="text_female"/>,
        value: Enum.GENDER.FEMALE
      }
    ];
  }
  componentDidMount(){
    this.getAccessToken();
    this.props.dispatch(EmployeeProfileAction.detail(this.getAccessToken()));
  }

  getAccessToken () {
    const result = this.Util.getAuthSession();
    if (result)
      return result.userId;
    else 
      return null;
  }

  render() {
    const {form, locale, userProfile } = this.props;
    let getuserProfile = [];
    if(userProfile == ""){
      return;
    }
    if(userProfile.data !== null && userProfile.data !== ""){
      getuserProfile = userProfile.data;
    }

    return (
      <div className="main-layout main-store-account" style={{ width: "100%" }}>
        <this.Row>
          <this.Col md="12"> 
            <this.Tabs type="card">
              <this.TabPane tab={<this.Translate id="text_general"/>} key="1">
                <this.Row>

                  <this.Col md="6">
                    <this.InputText
                      name="firstName"
                      label={<this.Translate id="input_hr_employee_first_name" />}
                      data={getuserProfile.firstName}
                      placeholder={this.CATranslate("input_hr_employee_first_name", locale)}
                      max={100}
                      form={form}
                      disabled
                    />
                    <this.InputText
                      name="lastName"
                      label={<this.Translate id="input_hr_employee_last_name" />}
                      data={getuserProfile.lastName}
                      placeholder={this.CATranslate("input_hr_employee_last_name", locale)}
                      errorRequired={<this.Translate id="input_error_hr_employee_last_name" />}
                      max={100}
                      form={form}
                      disabled />
                    <this.Select
                      name="gender"
                      label={<this.Translate id="input_hr_employee_gender" />}
                      placeholder={this.CATranslate("input_hr_employee_gender", locale)}
                      dataSource={this.gender}
                      defaultValue={getuserProfile.gender}
                      form={form}
                      disabled/>
                    <this.DatePickers
                      name="dob"
                      defaultValue={this.Util.formatDatePicker(getuserProfile.dob, this.Util.getInitialDateForDOB())}
                      label={<this.Translate id="input_hr_employee_dob" />}
                      form={form}
                      disabled
                    />
                    <this.InputText
                      name="phoneNumber" 
                      data={getuserProfile.phoneNumber}
                      placeholder={this.CATranslate("input_hr_employee_phone_no", locale)}
                      form={form} 
                      label={<this.Translate id="input_hr_employee_phone_no" />}
                      disabled/>
                    <this.InputText
                      name="email" 
                      data={getuserProfile.email}
                      placeholder={this.CATranslate("input_hr_employee_email_address", locale)}
                      form={form} 
                      label={<this.Translate id="input_hr_employee_email_address" />}
                      disabled/>
                    <this.InputText
                      name="idCard" 
                      data={getuserProfile.idCard}
                      placeholder={this.CATranslate("input_hr_employee_id_card", locale)}
                      form={form} 
                      label={<this.Translate id="input_hr_employee_id_card" />}
                      disabled/>
                    <this.InputTextArea
                      name="address"
                      label={<this.Translate id="text_address" />}
                      data={getuserProfile.address}
                      placeholder={this.CATranslate("text_address", this.props.locale)}
                      max={100}
                      form={this.props.form}
                      disabled = {true}/>
                  </this.Col> 
                  <this.Col md="6">
                    <this.Col md="12">
                      <div className="main-image-profile-view">
                        <div className="image-profile-view">
                          <this.Image url=  { `${this.Util.getProductImage(getuserProfile.photo,"employee").url}`}/>
                        </div>
                      </div>
                    </this.Col>
                  </this.Col>
                </this.Row>

            
              </this.TabPane>
              <this.TabPane tab={<this.Translate id="text_user_access"/>} key="2">

                <this.Row>
                  <this.Col md="6">
                    <this.InputText
                      name="userName"
                      data={getuserProfile.account ? getuserProfile.account.userName : "" }
                      label={<this.Translate id="input_hr_employee_user_name" />}
                      placeholder={this.CATranslate("input_hr_employee_user_name", locale)}       
                      form={form}
                      disabled
                    />
                    {/* <this.Select
                      name="roleId"
                      label={<this.Translate id="text_role" />}
                      placeholder={this.CATranslate("text_role", locale)}
                      valueKey="id"
                      defaultValue={getuserProfile.account && getuserProfile.account.roles.length > 0 ? getuserProfile.account.roles[0].id : (this.props.roles.length > 0 ? this.props.roles[0].id : "")}
                      form={form}
                      disabled
                    /> */}
                    <this.DatePickers
                      label={<this.Translate id="input_hr_employee_expired_date" />}
                      defaultValue={this.Util.formatDatePicker(getuserProfile.passwordExpiredAt)}
                      name="passwordExpiredAt"
                      form={form}
                      disabled
                    />
                  </this.Col>  

                </this.Row>

              </this.TabPane>
            </this.Tabs>
          </this.Col>
        </this.Row>
      </div>
    );
  }
}