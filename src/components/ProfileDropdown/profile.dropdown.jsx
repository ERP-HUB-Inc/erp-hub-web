import React from "react";
import { Menu, Dropdown, Avatar, Icon } from "antd";
import styled from "styled-components";
import CommonUtil from "@common/util";
import history from "@router/index";

const util = new CommonUtil();

function getInitials(name) {
  return String(name || "User")
    .trim()
    .split(/\s+/)
    .map(part => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getHeaderUser() {
  const user = util.getCurrentUser() || {};
  const displayName = user.fullName || user.displayName || user.name || user.userName || user.username || "User";
  const roleName = user.roleName || user.position || (user.role && user.role.name) || user.roleCode || "Signed in";
  const avatar = user.photo || user.avatar || user.imageUrl;

  return {
    displayName,
    roleName,
    avatar,
    initials: getInitials(displayName),
  };
}

const menu = (
  <Menu className="pos-profile-dropdown-menu">
    <Menu.Item key="1">
      <Icon type="user" />
      Profile
    </Menu.Item>

    <Menu.Item key="2">
      <Icon type="setting" />
      Settings
    </Menu.Item>

    <Menu.Divider />

    <Menu.Item key="3" onClick={() => util.logout(history)}>
      <Icon type="logout" />
      Logout
    </Menu.Item>
  </Menu>
);

/* ===== Styled Components ===== */

const ProfilePill = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;
  min-width: 190px;
  max-width: 260px;
  height: 42px;
  padding: 4px 8px 4px 5px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #ffffff;
  color: #0f172a;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #cbd5e1;
    background: #f8fafc;
  }
`;

const ProfileInfo = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  line-height: 1.2;
`;

const ProfileName = styled.div`
  overflow: hidden;
  color: #0f172a;
  font-size: 13px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ProfileRole = styled.div`
  overflow: hidden;
  margin-top: 2px;
  color: #64748b;
  font-size: 11px;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ProfileIcon = styled(Icon)`
  font-size: 12px;
  color: #64748b;
  flex: 0 0 auto;
`;

const StyledAvatar = styled(Avatar)`
  flex: 0 0 auto;
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
  background: #1d4ed8;
`;

/* ===== Component ===== */

export default function ProfileDropdown() {
  const user = getHeaderUser();

  return (
    <Dropdown overlay={menu} trigger={["click"]} placement="bottomRight">
      <ProfilePill>
        <StyledAvatar size={34} src={user.avatar}>
          {user.initials}
        </StyledAvatar>

        <ProfileInfo>
          <ProfileName>{user.displayName}</ProfileName>
          <ProfileRole>{user.roleName}</ProfileRole>
        </ProfileInfo>

        <ProfileIcon type="down" />
      </ProfilePill>
    </Dropdown>
  );
}
