import React from "react";
import styled from "styled-components";

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  background: #ffffff;
  border-bottom: 1px solid #f0f0f0;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
`;

const ItemCount = styled.div`
  background: #14b8a6;
  color: #ffffff;

  padding: 5px 12px;
  border-radius: 20px;

  font-size: 13px;
  font-weight: 500;

  min-width: 60px;
  text-align: center;

  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

class OrderHeader extends React.Component {
  render() {
    const { totalQty } = this.props;

    return (
      <HeaderWrapper>
        <Title>Order</Title>
        <ItemCount>
          {totalQty} {totalQty === 1 ? "Item" : "Items"}
        </ItemCount>
      </HeaderWrapper>
    );
  }
}

export default OrderHeader;
