import React from 'react';
import AuthPage from './auth/AuthPage';
import { ChakraProvider } from '@chakra-ui/react'
import {BrowserRouter } from "react-router-dom"
//import logo from './logo.svg';
//import './App.css';

function App() {
  return (
    <div>
      <AuthPage/>
    </div>
  );
}

export default App;
