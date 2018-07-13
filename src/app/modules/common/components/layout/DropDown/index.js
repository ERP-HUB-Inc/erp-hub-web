import React from "react";
import Component from "../../Component";
import "./index.css";
import "./index.scss";
import { Menu, Dropdown, Icon } from "antd";

export default class UserSelect extends Component {
  constructor(props) {
    super(props);
    
    this.menu = (
      <Menu>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">1st menu item</a>
        </Menu.Item>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">2nd menu item</a>
        </Menu.Item>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">3rd menu item</a>
        </Menu.Item>
      </Menu>
    );
  }

  render() {
    return(
      <ul className="menu-left list-unstyled">
        <li>
          <a className="user-account" href="#">
            <this.Noteicon />
          </a>
        </li>
        <li>
          <a className="user-account">
            <span className="icon-help icon-padding-right"></span>
            <span className="title">Help</span>
          </a>
        </li>
        <li>
          <Dropdown overlay={this.menu} trigger={["click"]}>
            <a className="ant-dropdown-link user-account" href="#">
              <span className="icon-user icon-padding-right"></span>
              <span className="title">User Account</span> 
              <span className="icon-move-down icon-padding-left"></span>
            </a>
          </Dropdown>
        </li>  
      </ul>
    );
  }
}
