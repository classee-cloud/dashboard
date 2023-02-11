import React from 'react'
import { OidcProvider } from '@axa-fr/react-oidc';
import { useOidc } from '@axa-fr/react-oidc';

import HomePage from '../components/HomePage';
import { ChakraProvider } from '@chakra-ui/react'
import {BrowserRouter } from "react-router-dom"
import LoginPage from '../components/LoginPage';
import {Configuration} from './Configuration';


const LoggedIn = () => {
  const {isAuthenticated} = useOidc();
  if (isAuthenticated) {
    //console.log(isAuthenticated, login, logout)
    return (
      <div>
        <HomePage/>
      </div>
    );
  }
  else{
    return (
      <div>
        <LoginPage/>
      </div>
    );
  }
};



function AuthPage() {
  return (
    <OidcProvider configuration={Configuration} >
      <BrowserRouter>
        <ChakraProvider>
          <LoggedIn/>
        </ChakraProvider>
      </BrowserRouter>
    </OidcProvider>
  );
}

export default AuthPage;