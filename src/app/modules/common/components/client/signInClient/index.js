import React from "react";
import Component from "../../Component";
import history from "../../../router/history";
import Authentication from "../../../constants/authentication";
import ClientAction from "../../../actions/client";
import "./index.css";

export default class ClientSignIn extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.dispatch = this.props.dispatch;
  }
  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.dispatch(ClientAction.signin(values.username, values.password));
      }
    });
  }
  render() {
    const { response, form } = this.props; // form here get from ANT Form
    if (
      response.error != null
      && [404, 601].indexOf(response.error.code)
      && response.submiting == false
    ) {
      this.Message.error("Username or password is not found.");
      this.dispatch(ClientAction.reset());
    }else if(response.response != null) {
      localStorage.setItem(Authentication.ACCESS_TOKEN, JSON.stringify(response.response));
      this.dispatch(ClientAction.reset());
      history.push("/");
    }

    return (
      <this.LoginLayout>
        <div className="storename">Super Store</div>
        <div className="store-email">
          superstore<span className="store-email-url">.storevein.com</span>
        </div>
        <div className="main-field">
          <this.Form onSubmit={this.handleSubmit}>
            <this.InputText
              name="username"
              placeholder="User name"
              type="text"
              label="User Name"
              errorRequired="Username is required."
              required={true}
              form={form}
            />
            <this.InputPassword
              label="Password"
              placeholder="Password"
              required={true}
              checkConfirm={false}
              form={form}
            />
            <div className="signin-button">
              <this.FormGroup>
                <this.Link className="store-link" to="/register">
              it's not my store
                </this.Link>
                <div className="main-signin">
                  <this.Button loading={response.submiting} htmlType="submit" type="info">Sign In</this.Button>
                </div>
              </this.FormGroup>
            </div>
          </this.Form>
        </div>
      </this.LoginLayout>
    );
  }
}
