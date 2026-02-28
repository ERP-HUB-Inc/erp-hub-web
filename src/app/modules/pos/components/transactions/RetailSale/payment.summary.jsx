import React from "react";
import styled from "styled-components";

const SummaryBar = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border-radius: 12px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
`;

const SummaryCol = styled.div`
  flex: 1;
  text-align: center;
  position: relative;

  &:not(:last-child)::after {
    content: "";
    position: absolute;
    right: 0;
    top: 15%;
    height: 70%;
    width: 1px;
    background: #e5e7eb;
  }

  &:first-child {
    text-align: left;
  }

  &:last-child {
    text-align: right;
  }
`;

const SumLabel = styled.div`
  font-size: 12px;
  color: #9aa4af;
  margin-bottom: 6px;
  font-weight: 500;
`;

const SumValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 0.5px;

  color: ${({ type }) => {
    if (type === "ok") return "#00a86b";
    if (type === "warn") return "#e53935";
    if (type === "change") return "#f59e0b";
    return "#1f2937";
  }};
`;

const PaymentSummary = ({ tendered, remaining, change, currency }) => {
  const format = (val) =>
    currency === "USD" ? `${val.toFixed(2)}` : `${val.toLocaleString()}`;

  return (
    <SummaryBar>
      <SummaryCol>
        <SumLabel>Tendered</SumLabel>
        <SumValue>{format(tendered)}</SumValue>
      </SummaryCol>

      <SummaryCol>
        <SumLabel>Remaining</SumLabel>
        <SumValue type={Number(remaining.replace(/\D/g, "")) > 0 ? "warn" : "ok"}>{remaining}</SumValue>
      </SummaryCol>

      <SummaryCol>
        <SumLabel>Change</SumLabel>
        <SumValue type="change">{format(change)}</SumValue>
      </SummaryCol>
    </SummaryBar>
  );
};

export default PaymentSummary;
