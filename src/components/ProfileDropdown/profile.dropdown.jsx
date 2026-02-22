import React from "react";
import { Menu, Dropdown, Avatar, Icon } from "antd";
import styled from "styled-components";

const menu = (
  <Menu>
    <Menu.Item key="1">
      <Icon type="user" />
      Profile
    </Menu.Item>

    <Menu.Item key="2">
      <Icon type="setting" />
      Settings
    </Menu.Item>

    <Menu.Divider />

    <Menu.Item key="3">
      <Icon type="logout" />
      Logout
    </Menu.Item>
  </Menu>
);

/* ===== Styled Components ===== */

const ProfilePill = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: #d5d5d5;
  padding: 5px 16px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #e4ebf3;
  }
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1.2;
`;

const ProfileName = styled.div`
  font-weight: 600;
  color: #1890ff; /* AntD v3 primary */
`;

const ProfileRole = styled.div`
  font-size: 12px;
  color: #8c8c8c;
`;

const ProfileIcon = styled(Icon)`
  font-size: 12px;
  color: #8c8c8c;
  margin-left: 6px;
`;

/* ===== Component ===== */

export default function ProfileDropdown() {
  return (
    <Dropdown overlay={menu} trigger={["hover"]} placement="bottomRight" style={{ width: "200px" }}>
      <ProfilePill>
        <Avatar size={40} src="https://i.pravatar.cc/150?img=12" />

        <ProfileInfo>
          <ProfileName>Jason Miller</ProfileName>
          <ProfileRole>Cashier</ProfileRole>
        </ProfileInfo>

        <ProfileIcon type="down" />
      </ProfilePill>
    </Dropdown>
  );
}
