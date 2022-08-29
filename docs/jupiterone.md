# Jenkins Integration with JupiterOne

## Jenkins + JupiterOne Integration Benefits

- Visualize Jenkins users, jobs, builds and repositories in the JupiterOne
  graph.
- Map Jenkins users to employees in your JupiterOne account.
- Monitor changes to Jenkins users using JupiterOne alerts.

## How it Works

- JupiterOne periodically fetches users, jobs, builds and repositories from
  Jenkins to update the graph.
- Write JupiterOne queries to review and monitor updates to the graph, or
  leverage existing queries.
- Configure alerts to take action when JupiterOne graph changes, or leverage
  existing alerts.

## Requirements

- Jenkins Basic Authorization.
- JupiterOne requires a REST API key. You need permission to create a user in
  Jenkins that will be used to obtain the API key.
- You must have permission in JupiterOne to install new integrations.

## Support

If you need help with this integration, please contact
[JupiterOne Support](https://support.jupiterone.io).

## Integration Walkthrough

### In Jenkins

1. Install Jenkins on the local machine/server and take note of the provided
   domain
2. Install recommended plugins
3. Create an admin account on this installation
4. Go to Dashboard -> Configure and add a new API Token
5. Go to Dashboard -> Configure -> Manage Plugins and add the
   [Docker](https://plugins.jenkins.io/docker-plugin) and
   [Docker Pipeline](https://plugins.jenkins.io/docker-workflow) plugins
6. To push data from your Jenkins instance you must run our Docker container in
   a pipeline. Here is an example:

```
pipeline {
    agent {
        docker { image 'jupiterone/graph-jenkins:<version>' }
    }

    environment {
        JUPITERONE_API_KEY = credentials('j1-api-key')
        JUPITERONE_ACCOUNT = credentials('j1-account')
        USER_NAME = credentials('jenkins-username')
        API_KEY   = credentials('jenkins-api-key')
        HOST_NAME = 'https://<your_hostname>'
    }

    stages {
        stage('Collect data') {
            steps {
                sh 'cd /opt/jupiterone/integration && ./scripts/collect.sh'
            }
        }
    }
}
```

### In JupiterOne

1. From the configuration **Gear Icon**, select **Integrations**.
2. Scroll to the **Jenkins** integration tile and click it.
3. Click the **Add Configuration** button and configure the following settings:

- Enter the **Account Name** by which you'd like to identify this Jenkins
  account in JupiterOne. Ingested entities will have this value stored in
  `tag.AccountName` when **Tag with Account Name** is checked.
- Enter a **Description** that will further assist your team when identifying
  the integration instance.
- Select a **Polling Interval** that you feel is sufficient for your monitoring
  needs. You may leave this as `DISABLED` and manually execute the integration.
- Enter the **Jenkins API Key** generated for use by JupiterOne.

4. Click **Create Configuration** once all values are provided.

# How to Uninstall

1. From the configuration **Gear Icon**, select **Integrations**.
2. Scroll to the **Jenkins** integration tile and click it.
3. Identify and click the **integration to delete**.
4. Click the **trash can** icon.
5. Click the **Remove** button to delete the integration.

<!-- {J1_DOCUMENTATION_MARKER_START} -->
<!--
********************************************************************************
NOTE: ALL OF THE FOLLOWING DOCUMENTATION IS GENERATED USING THE
"j1-integration document" COMMAND. DO NOT EDIT BY HAND! PLEASE SEE THE DEVELOPER
DOCUMENTATION FOR USAGE INFORMATION:

https://github.com/JupiterOne/sdk/blob/main/docs/integrations/development.md
********************************************************************************
-->

## Data Model

### Entities

The following entities are created:

| Resources  | Entity `_type`       | Entity `_class` |
| ---------- | -------------------- | --------------- |
| Account    | `jenkins_account`    | `Account`       |
| Build      | `jenkins_build`      | `Configuration` |
| Job        | `jenkins_job`        | `Project`       |
| Repository | `jenkins_repository` | `Repository`    |
| User       | `jenkins_user`       | `User`          |

### Relationships

The following relationships are created:

| Source Entity `_type` | Relationship `_class` | Target Entity `_type` |
| --------------------- | --------------------- | --------------------- |
| `jenkins_account`     | **HAS**               | `jenkins_job`         |
| `jenkins_account`     | **HAS**               | `jenkins_user`        |
| `jenkins_build`       | **HAS**               | `jenkins_repository`  |
| `jenkins_job`         | **HAS**               | `jenkins_build`       |
| `jenkins_job`         | **HAS**               | `jenkins_job`         |
| `jenkins_user`        | **HAS**               | `jenkins_build`       |

<!--
********************************************************************************
END OF GENERATED DOCUMENTATION AFTER BELOW MARKER
********************************************************************************
-->
<!-- {J1_DOCUMENTATION_MARKER_END} -->
