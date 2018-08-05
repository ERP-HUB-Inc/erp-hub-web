import React from "react";
import Component from "../../Component";
import history from "../../../router/history";
import ClientAction from "../../../actions/client";
import ConstantAuth from "../../../constants/authentication";
import "./index.css";

export default class SignInStore extends Component {
  constructor(props) {
    super(props);
    this.errorMessage = null;
    this.validateClassStatus = "";
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const {dispatch} = this.props;
        localStorage.removeItem(ConstantAuth.STORE_NAME);
        localStorage.setItem(ConstantAuth.STORE_NAME, values.storeName);
        dispatch(ClientAction.signinDomain(values.storeName));
      }
    });
  }

  handleKeyDown () {
    this.errorMessage = null;
    this.validateClassStatus = "";
    localStorage.removeItem(ConstantAuth.STORE_NAME);
  }

  render() {
    const {response, form} = this.props;
    if (response.response != null) {
      localStorage.setItem(ConstantAuth.STORE_ACCESS_TOKEN, JSON.stringify(response.response));
      history.push("/signin");
    } else if (response.error != null) {
      if (response.error.code == 404) {
        const {dispatch} = this.props;
        this.errorMessage = "Store does not exist.";
        this.validateClassStatus = "has-error";
        dispatch(ClientAction.resetSignInDomain());
      }
    }
    return (
      <div>
        <this.LoginLayout
          classBlogLogin="clear-padding wrap-client-login wrap-client-sign-in-store"
          clasBlogLogo="wrap-blog-signin-logo wrap-blog-logo"
        >
          <div className="title">
            <h6>Find Your store Name </h6>
          </div>
          <this.Form onSubmit={this.handleSubmit}>
            <this.FormGroup className={this.validateClassStatus}>
              <this.InputText
                name="storeName"
                placeholder="Store name"
                type="text"
                label="Store Name"
                notation=".storevien.com"
                className="ant-input"
                required={true}
                errorRequired="Please enter your store address."
                validateClassStatus={this.validateClassStatus}
                handleKeyDown={() => this.handleKeyDown()}
                form={form}
              />
              {
                this.errorMessage != null ? <div className="ant-form-explain">{this.errorMessage}</div> : "" 
              }
              <div className="main-signin">
                <this.Button loading={response.submiting} htmlType="submit" type="info">SUBMIT</this.Button>
              </div>
            </this.FormGroup>
          </this.Form>
        </this.LoginLayout>
      </div>
    );
  }
}
