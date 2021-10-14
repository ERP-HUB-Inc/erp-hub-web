import React from "react";
import DeviceAction from "../../../../../pos/action/settings/device";
import Constant from "../../../../../pos/constants/settings/device";
import ConstantAuth from "../../../../../../modules/common/constants/authentication";
import Modal from "../../../../../common/components/shares/Modal";

export default class DeviceNumber extends Modal {
  constructor(props) {
    super(props);
    this.state = {
      errorDeviceNumber: {}
    };
    this.title = "register device";
    this.storeName = "";
    this.errorMessage = null;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidUpdate() {
    if (this.props.updateDeviceNumber.error) {
      const {error} = this.props.updateDeviceNumber;
      if (error
      && "data" in error 
      && error["data"]
      && "error" in error["data"]
      ) {
        if (error["data"]["error"].code === this.HttpCode.DEVICE_NOT_FOUND) {
          this.setState({errorDeviceNumber: {
            help: "Invalid device number",
            validateStatus: "error"
          }});
        }

        if (error["data"]["error"].code === this.HttpCode.DEVICE_NOT_AVAILABLE) {
            this.setState({
              errorDeviceNumber: {
                help: "Device number is not available",
                validateStatus: "error"
            }});
        }
      }

      this.props.dispatch(DeviceAction.reset(Constant.RESET_UPDATE));

    } else if (this.props.updateDeviceNumber && this.props.updateDeviceNumber.response && this.props.updateDeviceNumber.response.data) {
        const deviceNumber = this.props.updateDeviceNumber.response.data.code;
        localStorage.setItem(ConstantAuth.ACCESS_DEVICE, deviceNumber);

        const accessTokenObj = JSON.parse(localStorage.getItem(ConstantAuth.ACCESS_TOKEN));
        accessTokenObj["setting"]["deviceNumber"] = deviceNumber;
        localStorage.setItem(ConstantAuth.ACCESS_TOKEN, JSON.stringify(accessTokenObj));
        window.location.reload();
    }
  }

  renderCrudAction(){
    return(
    <div className="ant-modal-footer">
        <this.Button htmlType="submit" loading={this.submitLoading} className="info">
          <span className="icon-save icon-padding-right"></span><span id="btnModalSave">SUBMIT</span>
        </this.Button>
    </div>);
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch(DeviceAction.update(values.deviceName,values.deviceNumber,this.Util.getDomainInfo().subStr, this.Util.getAccessToken()));
      } 
    });
  }

  handleKeyDown = () => {
    this.setState({
      validateClassStatus: {}
    });
  }

  handleCancel() {
    this.props.dispatch(DeviceAction.reset(Constant.FULL_RESET_CHECK_DEVICE));
  }
  
  render() {
    this.submitLoading = this.props.updateDeviceNumber.updating;
    if (this.props.checkDevice.showForm) {
      this.content = (
        <div>
           <this.InputText
              name="deviceName"
              placeholder="Name"
              type="text"
              label="Name"
              required={true}
              isAutoFocus={true}
              errorRequired="Please enter device name"
              form={this.props.form}/>
          <this.InputText
              name="deviceNumber"
              placeholder="Device Number"
              type="text"
              label="Device Number"
              required={true}
              {...this.state.errorDeviceNumber}
              errorRequired="Please enter device number to grant access"
              validateClassStatus={this.validateClassStatus}
              handleKeyDown={this.handleKeyDown}
              form={this.props.form} />
        </div>
      );
      return super.render();
    } else {
      return <div/>;
    }
  }
}