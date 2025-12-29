import React from "react";
import styled from "styled-components";

// Styled components outside the function
const Wrapper = styled.div`
  box-sizing: border-box;
  justify-content: flex-end;
  display: flex;
  min-width: 80px;
  margin: 8px 16px 8px auto;
  font-size: 16px;
`;

const Sign = styled.span`
  color: ${(props) => props.color};
  margin-right: 2px;
  margin-bottom: 0px;
  margin-top: 0px;
  font-weight: bold;
  font-size: 16px;
  letter-spacing: -0.4px;
  line-height: 1.15em;
`;

const Quantity = styled.span`
  color: ${(props) => (props.showSign ? props.color : "rgb(20, 20, 21)")};
  margin-right: 4px;
  margin-bottom: 0px;
  margin-top: 0px;
  font-weight: bold;
  font-size: 16px;
  letter-spacing: -0.4px;
  line-height: 1.15em;
`;

const Unit = styled.span`
  color: ${(props) => (props.showSign ? props.color : "rgb(77, 79, 81)")};
  margin-bottom: 0px;
  margin-top: 0px;
  font-size: 14px;
  letter-spacing: -0.4px;
  line-height: 1.15em;
`;

export function QuantityValue(props) {
  const { showSign, sign, type, quantity, unit, decimals, status } = props;

  const getColor = () => {
    if (status === 0) return "#8c8c8c"; // Drafted gray
    if (status === 3) return "#fa8c16"; // Deleted / Cancelled orange
    return type === "IN" ? "#52c41a" : "#ff4d4f"; // IN green, OUT red
  };

  const color = getColor();

  const formatQuantity = (val) => {
    const numValue = parseFloat(val);
    if (isNaN(numValue)) return "0";
    return numValue.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  return (
    <Wrapper>
      {showSign && <Sign color={color}>{sign}</Sign>}
      <Quantity color={color} showSign={showSign}>
        {formatQuantity(quantity)}
      </Quantity>
      {unit && (
        <Unit color={color} showSign={showSign}>
          {unit}
        </Unit>
      )}
    </Wrapper>
  );
}

QuantityValue.defaultProps = {
  showSign: false,
  type: null,
  quantity: 0,
  unit: "",
  sign: "",
  decimals: 2,
  status: null,
};
