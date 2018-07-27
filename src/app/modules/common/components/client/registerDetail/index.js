import React from "react";
import Component from "../../Component";
import ClientAction from "../../../actions/client";
import { fetchAllLanguageSystem } from "../../../actions/actionLanguage";
import { fetchAllCurrencySystem } from "../../../actions/currency";
import { fetchAllBusinessPlanSystem } from "../../../actions/businessPlan";
import { fetchAllBusinessTypeSystem } from "../../../actions/businessType";
import "./index.css";

export default class ClientRegister extends Component {
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

  handleSubmit() {
    const {dispatch, clientRegisterFormDetail, clientRegister} = this.props;
    const values = {...clientRegister.response, ...clientRegisterFormDetail.values};// merge value from step one to current step
    values["currencyName"] = "Dollar";
    values["currencySymbol"] = "$";
    values["currencyValue"] = 100;
    values["languageKey"] = "en";
    values["languageName"] = "English";
    dispatch(ClientAction.register(values, 3));
  }

  handleBack() {
    const {dispatch, clientRegister} = this.props;
    dispatch(ClientAction.startRegister(clientRegister.response, 1));
  }

  render() {
    let {currencies, languages, businessTypes, businessPlans} = this.props;
    businessPlans = this.Util.renameObjectKey({ name: "name", id: "value" }, businessPlans.list);
    businessTypes = this.Util.renameObjectKey({ name: "name", id: "value" }, businessTypes.list);
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
            <this.InputText
              name="businessName"
              type="text"
              label="Business Name"
              placeholder="Super Store"
              required={true}
            />
            <this.InputText
              name="storeName"
              type="text"
              label="Domain Name"
              notation=".storevein.com"
              placeholder="Domain Name"
              required={true}
            />
            <this.Select 
              name="businessType" 
              label="Business Type"
              defaultValue="Please select business type"
              placeholder="Business Type"
              dataSource={businessTypes}
            />
            <this.Select 
              name="businessPlan" 
              label="Business Plan"
              defaultValue="Please select business plan"
              placeholder="Business Plan"
              dataSource={businessPlans}
            />
            <this.Row>
              <this.Col md="6" className="clear-padding-col">
                <this.InputText
                  name="firstName"
                  type="text"
                  label="First Name"
                  placeholder="First Name"
                />
              </this.Col>
              <this.Col md="6">
                <this.InputText
                  name="lastName"
                  type="text"
                  label="Last Name"
                  placeholder="Last Name"
                />
              </this.Col>
            </this.Row>
            <this.Row>
              <this.Col md="3" className="clear-padding-col">
                <this.InputText
                  name="code"
                  type="text"
                  label="Code"
                  placeholder="Code"
                />
              </this.Col>
              <this.Col md="9">
                <this.InputText
                  name="phoneNumber"
                  type="number"
                  label="Phone Number"
                  placeholder="Phone Number"
                />
              </this.Col>
            </this.Row>
            <this.Select 
              name="timeZone" 
              label="Time Zone"
              defaultValue="Time Zone"
              placeholder="Status"
              dataSource={[{ name: "Time Zone", value: 0 }]}
            />
            <this.Select 
              name="currencyId" 
              label="Currency"
              defaultValue="Please select currency"
              placeholder="Currency"
              dataSource={this.Util.renameObjectKey({ name: "name", id: "value" }, currencies.list)}
            />
            <this.Select 
              name="languageId" 
              label="Language"
              defaultValue="Please select language"
              placeholder="Language"
              dataSource={this.Util.renameObjectKey({ name: "name", id: "value" }, languages.list)}
            />
            <this.Button className="main-signin" type="info" onClick={() => this.handleSubmit()}>LET'S GO</this.Button>
            {/* <this.Button style={{marginRight: "15px"}} className="main-signin" type="info" onClick={() => this.handleBack()}>BACK</this.Button> */}
          </div>
        </this.Col>
      </this.Row>
    );
  }
}
