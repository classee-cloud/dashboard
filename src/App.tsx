import React from 'react';
import { AuthProvider } from 'oidc-react';
import logo from './logo.svg';
import './App.css';
import LoggedIn from './LoggedIn';

const oidcConfig = {
  onSignIn: async (user: any) => {
    alert('You just signed in, congrats! Check out the console!');
    console.log(user);
    window.location.hash = '';
  },
  authority: 'https://auth.in.ripley.cloud/application/o/classee-cloud/',
  clientId:
    '4e415fd4f72514cd128d56114bb52c84ec7330c7',
  responseType: 'id_token',
  redirectUri:'http://localhost:3000/'
};

function App() {
  return (
    <AuthProvider {...oidcConfig}>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>OIDC React</p>
          <LoggedIn />
        </header>
      </div>
    </AuthProvider>
  );
}

export default App;
