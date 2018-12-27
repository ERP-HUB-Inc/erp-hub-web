import React from "react";
import {Form} from "antd";
import ParentLayout from "../ParentLayout";
import Component from "../../Component";
import ClientAction from "../../../actions/client";
import ClientRegiserDetail from "../../../containers/client/registerDetail";
import RegisterComplete from "../../../containers/client/registerComplete";
import ConfirmRegisterEmail from "../registerComplete/ConfirmRegister";
import ClientService from "../../../services/ClientService";
import EmailAction from "../../../actions/email";
import "./index.css";

class ClientRegister extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      isNotYetCompletedRegister: true
    };
    this.values = null;
    this.validateStatus = {};
    this.componentHadUpdated = false;
    this.nextStepContent = null;
    this.countries = [
      {name: "Global", description: "Language", currency: "USD", code: "global"},
      {name: "Cambodia", description: "Khmer", currency: "KHR", code: "cam"},
      {name: "Myanmar", description: "Burma", currency: "MMX", code: "my"}
    ];
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.checkIsEmailAlreadyExist = this.checkIsEmailAlreadyExist.bind(this);
  }

  componentDidUpdate() {
    const {clientCheckExisting} = this.props;
    if (clientCheckExisting.fetched) {
      if (clientCheckExisting.list != null && clientCheckExisting.fetched) {
        this.validateStatus["help"] = "This email has already taken";
        this.validateStatus["validateStatus"] = "error";
        this.props.dispatch(ClientAction.resetRequest());
      } else if (clientCheckExisting.list == null && clientCheckExisting.fetched){
        this.props.dispatch(ClientAction.startRegister(this.values, 2));
        this.props.dispatch(ClientAction.resetRequest());
      }
    }

    let element = document.getElementById("confirm-register-client");

    if (this.props.clientRegister.submited && this.state.isNotYetCompletedRegister && element) {
      let email = "mornsophannamis@gmail.com";
      if (this.props.clientRegister.response && this.props.clientRegister.response.data) {
        email = this.props.clientRegister.response.data.email;
      }
      element = `<html><head><title></title></head><body>${element.innerHTML}</body></html>`;
      this.props.dispatch(EmailAction.send(`<html><head><title></title></head><body>${element}</body></html>`, email, "Confirm Register"));
      this.setState({isNotYetCompletedRegister: false});
    }
  }

  handleKeyDown () {
    this.validateStatus = {};
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.values = values;
        this.props.dispatch(ClientAction.findClientByColumn("email", values.email));
      }
    });
  }

  checkIsEmailAlreadyExist(rule, value, callback) {
    if (this.Util.isValidEmail(value)) {
      setTimeout(() => {
        ClientService.findClientByColumn({column: "email", value})
          .then((response) => {
            callback("Email already exist");
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
    if (this.props.clientRegister.step === 2) {
      this.nextStepContent = <ClientRegiserDetail />;
    } else if(this.props.clientRegister.step === 3) {
      this.nextStepContent = <RegisterComplete mailTemplate={<ConfirmRegisterEmail data={this.props.clientRegister.response}/>} />;
    }

    return (
      this.props.clientRegister.step === 1 ? 
        <ParentLayout>
          <div className="title">
            <h6>Start Register with Us</h6>
          </div>
          <this.Form onSubmit={this.handleSubmit}>
            <this.InputEmail
              name="email"
              label="Email"
              placeholder="Email"
              required={true}
              isAutoFocus={true}
              errorRequired="Please input your email"
              {...this.validateStatus}
              form={this.props.form}
              handleKeyDown={this.handleKeyDown}/>
            <this.InputPassword
              label="Password"
              confirmLabel="Comfirm Password"
              placeholder="Password"
              confirmPlaceholder="Comfirm Password"
              required={true}
              form={this.props.form} />
            <div>
                
              <this.RadioBox 
                className="main-radio-acc"
                label="Country"
                name="countryId"
                type="radio"
                defaultValue="global"
                form={this.props.form}
                onSelect={this.onSelect}
                onChange={this.onChange}>
                { this.countries.map( (country, key) => 
                  <this.RadioChildBox
                    key={key}
                    title={country.name}
                    language={country.description}
                    currency={country.currency}
                    value={country.code} /> 
                ) 
                }
              </this.RadioBox> 

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
                <this.Button htmlType="submit" type="info" loading={this.props.clientCheckExisting.fetching}>START</this.Button>
              </div>
            </div>
          </this.Form>
        </ParentLayout>  
        :
        this.nextStepContent
    );
  }
}

export default Form.create()(ClientRegister);
