import React from "react";
import Component from "../../Component";
import history from "../../../router/history";
import ConstantAuth from "../../../constants/authentication";
import "./index.css";
import "./index.scss";
import { Menu, Dropdown } from "antd";

export default class MenuDropDown extends Component {
  constructor(props) {
    super(props);
    this.handleLogOut = this.handleLogOut.bind(this);
    this.menu = (
      <Menu>
        <Menu.Item>
          <span className="icon-user icon-padding-right"></span>
          <span className="title"><this.Translate id="text_profile"/></span>
        </Menu.Item>
        <Menu.Item onClick={() => this.handleLogOut()}>
          <span className="icon-logout icon-padding-right"></span>
          <span className="title"><this.Translate id="text_logout"/></span>
        </Menu.Item>
      </Menu>
    );

    this.iconLanguages = {
      km: this.getLanguageIcon("km"),
      bm: this.getLanguageIcon("bm"),
      en: this.getLanguageIcon("en")
    };
    
    this.menuLanguage = (
      <Menu>
        {
          this.props.localization.languages.map((local, key) => 
            <Menu.Item key={ key } onClick={() => this.props.onSwitchLanguage(local.code)}>
              {this.iconLanguages[local.code]}
              <span className="title">{local.name}</span>
            </Menu.Item>
          )
        }
      </Menu>
    );
  }

  handleLogOut() {
    localStorage.removeItem(ConstantAuth.ACCESS_TOKEN);
    localStorage.removeItem(ConstantAuth.STORE_ACCESS_TOKEN);
    history.push("/signin");
  }

  render() {
    let fullName = "";
    const userInfo = this.getCurrentUser();
    if (userInfo !== null) {
      const {currentUser} = userInfo;
      if (currentUser !== null && currentUser !== "undefined") {
        fullName = currentUser.fullName;
      }
    }

    return(
      <ul className="menu-left list-unstyled">
        {/* <li>
          <this.Link to="#" className="user-account">
            <this.Noteicon />
          </this.Link>
        </li> */}
        <li>
          <Dropdown overlay={this.menuLanguage} trigger={["click"]}>
            <this.Link to="#" className="ant-dropdown-link user-account">
              {this.iconLanguages[this.props.currentLanguage.code]}
              <span className="title-user">{this.props.currentLanguage.name}</span> 
              <span className="icon-move-down icon-padding-left"></span>
            </this.Link>
          </Dropdown>
        </li>
        <li>
          <a className="user-account">
            <span className="icon-help icon-padding-right"></span>
            <span className="title-user"><this.Translate id="text_help"/></span>
          </a>
        </li>
        <li>
          <Dropdown overlay={this.menu} trigger={["click"]}>
            <this.Link to="#" className="ant-dropdown-link user-account">
              <span className="icon-user icon-padding-right"></span>
              <span className="title-user">{fullName}</span> 
              <span className="icon-move-down icon-padding-left"></span>
            </this.Link>
          </Dropdown>
        </li>
      </ul>
    );
  }
}
