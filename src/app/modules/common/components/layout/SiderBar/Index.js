import React from "react";
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
          <SubMenu
            className="main-manu-item"
            key="sub2"
            title={<span><i className="fa fa-address-book"><span className="menu-title">Team 1</span></i></span>}
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
            // title={<span><Icon type="team" /><span>Team 2</span></span>}
            title={<i className="fa fa-align-justify"><span className="menu-title">Team 2</span></i>}
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