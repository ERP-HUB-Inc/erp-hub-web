import React from "react";
import styled from "styled-components";

// Wrapper for the empty order list
const EmptyOrderWrapper = styled.div`
  height: calc(100% - 70px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  text-align: center;
  color: #6b7280;
  font-size: 14px;
`;

const EmptyIcon = styled.div`
  font-size: 40px;
  color: #14b8a6; /* primary color */
  margin-bottom: 12px;
`;

const EmptyMessage = styled.div`
  font-weight: 500;
`;

const EmptyHint = styled.div`
  font-size: 12px;
  margin-top: 4px;
  color: #9ca3af;
`;

class EmptyOrder extends React.Component {
  render() {
    return (
      <EmptyOrderWrapper>
        <EmptyIcon>🛒</EmptyIcon>
        <EmptyMessage>No items in the order</EmptyMessage>
        <EmptyHint>Click a product to add it to the order</EmptyHint>
      </EmptyOrderWrapper>
    );
  }
}

export default EmptyOrder;
