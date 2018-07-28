import React from "react";
import { Form } from "antd";
import Component from "../../Component";
import ClientAction from "../../../actions/client";
import ClientRegiserDetail from "../../../containers/client/registerDetail";
import RegisterComplete from "../../../containers/client/registerComplete";
import ClientService from "../../../services/ClientService";
import "./index.css";

class ClientRegister extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.checkIsEmailAlreadyExist = this.checkIsEmailAlreadyExist.bind(this);
  }
  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const {dispatch} = this.props;
        dispatch(ClientAction.startRegister(values, 2));
      }
    });
  }

  checkIsEmailAlreadyExist(rule, value, callback) {
    if (this.Util.isValidEmail(value)) {
      setTimeout(function () {
        ClientService.findClientByColumn({column: "email", value})
          .then(function (response) {
            callback("Email already exist.");
          })
          .catch(function (error) {
            callback();
          });
      }, 5000);
    } else {
      callback();
    }
  }

  render() {
    let nextStepContent = "";
    if (this.props.clientRegister.step == 2) {
      nextStepContent = <ClientRegiserDetail/>;
    } else if(this.props.clientRegister.step == 3) {
      nextStepContent = <RegisterComplete/>;
    }

    const { form } = this.props;

    return (
      <div>
        { 
          this.props.clientRegister.step == 1 ? 
            <this.Row>
              <this.Col className="clear-padding wrap-client-login wrap-client-register">
                <div className="wrap-blog-logo">
                  <div className="blog-logo text-center">
                    <div className="inner-logo">
                      <div className="logo">
                        <span className="icon-logo"></span>
                      </div>
                      <div className="text">
                        <strong>store</strong>Vein
                      </div>
                    </div>
                  </div>
                </div>
                <div className="blog-register">
                  <div className="wrap-help"><span className="icon-help icon-padding-right"></span><span className="help">Help</span></div>
                  <div className="header text-right">
                    <div className="title"><strong>store</strong>Vein</div>
                    <div className="back-office">Backoffice</div>
                  </div>
                  <div className="title">
                    <h6>Start Register with Us</h6>
                  </div>
                  <Form onSubmit={this.handleSubmit}>
                    <this.InputEmail
                      name="email"
                      label="Email"
                      placeholder="Email"
                      required={true}
                      form={form}
                      initialValue="ppp@gmail.com"
                      validator={this.checkIsEmailAlreadyExist}
                    />
                    <this.InputPassword
                      label="Password"
                      confirmLabel="Comfirm Password"
                      placeholder="Password"
                      confirmPlaceholder="Comfirm Password"
                      required={true}
                      form={form}
                    />
                    <div>
                      <this.FormGroup>
                        <this.RadioRegisterGroup 
                          label="Country"
                          name="countryId" 
                          type="radio"
                          defaultValue={2}
                          required={true}
                          form={form}
                        >
                          <this.RadioRegister title="Global" language="English" currency="USD" value="1"/>
                          <this.RadioRegister title="Cambodia" language="Khmer" currency="KHR"  value="2" />
                          <this.RadioRegister title="Myanmar" language="Burma" currency="MMX"  value="3" />
                        </this.RadioRegisterGroup> 
                      </this.FormGroup>

                      <this.Link to="/signin">
                        <span className="have-acc">Have an account?</span> <span className="store-link">sign in </span>
                      </this.Link>
                      <div className="main-signin">
                        <this.Button htmlType="submit" type="info">START</this.Button>
                      </div>
                    </div>
                  </Form>
                </div>
              </this.Col>
            </this.Row>
            :
            nextStepContent
        }
      </div>
    );
  }
}

export default Form.create()(ClientRegister);
