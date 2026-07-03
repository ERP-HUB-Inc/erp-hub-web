import React from "react";
import styled from "styled-components";
import Util from "@helper/util";

const Wrapper = styled.div`
  box-sizing: border-box;
  justify-content: flex-end;
  display: flex;
  min-width: 100px;
  margin: 8px 16px 8px auto;
  font-size: 16px;
`;

const Sign = styled.span`
  color: ${(props) => props.$color};
  margin-right: 2px;
  font-weight: bold;
  font-size: 16px;
  letter-spacing: -0.4px;
  line-height: 1.15em;
`;

const Amount = styled.span`
  color: ${(props) =>
    props.$showSign ? props.$color : "rgba(0, 0, 0, 0.85)"};
  margin-right: 4px;
  font-weight: bold;
  font-size: 16px;
  letter-spacing: -0.4px;
  line-height: 1.15em;
`;

const Currency = styled.span`
  color: ${(props) =>
    props.$showSign ? props.$color : "rgb(77, 79, 81)"};
  font-size: 16px;
  letter-spacing: -0.4px;
  line-height: 1.15em;
  text-transform: uppercase;
`;

export function MonetaryValue(props) {
  const { showSign, type, status, amount, currency } = props;

  const numericAmount = Number(amount ?? 0);
  const isNegativeAmount = numericAmount < 0;

  const getColor = () => {
    if (isNegativeAmount) return "#ff4d4f"; // Negative / discount red

    if (status === 0) return "#8c8c8c"; // Drafted gray
    if (status === 3) return "#fa8c16"; // Deleted / Cancelled orange

    return type === "IN" ? "#52c41a" : "#ff4d4f"; // IN green, OUT red
  };

  const color = getColor();

  const getSign = () => {
    if (status === 0) return "";
    if (isNegativeAmount) return "-";
    if (type === "IN") return "+";
    if (type === "OUT") return "-";
    return "";
  };

  const displayAmount = showSign
    ? Math.abs(numericAmount)
    : numericAmount;

  return (
    <Wrapper>
      {showSign && (
        <Sign $color={color}>
          {getSign()}
        </Sign>
      )}

      <Amount $color={color} $showSign={showSign || isNegativeAmount}>
        {(new Util()).formatCurrency(displayAmount)}
      </Amount>

      {/* <Currency $color={color} $showSign={showSign || isNegativeAmount}>
        {currency}
      </Currency> */}
    </Wrapper>
  );
}

MonetaryValue.defaultProps = {
  showSign: false,
  type: null,
  currency: "USD",
  status: null,
  amount: 0,
};