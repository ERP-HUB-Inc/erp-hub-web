import React from "react";
import { Form } from "antd";
import Component from "../../Component";
import "./index.css";

class ClientSignIn extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        
      }
    });
  }
  render() {
    const { form } = this.props; // form here get from ANT Form
    return (
      <this.LoginLayout>
        <div className="storename">Super Store</div>
        <div className="store-email">
          superstore<span className="store-email-url">.storevein.com</span>
        </div>
        <div className="main-field">
          <Form onSubmit={this.handleSubmit}>
            <this.InputText
              name="username"
              placeholder="User name"
              type="text"
              label="User Name"
              errorRequired="Username is required."
              required={true}
              form={form}
            />
            <this.InputText
              name="password"
              placeholder="Password"
              type="password"
              label="Password"
              errorRequired="Password is required."
              required={true}
              form={form}
            />
            <div className="signin-button">
              <this.FormGroup>
                <this.Link className="store-link" to="/signin-register">
              it's not my store
                </this.Link>
                <div className="main-signin">
                  <this.Button htmlType="submit" type="info">Sign In</this.Button>
                </div>
              </this.FormGroup>
            </div>
          </Form>
        </div>
      </this.LoginLayout>
    );
  }
}

export default Form.create()(ClientSignIn);