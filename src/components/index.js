import styled from "styled-components";

const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: #BF4F74;
`;

// Create a Wrapper component that'll render a <section> tag with some styles
const Wrapper = styled.section`
  padding: 4em;
  background: papayawhip;
`;

const ERPHub = styled.div`
  text-align: center;
  padding-top: 19px;
  padding-bottom: 19px;
  font-weight: bold;
`;

export {
   Title,
   Wrapper,
   ERPHub
}