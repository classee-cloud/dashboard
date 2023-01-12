import React from 'react'
import { useAuth } from 'oidc-react';
import { AuthProvider } from 'oidc-react';
import {Routes, Route} from "react-router-dom"
import Dashboard from '../components/Dashboard';
import LoginPage from '../components/LoginPage';
import About from '../components/About';


const LoggedIn = () => {
  const auth = useAuth();
  if (auth && auth.userData) {
    console.log(auth)
    return (
      <div>
        <strong>Logged in! 🎉</strong><br />
        <button onClick={() => auth.signOut()}>Log out!</button>
      </div>
    );
  }
  return <div>Not logged in! Try to refresh to be redirected to Login Page.</div>;
};

function AuthPage() {
  let pathVar = "/authentication/callback"
  const oidcConfig = {
    onSignIn: (user: any) => {
      window.location.hash = '';
    },
    authority: 'https://auth.in.ripley.cloud/application/o/classee-cloud/',
    clientId:'4e415fd4f72514cd128d56114bb52c84ec7330c7',
    responseType: 'id_token',
    redirectUri: window.location.origin + pathVar,
  };

  return (
    <AuthProvider {...oidcConfig}>
      <Routes>
        <Route path='/' element={<LoginPage/>} />
        <Route path={pathVar} element={<Dashboard/>} />
        <Route path='/dashboard' element={<Dashboard/>} />
        <Route path={pathVar+ '/dashboard'} element={<Dashboard/>} />
        <Route path={'/about'} element={<About/>} />
      </Routes>
    </AuthProvider>
  );
}

export default AuthPage;