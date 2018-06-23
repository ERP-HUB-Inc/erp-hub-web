import React from "react";
import Component from "../../Component";
import UserSelect from "./UserSelect";
import { reduxForm } from "redux-form";
import { Icon } from "antd";
import { Layout } from "antd";
const { Header } = Layout;

class Headers extends Component {
  constructor(props) {
    super(props);
    this.switchLanguage = this.switchLanguage.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  switchLanguage(key) {
    const { dispatch } = this.props;
    dispatch(this.changeLanguage(key));
  }

  toggle(){
    this.props.toggle;
  }

  handleSubmit({title}){
    alert(title);
  }

  render() {
    const { collapsed,toggle } = this.props;
    return (
      <Header className="header" style={{ background: "#fff" }}>
        <Icon
          className="trigger "
          type={ collapsed ? "menu-unfold" : "menu-fold" }
          onClick={ toggle }
        />
        <this.Row>
          <this.Col md="2">
            <div className="border-right">
              <div className="logo-title"> Store VEIN </div>
              Backoffice
            </div>
          </this.Col>
          <this.Col md="3 main-search">
            <this.Form onSubmit={ this.handleSubmit }>
              <Icon type="search" className="search-icon"/>
              <this.Field
                name="title"
                type="text"
                placeholder="Search Transaction, invoice or help"
                component={ this.InputRedux }
              />
            </this.Form>
          </this.Col>
          <this.Col md="7">
            {/* <ul className="help-layout">
              <li className="help">Help</li>
              <li className="useracc">
                <UserSelect />
              </li>
            </ul> */}
            <this.Row>
              <this.Col md="4">
                    Help
              </this.Col>
              <this.Col md="4">
                    Notation
              </this.Col>
              <this.Col md="4">
                <UserSelect />
              </this.Col>
            </this.Row>
          </this.Col>
        </this.Row>
      </Header>
    );
  }
}

export default reduxForm({
  form: "search", 
})(Headers);
