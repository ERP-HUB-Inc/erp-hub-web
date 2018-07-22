import React from "react";
import { reduxForm } from "redux-form";
import Component from "../../Component";
import "./index.css";

class ClientRegister extends Component {
  render() {
    return (
      <div>
        <this.LoginLayout>
          <div className="title">
            <h6>Start Register with Us</h6>
          </div>
          <this.FormGroup>
            <this.Field
              name="username"
              type="text"
              label="Email"
              component={ this.AnimationInput }
            />
          </this.FormGroup>
          <this.FormGroup>
            <this.Field
              name="username"
              type="text"
              label="Password"
              component={ this.AnimationInput }
            />
          </this.FormGroup>
          <this.FormGroup>
            <this.Field
              name="Username"
              type="text"
              label="Comfirm Password"
              component={ this.AnimationInput }
            />
            <this.RadioRegister />
          </this.FormGroup>
        </this.LoginLayout>
      </div>
    );
  }
}

export default reduxForm({
  form: "clientLogin"
})(ClientRegister);