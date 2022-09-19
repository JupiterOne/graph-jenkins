import {
  createDirectRelationship,
  Entity,
  getRawData,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';

import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { JenkinsJob, JenkinsJobConfig, JenkinsRepository } from '../../types';
import {
  Entities,
  Relationships,
  Steps,
  ACCOUNT_ENTITY_KEY,
} from '../constants';

import {
  createJobEntity,
  createRepositoryEntity,
  getRepositoryKey,
} from './converter';
import { getJobKey } from './converter';

function getJobRepos(jobConfig: JenkinsJobConfig): string[] {
  if (jobConfig && jobConfig.project?.properties) {
    for (const property of jobConfig.project.properties) {
      if (
        property['com.coravy.hudson.plugins.github.GithubProjectProperty'] &&
        property['com.coravy.hudson.plugins.github.GithubProjectProperty']
          .length > 0
      ) {
        return property[
          'com.coravy.hudson.plugins.github.GithubProjectProperty'
        ][0].projectUrl;
      }
    }
  }

  return [];
}

export async function fetchJobs({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);
  const accountEntity = (await jobState.getData(ACCOUNT_ENTITY_KEY)) as Entity;

  const unexploredFolders: string[][] = [];

  // creates project entites for root directory of a jenkins admin account
  await apiClient.iterateJobs(async (job) => {
    const jobAlreadyExists = await jobState.findEntity(
      getJobKey(`${job.url.toString()}-${job.name.toString()}`),
    );

    if (jobAlreadyExists) {
      return;
    }

    let repos: string[] = [];
    try {
      const jobConfig = await apiClient.fetchJobConfig(job.url);
      repos = getJobRepos(jobConfig);
    } catch (err) {
      logger.warn({ job_url: job.url, error: err }, 'Could not get job config');
    }

    const jobEntity = await jobState.addEntity(createJobEntity(job, repos));

    //Treat multibranch projects as folders
    if (
      job._class == 'com.cloudbees.hudson.plugins.folder.Folder' ||
      job._class ==
        'org.jenkinsci.plugins.workflow.multibranch.WorkflowMultiBranchProject' ||
      job._class == 'jenkins.branch.OrganizationFolder'
    ) {
      unexploredFolders.push([
        job.url,
        getJobKey(`${job.url.toString()}-${job.name.toString()}`),
      ]);
    }

    await jobState.addRelationship(
      createDirectRelationship({
        _class: RelationshipClass.HAS,
        from: accountEntity,
        to: jobEntity,
      }),
    );
  });

  //creates project entities for projects inside folders
  while (unexploredFolders.length != 0) {
    const folderUrl = unexploredFolders.pop();

    if (folderUrl) {
      await apiClient.iterateSubJobs(async (job) => {
        let repos: string[] = [];
        try {
          const jobConfig = await apiClient.fetchJobConfig(job.url);
          repos = getJobRepos(jobConfig);
        } catch (err) {
          logger.warn(
            { job_url: job.url, error: err },
            'Could not get job config',
          );
        }

        const jobEntity = await jobState.addEntity(createJobEntity(job, repos));

        if (
          job._class == 'com.cloudbees.hudson.plugins.folder.Folder' ||
          job._class ==
            'org.jenkinsci.plugins.workflow.multibranch.WorkflowMultiBranchProject'
        ) {
          unexploredFolders.push([
            job.url,
            getJobKey(`${job.url.toString()}-${job.name.toString()}`),
          ]);
        }

        await jobState.addRelationship(
          createDirectRelationship({
            _class: RelationshipClass.HAS,
            from: accountEntity,
            to: jobEntity,
          }),
        );

        const parentJobEntity = await jobState.findEntity(folderUrl[1]);

        if (parentJobEntity) {
          await jobState.addRelationship(
            createDirectRelationship({
              _class: RelationshipClass.HAS,
              from: parentJobEntity,
              to: jobEntity,
            }),
          );
        }
      }, folderUrl[0]);
    }
  }
}

export async function fetchRepositories({
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  await jobState.iterateEntities(
    { _type: Entities.JOB._type },
    async (jobEntity) => {
      const job = getRawData<JenkinsJob>(jobEntity);
      if (!job) {
        logger.warn(
          { _key: jobEntity._key },
          'Could not get raw data for job entity',
        );
        return;
      }

      if (job.projectUrls.length == 0) {
        return;
      }

      for (const projectUrl of job.projectUrls) {
        const hasRepositoryEntity = await jobState.findEntity(
          getRepositoryKey(projectUrl),
        );

        if (hasRepositoryEntity) {
          await jobState.addRelationship(
            createDirectRelationship({
              _class: RelationshipClass.HAS,
              from: jobEntity,
              to: hasRepositoryEntity,
            }),
          );
        } else {
          const repository: JenkinsRepository = {
            url: projectUrl,
            name: projectUrl,
          };

          const repositoryEntity = await jobState.addEntity(
            createRepositoryEntity(repository, jobEntity.url as string),
          );

          await jobState.addRelationship(
            createDirectRelationship({
              _class: RelationshipClass.HAS,
              from: jobEntity,
              to: repositoryEntity,
            }),
          );
        }
      }
    },
  );
}

export const jobSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.JOB,
    name: 'Fetch Jobs',
    entities: [Entities.JOB],
    relationships: [Relationships.ACCOUNT_HAS_JOB, Relationships.JOB_HAS_JOB],
    dependsOn: [Steps.ACCOUNT],
    executionHandler: fetchJobs,
  },
  {
    id: Steps.REPOSITORY,
    name: 'Fetch Repositories',
    entities: [Entities.REPOSITORY],
    relationships: [Relationships.JOB_HAS_REPOSITORY],
    dependsOn: [Steps.JOB],
    executionHandler: fetchRepositories,
  },
];
