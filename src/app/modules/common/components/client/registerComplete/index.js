import React from "react";
import ParentLayout from "../ParentLayout";
import Component from "../../Component";
import "./index.css";

export default class RegisterComplete extends Component {
  componentDidMount() {
    setTimeout(this.leaveToLandingPage(), 8000);
  }

  leaveToLandingPage() {
    window.location = "http://www.storevein.com";
  }
  render() {
    const {clientRegister} = this.props;
    return (
      clientRegister.submited ? 
        <ParentLayout>
          <div className="title">
            <h6>Thank you for your starting</h6>
          </div>
          <div className="register-complete-layout">
            Please waiting for 48 hours (Working hours), we will 
            contact you back and will let you know how running your 
            business in storeVein platform.
          </div>
          <div className="register-complete-layout">
              Your contact information
          </div>

          <ul className="main-register-complete">
            <li>Business Name:</li>
            <li><b>{clientRegister.response.data.businessName}</b></li>
          </ul>
          <ul className="main-register-complete">
            <li>Private URL:</li>
            <li><b>{clientRegister.response.data.storeName}.storevein.com</b></li>
          </ul>
          <ul className="main-register-complete">
            <li>Your Full Name:</li>
            <li><b>{`${clientRegister.response.data.firstName} ${clientRegister.response.data.lastName}`}</b></li>
          </ul>
          <ul className="main-register-complete">
            <li>Email Address:</li>
            <li><b>{clientRegister.response.data.email}</b></li>
          </ul>
          <ul className="main-register-complete">
            <li>Phone Number:</li>
            <li><b>{clientRegister.response.data.storeName}</b></li>
          </ul>
          <this.clearFloating />
          <div className="main-register-success">
            <this.Button type="info">THANKS</this.Button>
          </div>
        </ParentLayout>
        :
        ""
    );
  }
}
