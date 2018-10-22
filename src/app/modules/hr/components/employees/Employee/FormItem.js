import React from "react";
import Enum from "../../../enums";
import RoleAction from "../../../../pos/action/settings/roleAccess";
import LocationAction from "../../../../pos/action/settings/storeLocation";
import Modal from "../../../../common/components/shares/Modal";
import {Util} from "../../../../common/util";

export default class FormItem extends Modal {
  constructor(props) {
    super(props);
    this.state = {
      assignLocation: [],
      disabled: false
    };
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
    this.columns = [
      {
        title: <this.Translate id="text_locaton" />,
        dataIndex: "name",
        key: "name",
        render: value => <span className="text-capitalize">{value}</span>
      },
      {
        title: <this.Translate id="text_assign" />,
        dataIndex: "assign",
        key: "assign",
        render: (text, record, index) => {
          return <this.Checkbox
            value={record.id}
            onChange={this.onChangeAssign}
            form={this.props.form}/>;
        },
      },
    ];
    this.onChange = this.onChange.bind(this);
    this.onChangeAssign = this.onChangeAssign.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(RoleAction.fetch(100));
    this.props.dispatch(LocationAction.fetch(100));
  }

  onChangeAssign(e) {
    const existLocation = this.state.assignLocation;
    if (e.target.checked) {
      if (existLocation.length === 0) {
        existLocation.push({
          id: "",
          locationId: e.target.value,
          status: this.Enum.ACTIVE
        });
      } else {
        let isNotTheSame = true;
        existLocation.forEach((value, index) => {
          if (value.locationId === e.target.value) {
            isNotTheSame = false;
            existLocation[index]["status"] = this.Enum.ACTIVE;
          }
        });
        if (isNotTheSame) {
          existLocation.push({
            id: "",
            locationId: e.target.value,
            status: this.Enum.ACTIVE
          });
        }
      }
    } else {
      existLocation.forEach((value, index) => {
        if (value.locationId === e.target.value && value.id === "") {
          existLocation.splice(index, 1);
        } else if (value.locationId === e.target.value && value.id) {
          existLocation[index]["status"] = this.Enum.ARCHIVE;
        }
      });
    }

    if (this.props.callBack) {
      this.props.callBack(existLocation);
    }
    this.setState({assignLocation: existLocation});
  }

  onChange(checked){
    this.setState({
      disabled : checked === 1 
    });
    this.props.form.setFieldsValue({password: ""});
  }

