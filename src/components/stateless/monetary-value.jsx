import React from "react";
import styled from "styled-components";
import Util from "@helper/util";

export function MonetaryValue(props) {
    const { showSign, type, status, amount, currency } = props;

    // Determine color based on type or status
    const getColor = () => {
          if (status === 0) return '#8c8c8c';      // Drafted gray
          if (status === 3) return '#fa8c16';      // Deleted / Cancelled orange
          return type === "IN" ? '#52c41a' : '#ff4d4f'; // IN green, OUT red
     };

    const color = getColor();
    const isPositive = type === "IN";

    const Wrapper = styled.div`
        box-sizing: border-box;
        justify-content: flex-end;
        display: flex;
        min-width: 100px;
        margin: 8px 16px 8px auto;
        font-size: 16px;
    `;

    const Sign = styled.span`
        color: ${color};
        margin-right: 2px;
        margin-bottom: 0px;
        margin-top: 0px;
        font-weight: bold;
        font-size: 16px;
        letter-spacing: -0.4px;
        line-height: 1.15em;
    `;

    const Amount = styled.span`
        color: ${showSign ? color : 'rgb(20, 20, 21)'};
        margin-right: 4px;
        margin-bottom: 0px;
        margin-top: 0px;
        font-weight: bold;
        font-size: 16px;
        letter-spacing: -0.4px;
        line-height: 1.15em;
    `;

    const Currency = styled.span`
        color: ${showSign ? color : 'rgb(77, 79, 81)'};
        margin-bottom: 0px;
        margin-top: 0px;
        font-size: 16px;
        letter-spacing: -0.4px;
        line-height: 1.15em;
        text-transform: uppercase;
    `;

    return (
        <Wrapper>
            {showSign && <Sign>{status === 0 ? '' : (isPositive ? '+' : '-')}</Sign>}
            <Amount>{(new Util()).formatCurrency(amount)}</Amount>
            <Currency>{currency}</Currency>
        </Wrapper>
    );
}

MonetaryValue.defaultProps = {
    showSign: false,
    type: null,
    currency: 'USD',
    status: null,
    amount: 0
};
