import React from "react";
import { Collapse } from "antd";
import styled from "styled-components";

const { Panel } = Collapse;

// Styled Components
const StyledCollapse = styled(Collapse)`
  background-color: ${(props) => props.bgColor || "#fff"};
  border: ${(props) => props.border || "1px solid #d9d9d9"};
  border-radius: ${(props) => props.borderRadius || "8px"};
  margin-top: ${(props) => props.marginTop || "0px"};
  overflow: hidden;
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledHeader = styled.div`
  font-size: ${(props) => props.fontSize || "16px"};
  font-weight: ${(props) => props.fontWeight || "bold"};
  color: ${(props) => props.color || "#000"};
`;

const StyledSubtitle = styled.div`
  font-size: ${(props) => props.fontSize || "13px"};
  font-weight: ${(props) => props.fontWeight || "normal"};
  margin-top: ${(props) => props.marginTop || "5px"};
  color: ${(props) => props.color || "#888"};
`;

// Reusable Component
const CustomCollapse = ({
  defaultActiveKey,
  onChange,
  headerTitle,
  subtitle,
  children,
  collapseStyle,
  headerStyle,
  subtitleStyle,
}) => {
  return (
    <StyledCollapse
      defaultActiveKey={defaultActiveKey}
      onChange={onChange}
      {...collapseStyle}
    >
      <Panel
        header={
          <HeaderContainer>
            <StyledHeader {...headerStyle}>{headerTitle}</StyledHeader>
            {subtitle && (
              <StyledSubtitle {...subtitleStyle}>{subtitle}</StyledSubtitle>
            )}
          </HeaderContainer>
        }
        key={defaultActiveKey && defaultActiveKey.length > 0 ? defaultActiveKey[0] : null}
      >
        {children}
      </Panel>
    </StyledCollapse>
  );
};

export {
  CustomCollapse
};
