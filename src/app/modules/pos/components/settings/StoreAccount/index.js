import React from "react";
import Element from "../../../components/Component";
import "./index.css";
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
  }

  render() {
    return (
      <div>
        <div className="breadcrumb">
          <ul className="list-unstyled">
            <li>
              <this.Link to="/"><span className="icon-home"></span></this.Link>
            </li>
            <li className="fast-nav text-uppercase">
              <this.Link to="/">{this.module}</this.Link>
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
        <div className="main-layout">
          <this.Row>
            <this.Col md="4">   
              <div>
                <div className="general">
                  <h6>General</h6>
                </div>
                <this.InputText name="name" label="Business Name" placeholder="Super Store"/>
                <this.InputText name="name" label="Private URL" notation=".storevein.com" placeholder="Super Store"/>
                <this.InputText name="name" label="Country" notation=".storevein.com" placeholder="Global"/>
                <this.Select name="status" label="Language" placeholder="Please select status" dataSource={statusDataSource} defaultValue={1}/>
                <this.Select name="status" label="Default Currency" placeholder="Please select status" dataSource={statusDataSource} defaultValue={1}/>
                <this.Select name="status" label="Timezone" placeholder="Please select status" dataSource={statusDataSource} defaultValue={1}/>
                <this.Select name="status" label="Default Tax" placeholder="Please select status" dataSource={statusDataSource} defaultValue={1}/>
                <div className="general">
                  <h6>ACCOUNT</h6>
                </div>
                <this.InputText name="name" label="Email Address" placeholder="Super Store"/>
                <this.InputText name="name" label="Exist Password" notation=".storevein.com" placeholder="Super Store"/>
                <this.InputText name="name" label="New password" notation=".storevein.com" placeholder="Super Store"/>
                <this.InputText name="name" label="Confirm password" notation=".storevein.com" placeholder="Global"/>
              </div>
            </this.Col>
            <this.Col md="4">  
              <div>
                <div className="general">
                  <h6>CONTACT</h6>
                </div>
                <this.Row>
                  <this.Col md="6">
                    <this.InputText name="name" label="First name" placeholder="Peter"/>
                  </this.Col>
                  <this.Col md="6">
                    <this.InputText name="name" label="Last name" placeholder="John"/>
                  </this.Col>
                </this.Row>
                <this.InputEmail name="name" label="Email Address" placeholder="John"/>
                <this.InputNumber name="name" label="Phone number" placeholder="+855 12 345 678" />
                <this.InputText name="name" label="Address" placeholder=""/>
                <this.InputText name="name" label="Street"  placeholder=""/>
                <this.InputText name="name" label="City" notation=".storevein.com" placeholder="Global"/>
                <this.InputText name="name" label="Post code" notation=".storevein.com" placeholder="Global"/>
                <div className="general">
                  <h6>Setting</h6>
                </div>
                <this.Select name="status" label="Price tag format"  dataSource={statusDataSource} />
                <this.Select name="status" label="Auto generate product code"  dataSource={statusDataSource} />
                <this.Select name="status" label="Start sequence number"  dataSource={statusDataSource} />
                <this.Select name="status" label="Display price" placeholder="Tax Exclusive" dataSource={statusDataSource} />
              </div>
            </this.Col>
            <this.Col md="4">  
              <div>
                <div className="general">
                  <h6>Billing</h6>
                </div>
                <this.DatePickers name="register_date" label="Register date"/>
                <this.DatePickers  name="expired_date" label="Expired date"/>
                <div className="general">
                  <h6>Plan</h6>
                </div>
                <this.FormGroup>
                  <this.Field 
                    name="language" 
                    type="radio"
                    class_main_radio="main-radio-acc"
                    component={ this.RadioRegisterGroup }
                  >
                    <this.RadioRegister title="Lite" language="Small business" value="global"/>
                    <this.RadioRegister title="Pro" language="Growth Business"   value="cambodia" />
                    <this.RadioRegister title="Enterprise" language="Coperation"   value="cambodia"  />
                  </this.Field> 
                  <this.RadioButton data={ RadioData } name="radio" />
                </this.FormGroup>
              </div>
            </this.Col>
          </this.Row>
        </div>
      </div>
    );
  }
}