import React from "react";
import styled from "styled-components";

/* ======================
   STYLES
====================== */

const NumpadGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
`;

const KeyButton = styled.button`
  height: 70px;
  border-radius: 12px;
  aspect-ratio: 1;
  border: 1.5px solid #e0e0e0;
  border-radius: 12px;
  background: #ffffff;
  font-size: 20px;
  font-weight: 700;
  color: #1a2332;
  cursor: pointer;
  transition: all 0.1s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;

  &:active {
    background: #e8f5e9;
    border-color: #00897b;
    transform: scale(0.94);
  }
`;

const ZeroKey = styled(KeyButton)`
  aspect-ratio: auto;
  padding: 12px 0;
`;

const DeleteKey = styled(KeyButton)`
  background: #fff3e0;
  border-color: #ffcc80;
  color: #e65100;

  &:active {
    background: #ffe0b2;
  }
`;

const ClearButton = styled.button`
  margin-top: 12px;
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  border: none;
  background: #e53935;
  color: #ffffff;
  font-weight: 700;
  cursor: pointer;

  &:active {
    background: #b71c1c;
  }
`;

/* ======================
   COMPONENT
====================== */

const Numpad = ({ onKeyPress }) => {
  const handlePress = (key) => {
    if (onKeyPress) {
      onKeyPress(key);
    }
  };

  return (
    <>
      <NumpadGrid>
        {["7", "8", "9", "4", "5", "6", "1", "2", "3"].map((num) => (
          <KeyButton key={num} onClick={() => handlePress(num)}>
            {num}
          </KeyButton>
        ))}

        <ZeroKey onClick={() => handlePress("0")}>0</ZeroKey>

        <KeyButton onClick={() => handlePress(".")}>.</KeyButton>

        <DeleteKey onClick={() => handlePress("backspace")}>⌫</DeleteKey>
      </NumpadGrid>

      <ClearButton onClick={() => handlePress("clear")}>Clear</ClearButton>
    </>
  );
};

export default Numpad;
