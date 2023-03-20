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

    'http://localhost:5001/',
    'http://localhost:5001/api/computer-service/:name',
    'http://localhost:5001/api/computer-service',
    'http://localhost:5001/api/computer-service/:aid/:service',
    'http://localhost:5001/api/config_repos/:name',
    'http://localhost:5001/api/config_repos',
    'http://localhost:5001/api/config_repos/:repo_name',
    'http://localhost:5001/api/config_repos/:reponame',
    'http://localhost:5001/api/user/:uid/org/:orgid',
    'http://localhost:5001/api/user/:uid/repo/:repoid',
    'http://localhost:5001/api/organisation',
    'http://localhost:5001/api/repo',
    'http://localhost:5001/api/repo/:name',
    'http://localhost:5001/api/repo',
    'http://localhost:5001/api/login',
    'http://localhost:5001/api/refresh-token',
    'http://localhost:5001/api/user',
    'http://localhost:5001/api/user/:uid',
    'http://localhost:5001/api/user/:uid/repo',
    'http://localhost:5001/api/user/:uid',

    'http://localhost:8181/repodetails/:loginName', 
    'http://localhost:8181/runnertoken/:org/:reponame', 
    
    'http://localhost:8282/',
    'http://localhost:8282/runner'
     ]
};
