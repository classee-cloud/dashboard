import React from 'react';
import LoggedIn from './LoggedIn';
import { AuthProvider } from 'oidc-react';

const oidcConfig = {
  onSignIn: async (user: any) => {
    alert('You just signed in, congratz! Check out the console!');
    console.log(user);
    window.location.hash = '';
  },
  authority: 'https://accounts.google.com',
  clientId:
    '1066073673387-undfdseanu1soilcdprq1p4m8gq8a1iu.apps.googleusercontent.com',
  responseType: 'id_token',
  redirectUri:
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000/'
      : 'https://cobraz.github.io/example-oidc-react',
};

function auth() {

    console.log("here")
  return (
    <AuthProvider {...oidcConfig}>
      <div >
          <LoggedIn />
      </div>
    </AuthProvider>
  );
}

export default auth;
