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
            <this.Field
              name="bName"
              type="text"
              label="Business name"
              placeholder="Super Store"
              component={ this.InputText }
            />
            <this.Field
              name="domain_name"
              type="text"
              label="Domain name"
              notation=".storevein.com"
              placeholder="Domain Name"
              component={ this.InputText }
            />
            <this.Field 
              name="b_type" 
              label="Business Type"
              component={ this.Selects }
              defaultValue="all"
              placeholder="Status"
            >
              <option value="all" selected>Retail</option>
              <option value="red">HoleSale</option>
            </this.Field>
            <this.Field 
              name="b_plan" 
              label="Business Plan"
              component={ this.Selects }
              defaultValue="all"
              placeholder="Status"
            >
              <option value="all" selected>Business Pro</option>
            </this.Field>
            <this.Row>
              <this.Col md="6" className="clear-padding-col">
                <this.Field
                  name="fname"
                  type="text"
                  label="First Name"
                  component={ this.InputText }
                />
              </this.Col>
              <this.Col md="6">
                <this.Field
                  name="lname"
                  type="text"
                  label="Last Name"
                  placeholder="John"
                  component={ this.InputText }
                />
              </this.Col>
            </this.Row>
            <this.Row>
              <this.Col md="3" className="clear-padding-col">
                <this.Field
                  name="code"
                  type="text"
                  label="Code"
                  placeholder="Peter"
                  component={ this.InputText }
                />
              </this.Col>
              <this.Col md="9">
                <this.Field
                  name="p_number"
                  type="number"
                  label="Phone number"
                  placeholder="012 345 678"
                  component={ this.InputText }
                />
              </this.Col>
            </this.Row>
            <this.Field 
              name="t_zone" 
              label="Time zone"
              component={ this.Selects }
              defaultValue="all"
              placeholder="Status"
            >
              <option value="all" selected>Time</option>
            </this.Field>
            <this.Field 
              name="currency" 
              label="Currency"
              component={ this.Selects }
              defaultValue="all"
            >
              <option value="all" selected>Time</option>
            </this.Field>
            <this.Field 
              name="language" 
              label="Language"
              component={ this.Selects }
            >
              <option value="all" selected>Time</option>
            </this.Field>
            <div>
              <div className="main-signin">
                <this.Button type="info">LET'S GO</this.Button>
              </div>
            </div>
          </div>
        </this.Col>
      </this.Row>
    );
  }
}
