import styled, { createGlobalStyle } from "styled-components";

export const AppVersion = styled.div`
  font-size: 1em;
  white-space: nowrap;
`;

export const AppReset = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    color: inherit;
  }

  html,
  body,
  #root {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  html {
    font-size: 20px;
    font-family: Arial, sans-serif;
    font-weight: normal;
    line-height: 1.2;
    background-color: #1e1e1e;
    color: #fefefe;
  }

  #root {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  #VRButton {
    bottom: 50% !important;
    transform: translateY(50%) !important;
  }
`;
