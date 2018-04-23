import * as React from 'react';
import styled, { keyframes } from 'styled-components';

import logo from 'media/logo.svg';

const AppLogoSpin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const App = styled.div`
  text-align: center;
`;

const AppLogo = styled.img`
  animation: ${AppLogoSpin} infinite 20s linear;
  height: 80px;
`;

const AppHeader = styled.header`
  background-color: #222;
  height: 150px;
  padding: 20px;
  color: white;
`;

const AppTitle = styled.h1`
  font-size: 1.5em;
`;

const AppIntro = styled.p`
  font-size: large;
`;

class AppComponent extends React.Component {
  public render() {
    return (
      <App>
        <AppHeader>
          <AppLogo src={logo} alt="logo" />
          <AppTitle>Welcome to React</AppTitle>
        </AppHeader>
        <AppIntro>
          To get started, edit <code>src/modules/app/components/App.js</code> and save to reload.
        </AppIntro>
      </App>
    );
  }
}

export default AppComponent;
