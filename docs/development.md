# Development

This integration focuses on [Jenkins](https://www.jenkins.io/) and is using
Jenkins API (JENKINS_URL/.../api/json) for interacting with the Jenkins
resources.

## Provider account setup

1. Install Jenkins on the local machine/server and take note of the provided
   domain
2. Install recommended plugins
3. Create an admin account on this installation
4. Install Role-based Authorization Strategy Plugin
5. Go to Dashboard -> Manage Jenkins -> Configure Global Security and choose
   Role-Based Strategy for Authorization
6. Go to Dashboard -> Configure and add a new API Token

## Authentication

Provide the generated `API_KEY` by the admin account `USER_NAME` , and the
`HOST_NAME` of the Jenkins installation to the `.env`. You can use
[`.env.example`](../.env.example) as a reference.

The API Key will be used to authorize requests using Basic Authorization.
