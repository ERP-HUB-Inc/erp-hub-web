import React from "react";
import styled from "styled-components";

export function QuantityValue(props) {
     const { showSign, type, value, unit, decimals } = props;
     const isPositive = type === "IN";
     
     const Wrapper = styled.div`
          box-sizing: border-box;
          justify-content: flex-end;
          display: flex;
          min-width: 80px;
          margin: 8px 16px 8px auto;
          font-size: 16px;
     `;

     const Sign = styled.span`
          color: ${isPositive ? '#52c41a' : '#ff4d4f'};
          margin-right: 2px;
          margin-bottom: 0px;
          margin-top: 0px;
          font-weight: bold;
          font-size: 16px;
          letter-spacing: -0.4px;
          line-height: 1.15em;
     `;

     const Amount = styled.span`
          color: ${showSign ? (isPositive ? '#52c41a' : '#ff4d4f') : 'rgb(20, 20, 21)'};
          margin-right: 4px;
          margin-bottom: 0px;
          margin-top: 0px;
          font-weight: bold;
          font-size: 16px;
          letter-spacing: -0.4px;
          line-height: 1.15em;
     `;

     const Unit = styled.span`
          color: ${showSign ? (isPositive ? '#52c41a' : '#ff4d4f') : 'rgb(77, 79, 81)'};
          margin-bottom: 0px;
          margin-top: 0px;
          font-size: 14px;
          letter-spacing: -0.4px;
          line-height: 1.15em;
     `;

     const formatQuantity = (val) => {
          const numValue = parseFloat(val);
          if (isNaN(numValue)) return '0';
          
          return numValue.toLocaleString('en-US', {
               minimumFractionDigits: decimals,
               maximumFractionDigits: decimals
          });
     };

     return <Wrapper>
          {showSign && <Sign>{isPositive ? '+' : '-'}</Sign>}
          <Amount>{formatQuantity(value)}</Amount>
          {unit && <Unit>{unit}</Unit>}
     </Wrapper>
}

QuantityValue.defaultProps = {
     showSign: false,
     type: null,
     value: 0,
     unit: '',
     decimals: 2
};