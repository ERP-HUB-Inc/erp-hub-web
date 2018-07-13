import React from "react";
import Component from "../../Component";
import "./index.css";
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
          <this.Noteicon />
        </li>
        <li>
          <span className="help">Help</span>&nbsp; 
          <i className="fa fa-question-circle help-icon"></i>
        </li>
          
        <Dropdown overlay={this.menu} trigger={["click"]}>
          <a className="ant-dropdown-link user-account" href="#">
            User Account <Icon type="down" />
          </a>
        </Dropdown>
          
      </ul>
    );
  }
}
