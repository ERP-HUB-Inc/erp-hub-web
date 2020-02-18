import React from "react";
import DeviceAction from "../../../../../pos/action/settings/device";
import ConstantAuth from "../../../../../../modules/common/constants/authentication";
import Modal from "../../../../../common/components/shares/Modal";

export default class DeviceNumber extends Modal {
  constructor(props) {
    super(props);
    this.title = "register device";
    this.errorDeviceNumber = "";
    this.storeName = "";
    this.errorMessage = null;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
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
                this.errorDeviceNumber = {
                  help: "Invalid device number",
                  validateStatus: "error"
                }
        }

        if (error["data"]["error"].code === this.HttpCode.DEVICE_NOT_AVAILABLE) {
            this.errorDeviceNumber = {
                help: "Device number is not available",
                validateStatus: "error"
            }
        }
      }
        //   this.props.dispatch(DeviceAction.reset(Constant.RESET_UPDATE));
    } else if (this.props.updateDeviceNumber && this.props.updateDeviceNumber.response && this.props.updateDeviceNumber.response.data) {
        localStorage.setItem(ConstantAuth.ACCESS_DEVICE, this.props.updateDeviceNumber.response.data.code);
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
        this.props.dispatch(DeviceAction.update(values.deviceName,values.deviceNumber,this.Util.getDomainInfo().subStr));
      } 
    });
  }

  handleKeyDown () {
    this.validateClassStatus = "";
  }

  
  render() {
    if (this.props.updateDeviceNumber.showForm) {
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
              {...this.errorDeviceNumber}
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