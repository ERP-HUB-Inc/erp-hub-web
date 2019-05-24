import React from "react";
import ParentLayout from "../ParentLayout";
import Component from "../../Component";
import history from "../../../router/history";
import DeviceAction from "../../../../pos/action/settings/device";
import Constant from "../../../../pos/constants/settings/device";
import ConstantAuth from "../../../constants/authentication";
import "./index.css";

export default class SignInStore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorDeviceNumber: {}
    };
    this.storeName = "";
    this.errorMessage = null;
    this.validateClassStatus = "";
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount () {
    if (localStorage.getItem(ConstantAuth.ACCESS_TOKEN)) {
      history.push("/");
    }
  }

  componentDidUpdate() {
    if (this.props.update.error) {
      const {error} = this.props.update;
      if (error
      && "data" in error 
      && error["data"]
      && "error" in error["data"]
      ) {
        if (error["data"]["error"].code === this.HttpCode.DEVICE_NOT_FOUND) {
          this.setState({
            errorDeviceNumber: {
              help: "Invalid device number",
              validateStatus: "error"
            }
          });
        }

        if (error["data"]["error"].code === this.HttpCode.DEVICE_NOT_AVAILABLE) {
          this.setState({
            errorDeviceNumber: {
              help: "Device number is not available",
              validateStatus: "error"
            }
          });
        }
      }
      this.props.dispatch(DeviceAction.reset(Constant.RESET_UPDATE));
    } else if (this.props.update && this.props.update.response && this.props.update.response.data) {
      localStorage.setItem(ConstantAuth.ACCESS_DEVICE, this.props.update.response.data.code);
      window.location.reload();
    }
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch(DeviceAction.update(values.deviceName, values.deviceNumber, this.Util.getDomainInfo().subStr));
      }
    });
  }

  handleKeyDown () {
    this.errorMessage = null;
    this.validateClassStatus = "";
  }

  render() {

    return (
      <ParentLayout
        classBlogLogin="clear-padding wrap-client-login wrap-client-sign-in-store"
        clasBlogLogo="wrap-blog-logo">
        <div className="title">
          <h6>Register device number </h6>
        </div>
        <this.Form onSubmit={this.handleSubmit}>
          <div className={this.validateClassStatus}>
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
            {this.errorMessage != null ? <div className="ant-form-explain">{this.errorMessage}</div> : "" }
            <div className="main-signin" style={{marginTop: 15}}>
              <this.Button loading={this.props.update.updating} htmlType="submit" type="info">SUBMIT</this.Button>
            </div>
          </div>
        </this.Form>
      </ParentLayout>
    );
  }
}
