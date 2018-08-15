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
          <span className="icon-user icon-padding-right"></span>
          <span className="title"><this.Translate id="text_logout"/></span>
        </Menu.Item>
      </Menu>
    );

    this.iconLanguages = {
      km: <span className="icon-kh icon-padding-right language-icon">
        <span className="path1"></span><span className="path2"></span><span className="path3"></span>
      </span>,
      bm: <span className="icon-mm icon-padding-right language-icon">
        <span className="path1"></span><span className="path2"></span><span className="path3"></span><span className="path4"></span>
      </span>,
      en: <span className="icon-us icon-padding-right language-icon">
        <span className="path1"></span><span className="path2"></span><span className="path3"></span><span className="path4"></span><span className="path5"></span><span className="path6"></span><span className="path7"></span><span className="path8"></span><span className="path9"></span><span className="path10"></span><span className="path11"></span><span className="path12"></span><span className="path13"></span><span className="path14"></span><span className="path15"></span><span className="path16"></span><span className="path17"></span><span className="path18"></span><span className="path19"></span><span className="path20"></span><span className="path21"></span><span className="path22"></span><span className="path23"></span><span className="path24"></span><span className="path25"></span><span className="path26"></span><span className="path27"></span><span className="path28"></span><span className="path29"></span><span className="path30"></span><span className="path31"></span><span className="path32"></span><span className="path33"></span><span className="path34"></span><span className="path35"></span><span className="path36"></span><span className="path37"></span><span className="path38"></span><span className="path39"></span><span className="path40"></span><span className="path41"></span><span className="path42"></span><span className="path43"></span><span className="path44"></span><span className="path45"></span><span className="path46"></span><span className="path47"></span><span className="path48"></span><span className="path49"></span><span className="path50"></span>
      </span>
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
    return(
      <ul className="menu-left list-unstyled">
        <li>
          <this.Link to="#" className="user-account">
            <this.Noteicon />
          </this.Link>
        </li>
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
              <span className="title-user"><this.Translate id="text_user_account"/></span> 
              <span className="icon-move-down icon-padding-left"></span>
            </this.Link>
          </Dropdown>
        </li>
      </ul>
    );
  }
}
