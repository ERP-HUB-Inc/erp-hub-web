import React from "react";
import Component from "../../Component";
import history from "../../../router/history";
import ConstantAuth from "../../../constants/authentication";
import ClientAction from "../../../actions/client";
import "./index.css";

export default class ClientSignIn extends Component {
  constructor(props) {
    super(props);
    this.errorMessage = null;
    this.validateClassStatus = "";
    this.handleSubmit = this.handleSubmit.bind(this);
    this.dispatch = this.props.dispatch;
    this.storeName = "general";
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.dispatch(ClientAction.signin(values.username, values.password));
      }
    });
  }

  handleKeyDown () {
    this.errorMessage = null;
    this.validateClassStatus = "";
  }

  render() {
    const { signinUser, signinDomain, form } = this.props; // form here get from ANT Form
    
    if (
      signinUser.response != null
      && ("data" in signinUser.response)
      && ("data" in signinUser.response["data"])
      && signinUser.response["data"]["data"] != null
    ) {

      localStorage.setItem(ConstantAuth.ACCESS_TOKEN, JSON.stringify(signinUser.response["data"]["data"]));

      this.dispatch(ClientAction.reset());

      history.push("/");

    } else if (signinUser.error != null) {

      const {dispatch} = this.props;

      const {error} = signinUser;

      this.errorMessage = "Something wrong.";

      if ("response" in error 
      && error["response"] != null
      && "data" in error["response"]
      ) {

        const {data} = error["response"];

        if (data.error.code == this.HttpCode.NOT_FOUND) {
          this.errorMessage = "User account not exist.";
        } else if (data.error.code == this.HttpCode.DEACTIVE) {
          this.errorMessage = "Your account is now deactive.";
        } else if (data.error.code == this.HttpCode.INVALID_USER_PASSWORD) {
          this.errorMessage = "Invalid user name or password.";
        } else if (data.error.code == this.HttpCode.NO_PERMISSION_ON_STORE) {
          this.errorMessage = "Your account no permission to any store.";
        } else if (data.error.code == this.HttpCode.INTERNAL_SERVER_ERROR) {
          this.errorMessage = "Please check your connection.";
        }
      } else if (error.message == this.HttpCode.NETWORK_ERROR) {
        this.errorMessage = "Please check your connection.";
      }

      this.validateClassStatus = "has-error";

      dispatch(ClientAction.reset());
    }

    // GET CLIENT DOMAIN
    if (signinDomain.submited && signinDomain.response != null) {
      this.storeName = signinDomain.response.data.user.storeName;
    }

    return (
      <this.LoginLayout>
        <div className="storename text-uppercase">{this.storeName}</div>
        <div className="store-email">
          {this.storeName}<span className="store-email-url">.storevein.com</span>
        </div>
        <div className="main-field">
          <this.Form onSubmit={this.handleSubmit}>
            <this.FormGroup className={this.validateClassStatus}>
              <this.InputText
                name="username"
                placeholder="User name"
                type="text"
                label="User Name"
                errorRequired="Username is required."
                required={true}
                handleKeyDown={() => this.handleKeyDown()}
                form={form}
              />
              {
                this.errorMessage != null ? <div className="ant-form-explain">{this.errorMessage}</div> : "" 
              }
            </this.FormGroup>
            <this.FormGroup>
              <this.InputPassword
                label="Password"
                placeholder="Password"
                required={true}
                checkConfirm={false}
                form={form}
              />
            </this.FormGroup>
            <div className="signin-button">
              <this.FormGroup>
                <this.Link className="store-link" to="/register">
                  it's not my store
                </this.Link>
                <div className="main-signin">
                  <this.Button loading={signinUser.submiting} htmlType="submit" type="info">Sign In</this.Button>
                </div>
              </this.FormGroup>
            </div>
          </this.Form>
        </div>
      </this.LoginLayout>
    );
  }
}
