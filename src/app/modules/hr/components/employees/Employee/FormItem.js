import React from "react";
import Enum from "../../../enums";
import RoleAction from "../../../../pos/action/settings/roleAccess";
import LocationAction from "../../../../pos/action/settings/location";
import Modal from "../../../../common/components/shares/Modal";
import UserService from "../../../../common/services/UserService";
import {Util} from "../../../../common/util";

export default class FormItem extends Modal {
  constructor(props) {
    super(props);
    this.state = {
      assignLocation: [],
      locations: [],
      defaultLocation: {
        checked: false,
        locationId: ""
      },
      disabled: false,
      requiredPassword: false
    };
    this.timer = null;
    this.hasReceiveProps = false;
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
        title: <this.Translate id="text_location" />,
        dataIndex: "name",
        key: "name",
        render: value => <span className="text-capitalize">{value}</span>
      },
      {
        title: <this.Translate id="text_default" />,
        key: "default",
        render: (text, record, index) => {
          return <this.Checkbox
            value={record.id}
            disabled={!this.state.locations[index]["checked"]}
            checked={this.state.defaultLocation.locationId === record.id && this.state.defaultLocation.checked && this.state.locations[index]["checked"]}
            onChange={this.onChangeDefaultLocation}
            form={this.props.form} />;
        },
      },
      {
        title: <this.Translate id="text_assign" />,
        dataIndex: "assign",
        key: "assign",
        render: (text, record, index) => {
          return <this.Checkbox
            value={record.id}
            checked={record.checked}
            onChange={(e) => this.onChangeAssign(e, index)}
            form={this.props.form}/>;
        },
      }
    ];
    this.employeeTypes = [
      {
        title: <this.Translate id="text_allow_edit_product_price_when_sale" />,
        value: Enum.ALLOW_EDIT_SALE_PRODUCT.ALLOW
      },
      {
        title: <this.Translate id="text_not_allow_edit_product_price_when_sale" />,
        value: Enum.ALLOW_EDIT_SALE_PRODUCT.NOT_ALLOW
      }
    ];
    this.onChange = this.onChange.bind(this);
    this.onChangeAssign = this.onChangeAssign.bind(this);
    this.onChangeDefaultLocation = this.onChangeDefaultLocation.bind(this);
    this.checkIsUserAlreadyExist = this.checkIsUserAlreadyExist.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(RoleAction.fetch(100));
    this.props.dispatch(LocationAction.fetch(100));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.locations.length > 0 && !this.hasReceiveProps) {
      let locations = nextProps.locations;
      const assignLocation = this.state.assignLocation;
      locations.forEach((value, index) => {
        let newValue = value;
        if (nextProps.formData.account) {
          const accessLocation = nextProps.formData.account.userAccessLocation.find(locationValue => locationValue.locationId === value.id);
          if (accessLocation != null) {
            newValue["checked"] = true;
            assignLocation.push({
              id: accessLocation.id,
              locationId: value.id,
              status: this.Enum.ACTIVE
            });
          }
        }
        locations[index] = newValue;
      });

      this.setState({
        locations,
        assignLocation,
        defaultLocation: {
          locationId: nextProps.formData.account ? nextProps.formData.account.locationId : "",
          checked: nextProps.formData.account && nextProps.formData.account.locationId ? true : false
        }
      });

      if (this.props.callBack) {
        this.props.callBack(assignLocation);

        if (nextProps.formData.account) {
          this.props.callBackDefaultLocation(nextProps.formData.account.locationId);
        }
      }


      this.hasReceiveProps = true;
    }
  }

  checkIsUserAlreadyExist(rule, value, callback) {
    clearTimeout(this.timer);
    this.timer = setTimeout(function() {
      UserService.findUserByUserName(value)
        .then((response) => {
          callback(this.CATranslate("text_user_already_exist", this.props.locale));
        })
        .catch((error) => {
          callback();
        });
    }.bind(this), 500);
  }

  onChangeAssign(e, index) {
    const existLocation = this.state.assignLocation;
    const locations = this.state.locations;
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

    locations[index]["checked"] = e.target.checked;

    this.setState({
      assignLocation: existLocation,
      locations
    });

    // NOW FOR ONLY CREATE FOR AUTO SELECT DEFAULT
    let length = existLocation.length;
    if (length === 1 && existLocation[0].status === this.Enum.ACTIVE) {
      this.setState({
        defaultLocation: {
          locationId: existLocation[0].locationId,
          checked: true
        }
      });

      if (this.props.callBackDefaultLocation) {
        this.props.callBackDefaultLocation(existLocation[0].locationId);
      }
    } else if (length === 0) {
      this.setState({
        defaultLocation: {
          locationId: "",
          checked: false
        }
      });
    }

    // TO DO: AUTO SELECT DEFAULT LOCATION FOR BOTH CREATE AND UPDATE
    // let length = 0;
    // existLocation.forEach((value, index) => {
    //   if (value.status === this.Enum.ACTIVE) {
    //     length++;
    //   }
    // });
    // if (length === 1) {
    //   this.setState({
    //     defaultLocation: {
    //       locationId: existLocation[0].locationId,
    //       checked: true
    //     }
    //   });

    //   if (this.props.callBackDefaultLocation) {
    //     this.props.callBackDefaultLocation(existLocation.locationId);
    //   }
    // } else if (length === 0) {
    //   this.setState({
    //     defaultLocation: {
    //       locationId: "",
    //       checked: false
    //     }
    //   });
    // }
  }

  onChangeDefaultLocation(e) {
    this.setState({
      defaultLocation: {
        locationId: e.target.value,
        checked: e.target.checked
      }
    });

    if (this.props.callBackDefaultLocation) {
      this.props.callBackDefaultLocation(e.target.value);
    }
  }

  onChange(checked){
    this.setState({
      disabled : checked === 1 ,
      requiredPassword: checked === 1 ? false : true
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
                label={<this.Translate id="text_first_name" />}
                data={formData.firstName}
                placeholder={this.CATranslate("text_first_name", locale)}
                required={true}
                isAutoFocus={true}
                errorRequired={<this.Translate id="error_require_first_name" />}
                max={100}
                form={form}/>
            </this.Col>
            <this.Col md="6">
              <this.InputText
                name="lastName"
                label={<this.Translate id="text_last_name" />}
                data={formData.lastName}
                placeholder={this.CATranslate("text_last_name", locale)}
                required={true}
                errorRequired={<this.Translate id="error_require_last_name" />}
                max={100}
                form={form}/>
            </this.Col>
            <this.Col md="6">
              <this.Select
                name="gender"
                label={<this.Translate id="text_gender" />}
                placeholder={this.CATranslate("text_gender", locale)}
                dataSource={this.gender}
                defaultValue={formData.gender}
                form={form}/>
            </this.Col>
            <this.Col md="6">
              <this.DatePickers
                name="dob"
                defaultValue={this.Util.formatDatePicker(formData.dob, this.Util.getInitialDateForDOB())}
                label={<this.Translate id="text_date_of_birth" />}
                form={form}/>
            </this.Col>
            <this.Col md="12">
              <this.InputText
                name="phoneNumber" 
                data={formData.phoneNumber}
                placeholder={this.CATranslate("text_phone_number", locale)}
                form={form} 
                label={<this.Translate id="text_phone_number" />}/>
            </this.Col>
            <this.Col md="12">
              <this.InputEmail
                name="email" 
                data={formData.email}
                placeholder={this.CATranslate("text_email_address", locale)}
                form={form} 
                label={<this.Translate id="text_email_address" />}/>
            </this.Col>
            <this.Col md="12">
              <this.InputText
                name="idCard" 
                data={formData.idCard}
                placeholder={this.CATranslate("text_id_card", locale)}
                form={form} 
                label={<this.Translate id="text_id_card" />}/>
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
                label={<this.Translate id="text_photo" />}
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
                data={formData.account ? formData.account.userName : ""}
                label={<this.Translate id="text_user_name" />}
                placeholder={this.CATranslate("text_user_name", locale)}
                errorRequired={<this.Translate id="error_require_user_name" />}
                disabled={formData.account != null && formData.account.userName != null}
                validator={formData.account && formData.account.userName ? null : this.checkIsUserAlreadyExist}
                max={100}
                form={form}/>
            </this.Col>
            <this.Col md="6">
              <this.Select
                name="roleId"
                label={<this.Translate id="text_role" />}
                placeholder={this.CATranslate("text_role", locale)}
                valueKey="id"
                defaultValue={formData.account && formData.account.roles.length > 0 ? formData.account.roles[0].roleId : (this.props.roles.length > 0 ? this.props.roles[0].id : "")}
                dataSource={this.props.roles}
                form={form}/>
            </this.Col>
            <this.Col md="6">
              <this.InputText
                type="password"
                name="password"
                data={formData.password}
                label={<this.Translate id="text_password" />}
                placeholder={this.CATranslate("text_password", locale)}
                required={this.state.requiredPassword}
                disabled={this.state.disabled}
                form={form}/>
            </this.Col>
            {/* <this.Col md="6" className="wrap-switch">
              <this.Switchs
                label={<this.Translate id="text_auto_generate" />}
                name="autogenerate"
                onChange={this.onChange}
                form={form}/>
            </this.Col> */}

            {/* <this.Col md="6">
              <this.DatePickers
                label={<this.Translate id="text_expired_date" />}
                defaultValue={this.Util.formatDatePicker(formData.passwordExpiredAt)}
                name="passwordExpiredAt"
                form={form}/>
            </this.Col>
            <this.Col md="6" className="wrap-switch">
              <this.Switchs
                label={<this.Translate id="text_must_change_password" />}
                name="isMustChangePWNextLogin"
                checked={formData.account != null && formData.account.isMustChangePWNextLogin}
                form={form}/>
            </this.Col>
            <this.Col md="6" className="wrap-switch">
              <this.Switchs
                label={<this.Translate id="text_will_expired" />}
                name="isPasswordExpired"
                checked={formData.account != null && formData.account.isPasswordExpired}
                form={form}
              />
            </this.Col>  */}
          </this.Row>
        </this.TabPane>
        <this.TabPane tab={<this.Translate id="text_location_access"/>} key="3">
          <this.Row>
            <this.Col md="12">
              <this.Table
                dataSource={this.state.locations}
                columns={this.columns}
                locale={{emptyText: <this.Translate id="table_empty_data" />}} />
            </this.Col>
          </this.Row>
        </this.TabPane>
        <this.TabPane tab={<this.Translate id="text_sale_setting"/>} key="4">
          <this.Row>
            <this.Col md="12">
              <this.RadioButton 
                name="isAllowEditPrice"
                defaultValue={1}
                dataSource={this.employeeTypes}
                form={form}
                required/>
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
    password: "",
    autogenerate: "",
    isPasswordExpired: "",
    passwordExpiredAt: (new Util()).getCurrentDate(),
    status: 1,
    account: {
      userName: null,
      isMustChangePWNextLogin: false,
      isPasswordExpired: false,
      roles: [],
      userAccessLocation: []
    }
  }
};