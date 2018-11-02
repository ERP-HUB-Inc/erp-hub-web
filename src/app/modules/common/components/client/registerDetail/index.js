import React from "react";
import { Form } from "antd";
import Component from "../../Component";
import ParentLayout from "../ParentLayout";
import ClientAction from "../../../actions/client";
import { fetchAllLanguageSystem } from "../../../actions/actionLanguage";
import { fetchAllCurrencySystem } from "../../../actions/currency";
import { fetchAllBusinessPlanSystem } from "../../../actions/businessPlan";
import { fetchAllBusinessTypeSystem } from "../../../actions/businessType";
import "./index.css";

class ClientRegister extends Component {
  constructor(props) {
    super(props);
    this.timeZones = [
      {name: "(GMT+07:00) Asia/Bangkok", value: "Asia/Bangkok"},
      {name: "(UTC+6:30) Asia/Rangoon", value: "Asia/Rangoon"}
    ];
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

    let defaultTimeZone = "Asia/Bangkok";
    if (this.props.clientRegister.response) {
      if (this.props.clientRegister.response.countryId === "my") {
        defaultTimeZone = "Asia/Rangoon";
      }
    }

    return (
      <ParentLayout>
        <Form onSubmit={this.handleSubmit}>
          <this.InputText
            name="businessName"
            type="text"
            label="Business Name"
            placeholder="Business Name"
            form={this.props.form}
            isAutoFocus={true}
            required={true}/>
          <this.InputText
            name="storeName"
            type="text"
            label="Domain Name"
            notation=".storevein.com"
            placeholder="Domain Name"
            errorRequired="Domain is required"
            form={this.props.form}
            max={100}
            required={true}/>
          <this.Select 
            name="businessTypeId" 
            label="Business Type"
            placeholder="Please select business type"
            form={this.props.form}
            required={true}
            errorRequired="Business Type is required"
            defaultValue={businessTypes.list.length > 0 ? businessTypes.list[0].id : ""}
            dataSource={businessTypes.list}
            nameKey="name"
            valueKey="id" />
          <this.Select 
            name="businessPlanId" 
            label="Business Plan"
            placeholder="Please select business plan"
            form={this.props.form}
            required={true}
            errorRequired="Please select business plan"
            defaultValue={businessPlans.list.length > 0 ? businessPlans.list[0].id : ""}
            dataSource={businessPlans.list}
            valueKey="id"
            nameKey="name" />
          <this.Row>
            <this.Col md="6" className="clear-padding-col">
              <this.InputText
                name="firstName"
                type="text"
                label="First Name"
                placeholder="First Name"
                form={this.props.form}
                max={100}/>
            </this.Col>
            <this.Col md="6">
              <this.InputText
                name="lastName"
                type="text"
                label="Last Name"
                placeholder="Last Name"
                form={this.props.form}
                max={100}/>
            </this.Col>
          </this.Row>
          <this.Row>
            <this.Col md="4" className="clear-padding-col">
              <this.Select 
                name="postCode" 
                label="Code"
                defaultValue="+855"
                form={this.props.form}
                dataSource={[{ name: "+855", value: "855" }, { name: "+95", value: "95" }]}/>
            </this.Col>
            <this.Col md="8">
              <this.InputText
                name="phoneNumber"
                label="Phone Number"
                placeholder="Phone Number"
                form={this.props.form}
                required={true}
                errorRequired="Phone number is required"
                max={12}/>
            </this.Col>
          </this.Row>
          <this.Select 
            name="timeZone" 
            label="Time Zone"
            placeholder="Time Zone"
            form={this.props.form}
            defaultValue={defaultTimeZone}
            dataSource={this.timeZones}/>
          <this.Select 
            name="currencyId" 
            label="Currency"
            dataSource={currencies.list}
            defaultValue={currencies.list.length > 0 ? currencies.list[0].id : ""}
            valueKey="id"
            nameKey="name"
            placeholder="Please select currency"
            form={this.props.form}/>
          <this.Select 
            name="languageId" 
            label="Language"
            defaultValue={languages.list.length > 0 ? languages.list[0].id : ""}
            dataSource={languages.list}
            valueKey="id"
            nameKey="name"
            placeholder="Please select language"
            form={this.props.form} />
          <this.Button htmlType="submit" className="main-signin" type="info">LET'S GO</this.Button>
          {/* <this.Button style={{marginRight: "15px"}} className="main-signin" type="info" onClick={() => this.handleBack()}>BACK</this.Button> */}
        </Form>
      </ParentLayout>
    );
  }
}

export default Form.create()(ClientRegister);
