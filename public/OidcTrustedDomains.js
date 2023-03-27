// Add bellow trusted domains, access tokens will automatically injected to be send to
// trusted domain can also be a path like https://www.myapi.com/users,
// then all subroute like https://www.myapi.com/useers/1 will be authorized to send access_token to.

// Domains used by OIDC server must be also declared here
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const trustedDomains = {
    default: ['https://auth.in.ripley.cloud/application/o/classee-cloud', 
    'https://auth.in.ripley.cloud/application/o/token', 
    'https://auth.in.ripley.cloud/application/o/revoke',
    'https://auth.in.ripley.cloud/application/o/userinfo',
    'https://auth.in.ripley.cloud/application/o/authorize/',
    'https://auth.in.ripley.cloud/if/session-end/classee-cloud/',
    'https://auth.in.ripley.cloud/application/o/introspect/',
    'https://auth.in.ripley.cloud/application/o/device/',

    'https://db-dev.classee.cloud/',
    'https://gh-dev.classee.cloud/', 
    'https://compute-dev.classee.cloud/',
     ]
};
