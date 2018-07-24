import React from "react";
import Component from "../../Component";
import "./index.css";

export default class ClientRegister extends Component {
  render() {
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
              name="bName"
              type="text"
              label="Business name"
              placeholder="Super Store"
            />
            <this.InputText
              name="domain_name"
              type="text"
              label="Domain name"
              notation=".storevein.com"
              placeholder="Domain Name"
            />
            <this.Select 
              name="b_type" 
              label="Business Type"
              defaultValue="A"
              placeholder="Business Type"
              dataSource={[{ name: "A", value: 0 }]}
            />
            <this.Select 
              name="b_plan" 
              label="Business Plan"
              defaultValue="Lite"
              placeholder="Business Plan"
              dataSource={[{ name: "Lite", value: 0 }, { name: "Pro", value: 1 }]}
            />
            <this.Row>
              <this.Col md="6" className="clear-padding-col">
                <this.InputText
                  name="fname"
                  type="text"
                  label="First Name"
                />
              </this.Col>
              <this.Col md="6">
                <this.InputText
                  name="lname"
                  type="text"
                  label="Last Name"
                  placeholder="John"
                />
              </this.Col>
            </this.Row>
            <this.Row>
              <this.Col md="3" className="clear-padding-col">
                <this.InputText
                  name="code"
                  type="text"
                  label="Code"
                  placeholder="Peter"
                />
              </this.Col>
              <this.Col md="9">
                <this.InputText
                  name="p_number"
                  type="number"
                  label="Phone number"
                  placeholder="012 345 678"
                />
              </this.Col>
            </this.Row>
            <this.Select 
              name="t_zone" 
              label="Time Zone"
              defaultValue="Time Zone"
              placeholder="Status"
              dataSource={[{ name: "Time Zone", value: 0 }]}
            />
            <this.Select 
              name="currency" 
              label="Currency"
              defaultValue="Khmer"
              placeholder="Currency"
              dataSource={[{ name: "Khmer", value: 0 }]}
            />
            <this.Select 
              name="language" 
              label="Language"
              defaultValue="English"
              placeholder="Language"
              dataSource={[{ name: "English", value: 0 }]}
            />
            <this.Button className="main-signin" type="info">LET'S GO</this.Button>
          </div>
        </this.Col>
      </this.Row>
    );
  }
}
