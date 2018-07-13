import React from "react";
import Component from "../../Component";
import DropDown from "../DropDown";
import { Icon } from "antd";
import { Layout } from "antd";
import SearchForm from "../Search";
import "./index.css";
const { Header } = Layout;

class Headers extends Component {
  constructor(props) {
    super(props);
    this.switchLanguage = this.switchLanguage.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  switchLanguage(key) {
    const { dispatch } = this.props;
    dispatch(this.changeLanguage(key));
  }

  toggle(){
    this.props.toggle;
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
        <div className="store-logo">
          <span className="icon-logo"></span>
        </div>
        <this.Row className="wrap-header clear-margin">
          <this.Col md="2" className="header-left">
            <div className="store-name">
              <div className="wrap-title">
                <div className="title">store VEIN </div>
                <div className="back-office">Backoffice</div>
              </div>
            </div>
          </this.Col>
          <this.Col md="3 main-search">
            <SearchForm />
          </this.Col>
          <this.Col md="7" className="header-left">
            <DropDown />
          </this.Col>
        </this.Row>
      </Header>
    );
  }
}

export default Headers;