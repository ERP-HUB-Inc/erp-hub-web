import React from "react";
// import Component from "../Component";
import PropTypes from "prop-types";
import { Layout, Menu, Icon } from "antd";
const { Sider } = Layout;
const SubMenu = Menu.SubMenu;

export default class SideBar extends React.Component {
  render() {
    const { collapsed,display } = this.props;
    return (
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className={ display }
      >
        <div className="logo" />
        <Menu theme="dark" mode="inline">
          <Menu.Item key="1">
            <Icon type="user" />
            <span>nav 1</span>
          </Menu.Item>
          <Menu.Item key="2">
            <Icon type="video-camera" />
            <span>nav 2</span>
          </Menu.Item>
          <Menu.Item key="3">
            <Icon type="upload" />
            <span>nav 3</span>
          </Menu.Item>
          <SubMenu
            key="sub2"
            title={<span><Icon type="team" /><span>Team</span></span>}
          >
            <Menu.Item>
              Title 1
            </Menu.Item>
            <Menu.Item key="6">
              <Icon type="upload" />
                Team 1
            </Menu.Item>
            <Menu.Item key="8">
              <Icon type="upload" />
              Team 2
            </Menu.Item>
          </SubMenu>

          <SubMenu
            className="main-manu-item"
            key="sub3"
            title={<span><Icon type="team" /><span>Team 2</span></span>}
          >
            <Menu.Item>
              Title 2
            </Menu.Item>
            <Menu.Item key="111">
              <Icon type="upload" />
                Team 1
            </Menu.Item>
            <Menu.Item key="112">
              <Icon type="upload" />
              Team 2
            </Menu.Item>
          </SubMenu>

        </Menu>
      </Sider>
    );
  }
}

SideBar.propTypes = {
  collapsed: PropTypes.string
};