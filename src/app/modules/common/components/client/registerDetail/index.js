import React from "react";
import { Form } from "antd";
import Component from "../../Component";
import ClientAction from "../../../actions/client";
import { fetchAllLanguageSystem } from "../../../actions/actionLanguage";
import { fetchAllCurrencySystem } from "../../../actions/currency";
import { fetchAllBusinessPlanSystem } from "../../../actions/businessPlan";
import { fetchAllBusinessTypeSystem } from "../../../actions/businessType";
import "./index.css";

class ClientRegister extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleBack = this.handleBack.bind(this);
  }

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch(fetchAllLanguageSystem());
    dispatch(fetchAllCurrencySystem());
    dispatch(fetchAllBusinessPlanSystem());
    dispatch(fetchAllBusinessTypeSystem());
  }

  handleBack() {
    const {dispatch, clientRegister} = this.props;
    dispatch(ClientAction.startRegister(clientRegister.response, 1));
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const {
          dispatch,
          clientRegister
        } = this.props;
        const registerData = {...clientRegister.response, ...values};// merge value from step one to current step
        registerData["currencyName"] = "Dollar";
        registerData["currencySymbol"] = "$";
        registerData["currencyValue"] = 100;
        registerData["languageKey"] = "en";
        registerData["languageName"] = "English";
        dispatch(ClientAction.register(registerData, 3));
      }
    });
  }

  render() {
    let {
      currencies,
      languages,
      businessTypes,
      businessPlans
    } = this.props;

    businessPlans = this.Util.renameObjectKey({ name: "name", id: "value" }, businessPlans.list);
    businessTypes = this.Util.renameObjectKey({ name: "name", id: "value" }, businessTypes.list);

    const { form } = this.props;

    return (
      <this.Row>
        <this.Col className="clear-padding wrap-client-login wrap-client-register-detail">
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
              <h6>Please tell us about your store </h6>
            </div>
            <Form onSubmit={this.handleSubmit}>
              <this.InputText
                name="businessName"
                type="text"
                label="Business Name"
                placeholder="Business Name"
                form={form}
              />
              <this.InputText
                name="storeName"
                type="text"
                label="Domain Name"
                notation=".storevein.com"
                placeholder="Domain Name"
                errorRequired="Domain is required."
                form={form}
                max={100}
                required={true}
              />
              <this.Select 
                name="businessType" 
                label="Business Type"
                placeholder="Please select business type"
                form={form}
                required={true}
                errorRequired="Business Type is required."
                dataSource={businessTypes}
              />
              <this.Select 
                name="businessPlan" 
                label="Business Plan"
                placeholder="Please select business plan"
                form={form}
                required={true}
                errorRequired="Please select business plan."
                dataSource={businessPlans}
              />
              <this.Row>
                <this.Col md="6" className="clear-padding-col">
                  <this.InputText
                    name="firstName"
                    type="text"
                    label="First Name"
                    placeholder="First Name"
                    form={form}
                    max={100}
                  />
                </this.Col>
                <this.Col md="6">
                  <this.InputText
                    name="lastName"
                    type="text"
                    label="Last Name"
                    placeholder="Last Name"
                    form={form}
                    max={100}
                  />
                </this.Col>
              </this.Row>
              <this.Row>
                <this.Col md="3" className="clear-padding-col">
                  <this.Select 
                    name="code" 
                    label="Code"
                    defaultValue="+855"
                    form={form}
                    dataSource={[{ name: "+855", value: "+855" }, { name: "+95", value: "+95" }]}
                  />
                </this.Col>
                <this.Col md="9">
                  <this.InputText
                    name="phoneNumber"
                    type="number"
                    label="Phone Number"
                    placeholder="Phone Number"
                    form={form}
                    required={true}
                    errorRequired="Phone Number is required."
                    max={12}
                  />
                </this.Col>
              </this.Row>
              <this.Select 
                name="timeZone" 
                label="Time Zone"
                placeholder="Time Zone"
                form={form}
                dataSource={[{ name: "Time Zone", value: 0 }]}
              />
              <this.Select 
                name="currencyId" 
                label="Currency"
                placeholder="Please select currency"
                form={form}
                dataSource={this.Util.renameObjectKey({ name: "name", id: "value" }, currencies.list)}
              />
              <this.Select 
                name="languageId" 
                label="Language"
                placeholder="Please select language"
                form={form}
                dataSource={this.Util.renameObjectKey({ name: "name", id: "value" }, languages.list)}
              />
              <this.Button htmlType="submit" className="main-signin" type="info">LET'S GO</this.Button>
              {/* <this.Button style={{marginRight: "15px"}} className="main-signin" type="info" onClick={() => this.handleBack()}>BACK</this.Button> */}
            </Form>
          </div>
        </this.Col>
      </this.Row>
    );
  }
}

export default Form.create()(ClientRegister);
