import React from "react";
import Component from "../../Component";
import history from "../../../router/history";
import "./index.css";
import "./index.scss";
import { Menu, Dropdown } from "antd";

export default class MenuDropDown extends Component {
  constructor(props) {
    super(props);
    this.handleLogOut = this.handleLogOut.bind(this);
    this.menu = (
      <Menu>
        <Menu.Item><this.Translate id="text_profile"/></Menu.Item>
        <Menu.Item onClick={() => this.handleLogOut()}><this.Translate id="text_logout"/></Menu.Item>
      </Menu>
    );
    
    this.menuLanguage = (
      <Menu>
        {
          this.props.localization.languages.map((local, key) => <Menu.Item key={ key } onClick={() => this.props.onSwitchLanguage(local.code)}>{local.name}</Menu.Item>)
        }
      </Menu>
    );
  }

  handleLogOut() {
    localStorage.removeItem("accessToken");
    history.push("/signin");
  }

  render() {
    return(
      <ul className="menu-left list-unstyled">
        <li>
          <a className="user-account" href="javascript:;">
            <this.Noteicon />
          </a>
        </li>
        <li>
          <a className="user-account">
            <span className="icon-help icon-padding-right"></span>
            <span className="title-user"><this.Translate id="text_help"/></span>
          </a>
        </li>
        <li>
          <Dropdown overlay={this.menu} trigger={["click"]}>
            <a className="ant-dropdown-link user-account" href="javascript:;">
              <span className="icon-user icon-padding-right"></span>
              <span className="title-user"><this.Translate id="text_user_account"/></span> 
              <span className="icon-move-down icon-padding-left"></span>
            </a>
          </Dropdown>
        </li>
        <li>
          <Dropdown overlay={this.menuLanguage} trigger={["click"]}>
            <a className="ant-dropdown-link user-account" href="javascript:;">
              <span className="icon-change icon-padding-right"></span>
              <span className="title-user">{this.props.currentLanguage.name}</span> 
              <span className="icon-move-down icon-padding-left"></span>
            </a>
          </Dropdown>
        </li>
      </ul>
    );
  }
}
