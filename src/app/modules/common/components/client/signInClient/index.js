import React from "react";
import ParentLayout from "../ParentLayout";
import Component from "../../Component";
import history from "../../../router/history";
import ConstantAuth from "../../../constants/authentication";
import ClientAction from "../../../actions/client";

export default class ClientSignIn extends Component {
  constructor(props) {
    super(props);
    this.errorMessage = null;
    this.validateClassStatus = "";
    this.handleSubmit = this.handleSubmit.bind(this);
    this.dispatch = this.props.dispatch;
    this.storeName = "general";
  }

  componentDidMount () {
    if (localStorage.getItem(ConstantAuth.ACCESS_TOKEN)) {
      history.push("/");
    }
    const domainInfo = this.Util.getDomainInfo();
    this.dispatch(ClientAction.findClientByColumn("storeName", domainInfo.subStr));
  }

  componentDidUpdate() {
    const {signinUser, dispatch} = this.props;
    if (
      signinUser.response != null
      && ("data" in signinUser.response)
      && ("data" in signinUser.response["data"])
      && signinUser.response["data"]["data"] != null
    ) {

      localStorage.setItem(ConstantAuth.ACCESS_TOKEN, JSON.stringify(signinUser.response["data"]["data"]));

      const setting = signinUser.response["data"]["data"];
      const languageCode = setting.setting.defaultLanguageCode;

      dispatch(this.changeLanguage(languageCode));

      dispatch(ClientAction.reset());

      if (setting &&
        setting.currentUser &&
        setting.currentUser.roleCode === this.Enum.CASHIER_ROLE) {
        history.push("/transactions/saleorder");
      } else {
        history.push("/");
      }
    } else if (signinUser.error != null) {

      const {error} = signinUser;

      this.errorMessage = "Something wrong.";

      if ("response" in error 
      && error["response"] != null
      && "data" in error["response"]
      ) {

        const {data} = error["response"];

        if (data.error.code === this.HttpCode.NOT_FOUND) {
          this.errorMessage = "User account not exist.";
        } else if (data.error.code === this.HttpCode.DEACTIVE) {
          this.errorMessage = "Your account is now deactive.";
        } else if (data.error.code === this.HttpCode.INVALID_USER_PASSWORD) {
          this.errorMessage = "Invalid user name or password.";
        } else if (data.error.code === this.HttpCode.NO_PERMISSION_ON_STORE) {
          this.errorMessage = "Your account no permission to any store.";
        } else if (data.error.code === this.HttpCode.DEVICE_NOT_FOUND) {
          this.errorMessage = "You are not yet register device.";
          localStorage.removeItem(ConstantAuth.ACCESS_DEVICE);
          history.push("/device");
        } else if (data.error.code === this.HttpCode.INTERNAL_SERVER_ERROR) {
          this.errorMessage = "Please check your connection.";
        }
      } else if (error.message === this.HttpCode.NETWORK_ERROR) {
        this.errorMessage = "Please check your connection.";
      }

      this.validateClassStatus = "has-error";

      dispatch(ClientAction.reset());
    }
  }
  
  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.dispatch(ClientAction.signin(values.username, values.password, this.Util.getDomainInfo().subStr));
      }
    });
  }

  handleKeyDown () {
    this.errorMessage = null;
    this.validateClassStatus = "";
  }

  render() {
    const {signinUser, form, client} = this.props; // form here get from ANT Form
    
    // GET CLIENT DOMAIN
    this.storeName = this.Util.getDomainInfo().subStr;

    if (client.fetching) {
      return (
        <ParentLayout>
          <div className="text-center loading">
            <this.Loading/>
          </div>
        </ParentLayout>
      );
    }

    return (
      <ParentLayout>
        {
          // client.list ?
          true?
            <div>
              <div className="storename text-uppercase">{this.storeName}</div>
              <div className="store-email">
                {this.storeName}<span className="store-email-url">.storevein.com</span>
              </div>
              <div className="main-field">
                <this.Form onSubmit={this.handleSubmit}>
                  <div className={this.validateClassStatus}>
                    <this.InputText
                      name="username"
                      placeholder="User name"
                      type="text"
                      label="User Name"
                      errorRequired="Username is required."
                      isAutoFocus={true}
                      required={true}
                      handleKeyDown={() => this.handleKeyDown()}
                      form={form} />
                    {this.errorMessage != null ? <div className="ant-form-explain">{this.errorMessage}</div> : ""}
                  </div>
                  <this.FormGroup>
                    <this.InputPassword
                      label="Password"
                      placeholder="Password"
                      required={true}
                      checkConfirm={false}
                      form={form} />
                  </this.FormGroup>
                 
                  <div className="main-signin">
                    <this.Button loading={signinUser.submiting} htmlType="submit" type="info">Sign In</this.Button>
                  </div>
                </this.Form>
              </div>
            </div>
            :
            <div className="text-center">
              <div style={{fontSize: "14pt", fontWeight: "500", color: "#4D4F5C"}}>
                Sorry!!! there is no retailer found
              </div>
              <div style={{fontSize: "8pt", color: "#000000", marginTop: 10}}>
                We don't have a registered retailer for this domain just yet...
              </div>
              <div style={{marginTop: 20}}>
                <span className="icon-store" style={{fontSize: "100pt", color: "#9A9A9A"}}></span>
              </div>
            </div>
        }
      </ParentLayout>
    );
  }
}
