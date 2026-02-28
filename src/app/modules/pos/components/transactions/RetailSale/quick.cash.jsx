import React from "react";
import { Radio } from "antd";
import styled from "styled-components";

const QuickWrapper = styled.div`
  margin-top: 20px;
  margin-bottom: 20px;
`;

const QuickHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-weight: 600;
  font-size: 14px;
`;

const QuickButtons = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
`;

const QuickButton = styled.button`
  height: 56px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  background: ${({ active }) => (active ? "#1677ff" : "#ffffff")};
  color: ${({ active }) => (active ? "#ffffff" : "#374151")};
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: ${({ active }) =>
    active ? "0 6px 16px rgba(22,119,255,0.25)" : "0 2px 6px rgba(0,0,0,0.05)"};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.12);
  }

  &:active {
    transform: scale(0.98);
  }
`;

class QuickCash extends React.Component {
  state = {
    currency: "KHR",
    selected: null,
  };

  handleCurrencyChange = (e) => {
    this.setState({ currency: e.target.value, selected: null });
  };

  handleQuickCash = (amount) => {
    this.setState({ selected: amount });

    if (this.props.onSelect) {
      this.props.onSelect(this.state.currency, amount);
    }
  };

  render() {
    const { currency, selected } = this.state;

    const usdValues = [1, 5, 10, 20, 50, 100];
    const khrValues = [1000, 5000, 10000, 20000, 50000, 100000];

    const values = currency === "USD" ? usdValues : khrValues;

    return (
      <QuickWrapper>
        <QuickHeader>
          <span>Quick Cash</span>

          <Radio.Group value={currency} onChange={this.handleCurrencyChange} size="small">
            <Radio.Button value="KHR">🇰🇭 KHR</Radio.Button>
            <Radio.Button value="USD">🇺🇸 USD</Radio.Button>
          </Radio.Group>
        </QuickHeader>

        <QuickButtons>
          {values.map((val) => (
            <QuickButton key={val} active={selected === val} onClick={() => this.props.onClick(val, currency)}>
              {currency === "USD" ? `$${val}` : `${val}៛`}
            </QuickButton>
          ))}
        </QuickButtons>
      </QuickWrapper>
    );
  }
}

export default QuickCash;