  render() {
    const {form, locale, formData} = this.props;
    const image = {
      uid: "-1",
      name: formData.photo,
      status: "done",
      url: this.Util.getProductImage(formData.photo, this.Enum.IMAGE_SPACE.EMPLOYEE).url
    };

    return (
      <this.Tabs type="card">
        <this.TabPane tab={<this.Translate id="text_general"/>} key="1">
          <this.Row>
            <this.Col md="6">
              <this.InputText
                name="firstName"
                label={<this.Translate id="input_hr_employee_first_name" />}
                data={formData.firstName}
                placeholder={this.CATranslate("input_hr_employee_first_name", locale)}
                required={true}
                isAutoFocus={true}
                errorRequired={<this.Translate id="input_error_hr_employee_first_name" />}
                max={100}
                form={form}/>
            </this.Col>
            <this.Col md="6">
              <this.InputText
                name="lastName"
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
                dataSource={this.gender}
                defaultValue={formData.gender}
                form={form}/>
            </this.Col>
            <this.Col md="6">
              <this.DatePickers
                name="dob"
                defaultValue={this.Util.formatDatePicker(formData.dob, this.Util.getInitialDateForDOB())}
                label={<this.Translate id="input_hr_employee_dob" />}
                form={form}/>
            </this.Col>
            <this.Col md="12">
              <this.InputText
                name="phoneNumber" 
                data={formData.phoneNumber}
                placeholder={this.CATranslate("input_hr_employee_phone_no", locale)}
                form={form} 
                label={<this.Translate id="input_hr_employee_phone_no" />}/>
            </this.Col>
            <this.Col md="12">
              <this.InputEmail
                name="email" 
                data={formData.email}
                placeholder={this.CATranslate("input_hr_employee_email_address", locale)}
                form={form} 
                label={<this.Translate id="input_hr_employee_email_address" />}/>
            </this.Col>
            <this.Col md="12">
              <this.InputText
                name="idCard" 
                data={formData.idCard}
                placeholder={this.CATranslate("input_hr_employee_id_card", locale)}
                form={form} 
                label={<this.Translate id="input_hr_employee_id_card" />}/>
            </this.Col>
            <this.Col md="12">
              <this.InputTextArea
                name="address"
                label={<this.Translate id="text_address" />}
                data={formData.address}
                placeholder={this.CATranslate("text_address", this.props.locale)}
                max={100}
                form={this.props.form}/>
            </this.Col>
            <this.Col md="12">
              <this.UploadImg
                name="photo"
                data={{file: image}}
                fileList={[image]}    
                label={<this.Translate id="input_hr_employee_upload" />}
                endPoint={`${this.Util.getAPIURL()}/file/v1/upload/employee`}
                endPointDelete={`${this.Util.getAPIURL()}/file/v1/employee/delete`}
                accessToken={this.Util.getAccessToken()}
                form={form}/>
            </this.Col>
          </this.Row>
        </this.TabPane>
        <this.TabPane tab={<this.Translate id="text_user_access"/>} key="2">
          <this.Row>
            <this.Col md="6">
              <this.InputText
                name="userName"
                data={formData.userName}
                label={<this.Translate id="input_hr_employee_user_name" />}
                placeholder={this.CATranslate("input_hr_employee_user_name", locale)}
                errorRequired={<this.Translate id="input_error_hr_employee_user_name" />}
                max={100}
                form={form}/>
            </this.Col>
            <this.Col md="6">
              <this.Select
                name="roleId"
                label={<this.Translate id="text_role" />}
                placeholder={this.CATranslate("text_role", locale)}
                valueKey="id"
                dataSource={this.props.roles}
                form={form}/>
            </this.Col>
            <this.Col md="6">
              <this.InputText
                type="password"
                name="password"
                data={formData.password}
                label={<this.Translate id="input_hr_employee_user_password" />}
                placeholder={this.CATranslate("input_hr_employee_user_password", locale)}
                disabled={this.state.disabled}
                form={form}/>
            </this.Col>
            <this.Col md="6" className="wrap-switch">
              <this.Switchs
                label={<this.Translate id="input_hr_employee_auto_generate" />}
                name="autogenerate"
                onChange={this.onChange}
                form={form}/>
            </this.Col>

            <this.Col md="6">
              <this.DatePickers
                label={<this.Translate id="input_hr_employee_expired_date" />}
                defaultValue={this.Util.formatDatePicker(formData.passwordExpiredAt)}
                name="passwordExpiredAt"
                form={form}/>
            </this.Col>
            <this.Col md="6" className="wrap-switch">
              <this.Switchs
                label={<this.Translate id="input_hr_employee_must_change_password" />}
                name="isMustChangePWNextLogin"
                form={form}/>
            </this.Col>
            <this.Col md="6" className="wrap-switch">
              <this.Switchs
                label={<this.Translate id="input_hr_employee_will_be_expired" />}
                name="isPasswordExpired"
                form={form}
              />
            </this.Col> 
          </this.Row>
        </this.TabPane>
        <this.TabPane tab={<this.Translate id="text_location_access"/>} key="3">
          <this.Row>
            <this.Col md="12">
              <this.Table
                dataSource={this.props.locations}
                columns={this.columns}
                locale={{emptyText: <this.Translate id="table_empty_data" />}} />
            </this.Col>
          </this.Row>
        </this.TabPane>
      </this.Tabs>
    );
  }
}

FormItem.defaultProps = {
  formData: {
    firstname: "",
    lastname: "",
    gender: Enum.GENDER.MALE,
    dob: (new Util()).getInitialDateForDOB(),
    phoneNumber: "",
    email: "",
    address: "",         
    idCard: "",
    photo: "",
    userName: "",
    password: "",
    autogenerate: "",
    isPasswordExpired: "",
    passwordExpiredAt: (new Util()).getCurrentDate(),
    status: 1
  }
};