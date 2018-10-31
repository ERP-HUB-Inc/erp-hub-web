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
    this.errorMessageEmail = null;
    this.values = null;
    this.validateClassStatusEmail = "";
    this.countries = [
      {name: "Global", description: "language", currency: "USD"},
      {name: "Cambodia", description: "Khmer", currency: "KHR"},
      {name: "Myanmar", description: "Burma", currency: "MMX"}
    ];
    this.handleSubmit = this.handleSubmit.bind(this);
    this.checkIsEmailAlreadyExist = this.checkIsEmailAlreadyExist.bind(this);
  }

  handleKeyDown () {
    this.errorMessageEmail = null;
    this.validateClassStatusEmail = "";
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const {dispatch} = this.props;
        this.values = values;
        dispatch(ClientAction.findClientByColumn("email", values.email));
      }
    });
  }

  checkIsEmailAlreadyExist(rule, value, callback) {
    if (this.Util.isValidEmail(value)) {
      setTimeout(() => {
        ClientService.findClientByColumn({column: "email", value})
          .then((response) => {
            callback("Email already exist.");
          })
          .catch((error) => {
            callback();
          });
      }, 5000);
    } else {
      callback();
    }
  }

  render() {
    let nextStepContent = "";
    if (this.props.clientRegister.step === 2) {
      nextStepContent = <ClientRegiserDetail/>;
    } else if(this.props.clientRegister.step === 3) {
      nextStepContent = <RegisterComplete/>;
    }

    const { clientCheckExisting, dispatch, form } = this.props;

    if (clientCheckExisting.list != null && clientCheckExisting.fetched) {
      this.errorMessageEmail = "This email has already taken.";
      this.validateClassStatusEmail = "has-error";
      dispatch(ClientAction.resetRequest());
    } else if (clientCheckExisting.list == null && clientCheckExisting.fetched){
      dispatch(ClientAction.startRegister(this.values, 2));
      dispatch(ClientAction.resetRequest());
    }

    return (
      <div>
        { 
          this.props.clientRegister.step === 1 ? 
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
                  {/* <div className="wrap-help">
                    <span className="icon-help icon-padding-right"></span>
                    <span className="help">Help</span>
                  </div> */}
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
                      isAutoFocus={true}
                      errorRequired="Please input your email."
                      form={form}
                      validator={this.checkIsEmailAlreadyExist}
                      handleKeyDown={this.handleKeyDown}/>
                    <this.InputPassword
                      label="Password"
                      confirmLabel="Comfirm Password"
                      placeholder="Password"
                      confirmPlaceholder="Comfirm Password"
                      required={true}
                      form={form} />
                    <div>
                      <this.FormGroup>
                        <this.RadioBox 
                          className="main-radio-acc"
                          label="Country"
                          name="countryId"
                          type="radio"
                          defaultValue={0}
                          form={form}
                          onSelect={this.onSelect}
                          onChange={this.onChange}
                        >
                          { this.countries.map( (country, key) => 
                            <this.RadioChildBox
                              key={key}
                              title={country.name}
                              language={country.description}
                              currency={country.currency}
                              value={key} /> 
                          ) 
                          }
                        </this.RadioBox> 
                      </this.FormGroup>

                      {/* <this.FormGroup>
                        <this.RadioBox 
                          label="Country"
                          name="countryId" 
                          type="radio"
                          defaultValue={2}
                          required={true}
                          form={form}
                        >
                          <this.RadioNormal title="Global" language="English" currency="USD" value="1" form={form} />
                          <this.RadioNormal title="Cambodia" language="Khmer" currency="KHR"  value="2" form={form} />
                          <this.RadioNormal title="Myanmar" language="Burma" currency="MMX"  value="3" form={form} />
                        </this.RadioBox> 
                      </this.FormGroup> */}

                      <this.Link to="/signin">
                        <span className="have-acc">Have an account?</span> <span className="store-link">sign in </span>
                      </this.Link>
                      <div className="main-signin">
                        <this.Button htmlType="submit" type="info" loading={clientCheckExisting.fetching}>START</this.Button>
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
