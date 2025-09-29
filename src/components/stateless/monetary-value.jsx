import React from "react";
import styled from "styled-components";
import Util from "@helper/util";

export function MonetaryValue(props) {
     const Wrapper = styled.div`
          box-sizing: border-box;
          justify-content: flex-end;
          display: flex;
          min-width: 100px;
          margin: 8px 16px 8px auto;
          font-size: 16px;
     `;

     const Amount = styled.span`
          color: rgb(20, 20, 21);
          margin-right: 4px;
          margin-bottom: 0px;
          margin-top: 0px;
          font-weight: bold;
          font-size: 16px;
          letter-spacing: -0.4px;
          line-height: 1.15em;
     `;

     const Currency = styled.span`
          color: rgb(77, 79, 81);
          margin-bottom: 0px;
          margin-top: 0px;
          font-size: 16px;
          letter-spacing: -0.4px;
          line-height: 1.15em;
          text-transform: uppercase;
     `;

     return <Wrapper>
          <Amount>{(new Util()).formatCurrency(props.amount)}</Amount>
          <Currency>{props.currency}</Currency>
     </Wrapper>
}