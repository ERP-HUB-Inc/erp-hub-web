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
        dispatch(ClientAction.signinDomain(values.storeName));
      }
    });
  }

  handleKeyDown () {
    this.errorMessage = null;
    this.validateClassStatus = "";
  }

  render() {
    const {signinDomain, form} = this.props;

    // API RESPONSE CORRECT: response: {data: {data: { accessToken: .... }}}
    if (
      signinDomain.response != null
      && ("data" in signinDomain.response)
      && ("data" in signinDomain.response["data"])
      && signinDomain.response["data"]["data"] != null
    ) {

      localStorage.setItem(ConstantAuth.STORE_ACCESS_TOKEN, JSON.stringify(signinDomain.response["data"]["data"]));

      history.push("/signin");

    } else if (signinDomain.error != null) {

      const {dispatch} = this.props;

      const {error} = signinDomain;

      this.errorMessage = "Something wrong.";

      if ("response" in error 
      && error["response"] != null
      && "data" in error["response"]
      ) {

        const {data} = error["response"];

        if (data.error.code === this.HttpCode.NOT_FOUND) {
          this.errorMessage = "Store does not exist.";
        } else if (data.error.code === this.HttpCode.EXPIRED) {
          this.errorMessage = "Store now is expired.";
        } else if (data.error.code === this.HttpCode.INTERNAL_SERVER_ERROR) {
          this.errorMessage = "Please check your connection.";
        }
      } else if (error.message === this.HttpCode.NETWORK_ERROR) {
        this.errorMessage = "Please check your connection.";
      }

      this.validateClassStatus = "has-error";

      dispatch(ClientAction.resetSignInDomain());
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
            <div className={this.validateClassStatus}>
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
                <this.Button loading={signinDomain.submiting} htmlType="submit" type="info">SUBMIT</this.Button>
              </div>
            </div>
          </this.Form>
        </this.LoginLayout>
      </div>
    );
  }
}
