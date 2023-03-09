export const Configuration = {
    client_id: '4e415fd4f72514cd128d56114bb52c84ec7330c7',
    redirect_uri: window.location.origin + '/authentication/callback',
    silent_redirect_uri: window.location.origin + '/authentication/silent-callback', // Optional activate silent-signin that use cookies between OIDC server and client javascript to restore the session
    scope: 'openid profile email api github offline_access',
    authority: 'https://auth.in.ripley.cloud/application/o/classee-cloud',
    service_worker_relative_url:'/OidcServiceWorker.js',
    service_worker_only:false,
  };
  