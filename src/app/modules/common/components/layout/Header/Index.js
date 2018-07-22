import React from "react";
import Component from "../../Component";
import DropDown from "../DropDown";
import { Layout } from "antd";
import SearchForm from "../Search";
import "./index.css";
const { Header } = Layout;

class Headers extends Component {
  constructor(props) {
    super(props);
    this.switchLanguage = this.switchLanguage.bind(this);
  }

  switchLanguage(key) {
    const { dispatch } = this.props;
    dispatch(this.changeLanguage(key));
  }
  
  render() {
    return (
      <Header className="header" style={{ background: "#fff" }}>
        <div className="store-logo">
          <span className="icon-logo"></span>
        </div>
        <this.Row className="wrap-header clear-margin">
          <this.Col md="2" className="header-left">
            <div className="store-name">
              <div className="wrap-title">
                <div className="title">store VEIN </div>
                <div className="back-office">{<this.Translate id="text_back_office"/>}</div>
              </div>
            </div>
          </this.Col>
          <this.Col md="3 main-search">
            <SearchForm locale={this.props.locale}/>
          </this.Col>
          <this.Col md="7" className="header-left">
            <DropDown onSwitchLanguage={this.switchLanguage} localization={this.props.locale} currentLanguage={this.getCurrentLanguage(this.props.locale)}/>
          </this.Col>
        </this.Row>
      </Header>
    );
  }
}

export default Headers;