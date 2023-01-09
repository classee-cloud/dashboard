# CLASSEE Cloud Dashboard


### Expected User Stories

As a user who wants to configure a repository for a CI service, I want to connect my existing GitHub repository to some cloud credentials.
Provided by user: 
* A working GitHubActions configuration
* Access to the GitHub repo of interest (select from list based on user logged in)
* Cloud provider credentials

When a CI run is triggered on a repository that has been previously configured:
* The Runner service receives a callback from GitHub requesting a runner for a repo w/ some labels (`self-hosted`)
* Runner service sends request to the relevant compute service to request a runner to be started
* Compute service does its thing (proprietary-per-service) to launch the runner

Mechanics of launching a CI runner:
* GitHub service asks compute service to create a VM or container, creates a token for a token later on.
* Once the compute service successfully starts up and gets its resources it connects back to the GitHub Service to get a token to launch a runner and most recent runner file
* Compute service starts runner and passes it the token
* When runner is done (when the runner application exits), cleans up resources

Potential failure modes/errors to handle:
* GitHub Actions not set up properly (should show some error, but not ours to handle)
* Need to be able to install our GitHub app on the repository
* Need to be able to test connection to compute cloud (best to be able to do this at the same time that the compute credentials are input into the system)
* Might be failures in communication with the compute service

