import React from "react";
import Element from "../../Component";
import "./index.css";
import StoreAccountAction from "../../../action/settings/storeAccount";
import menuSource from "../../../../common/components/layout/SiderBar/datasource";

const currentPath = window.location.pathname;

const statusDataSource = [
  {
    name: "Active",
    value: "dd"
  },
  {
    name: "Deactive",
    value: "dd"
  }
];

const RadioData = [
  "Pay as your business growth", 
  "Pay on your 5 stores package",
  "Pay on your 10 stores package",
  "Pay on your 15 stores package"
];

export default class StoreAccountList extends Element {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e){
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values["id"] = "00000001-0001-2018-0001-00000001";
        values["status"] = "1";
        this.dispatch(StoreAccountAction.update(values));
      }
    });
    
  }

  componentDidMount(){
    this.dispatch(StoreAccountAction.fetch("00000001-0001-2018-0001-00000001"));
  }

  render() {
    const { form,storeAccount,response } = this.props;
    console.log(response);
    if(response.updated == true){
      this.Message.success("Success Updated.");
      this.dispatch(StoreAccountAction.reset());
    }

    const languages = this.Util.renameObjectKey({ name: "name", id: "value" }, [storeAccount.language]);
    const currency = this.Util.renameObjectKey({ name: "name", id: "value" }, [storeAccount.currency]);

    console.log("language",languages);

    return (
      <div>
        <div className="breadcrumb">
          <ul className="list-unstyled">
            <li>
              <this.Link to="/"><span className="icon-home"></span></this.Link>
            </li>
            <li className="fast-nav text-uppercase">
              <this.Link to="/">SETTINGS</this.Link>
            </li>
            {
              menuSource["settings"]["subItems"].map((value, index) =>
                <li className={(currentPath==value["route"] ? "active" : "") + " fast-nav"} key={index}>
                  <this.Link to={value["route"]}>{value["title"]}</this.Link>
                </li>
              )
            }
          </ul>
        </div>
        
        <this.Form onSubmit={this.handleSubmit}>
          <div className="main-layout main-store-account">
          
            <this.Row>
              <this.Col md="4">   
                <div>
                  <div className="general">
                    <h6>General</h6>
                  </div>
                  <this.InputText name="businessName" data={ storeAccount.businessName }  label="Business Name" placeholder="Super Store"  form={form} required={true}/>
                  <this.InputText name="storeName"  data={ storeAccount.storeName } label="Private URL" notation=".storevein.com"  form={form} placeholder="Super Store"/>
                  <this.InputText name="name" label="Country" notation=".storevein.com"  form={form} placeholder="Global"/>
                  <this.Select name="status" dataSource={ languages } label="Language" placeholder="Please select status"  form={form} />
                  <this.Select name="status" dataSource={ currency } label="Default Currency" placeholder="Please select status"  form={form} />
                  <this.Select name="status" label="Timezone" placeholder="Please select status"  form={form} dataSource={statusDataSource} />
                  <this.Select name="status" label="Default Tax" placeholder="Please select status"  form={form} dataSource={statusDataSource} />
                  <div className="general">
                    <h6>ACCOUNT</h6>
                  </div>
                  <this.InputText name="name" label="Email Address"  form={form} placeholder="Super Store"/>
                  <this.InputText name="name" label="Exist Password"  form={form} notation=".storevein.com" placeholder="Super Store"/>
                  <this.InputText name="name" label="New password"  form={form} notation=".storevein.com" placeholder="Super Store"/>
                  <this.InputText name="name" label="Confirm password"  form={form} notation=".storevein.com" placeholder="Global"/>
                </div>
              </this.Col>

              <this.Col md="4">  
                <div>
                  <div className="general">
                    <h6>CONTACT</h6>
                  </div>
                  <this.Row>
                    <this.Col md="6">
                      <this.InputText data={ storeAccount.firstName } name="firstName" label="First name"  form={form} placeholder="Peter"/>
                    </this.Col>
                    <this.Col md="6">
                      <this.InputText data={ storeAccount.lastName } name="lastName" label="Last name"  form={form} placeholder="John"/>
                    </this.Col>
                  </this.Row>
                  <this.InputEmail data={ storeAccount.email } name="email" label="Email Address" form={form} placeholder="John"/>
                  <this.InputNumber data={ storeAccount.phoneNumber } name="phoneNumber" label="Phone number" form={form} placeholder="+855 12 345 678" />
                  <this.InputText data={ storeAccount.address } name="address" label="Address" form={form} placeholder=""/>
                  <this.InputText data={ storeAccount.street } name="street" label="Street" form={form} placeholder=""/>
                  <this.InputText data={ storeAccount.city } name="city" label="City" form={form} notation=".storevein.com" placeholder="Global"/>
                  <this.InputText data={ storeAccount.postCode } name="code" label="Post code"  form={form} notation=".storevein.com" placeholder="Global"/>
                  <div className="general">
                    <h6>Setting</h6>
                  </div>
                  <this.Select name="status" label="Price tag format"  form={form}  dataSource={statusDataSource} />
                  <this.Select name="status" label="Auto generate product code"  form={form}  dataSource={statusDataSource} />
                  <this.Select name="status" label="Start sequence number"  form={form}  dataSource={statusDataSource} />
                  <this.Select name="status" label="Display price"  form={form} placeholder="Tax Exclusive" dataSource={statusDataSource} />
                </div>
              </this.Col>

              <this.Col md="4">  
                <div>
                  <div className="general">
                    <h6>Billing</h6>
                  </div>
                  <this.DatePickers name="register_date" form={form} label="Register date"/>
                  <this.DatePickers  name="expired_date" form={form} label="Expired date"/>
                  <div className="general">
                    <h6>Plan</h6>
                  </div>
                  <this.FormGroup>
                    <this.RadioRegisterGroup 
                      class_main_radio="main-radio-acc"
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
                  <this.RadioButton data={ RadioData } name="radio"  form={form} />
                </div>
              </this.Col>
            </this.Row>
          </div>
          <div className="btn-submit-center">
            <this.saveButton/>
          </div>
        </this.Form>
      </div>
      
    );
  }
}