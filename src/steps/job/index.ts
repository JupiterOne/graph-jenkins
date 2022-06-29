import {
  createDirectRelationship,
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';

import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import {
  Entities,
  Relationships,
  Steps,
  ACCOUNT_ENTITY_KEY,
} from '../constants';

import { createJobEntity } from './converter';
import { getJobKey } from './converter';

export async function fetchJobs({
  instance,
  jobState,
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

    const jobEntity = await jobState.addEntity(createJobEntity(job));

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
        const jobEntity = await jobState.addEntity(createJobEntity(job));

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

export const jobSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.JOB,
    name: 'Fetch Jobs',
    entities: [Entities.JOB],
    relationships: [Relationships.ACCOUNT_HAS_JOB, Relationships.JOB_HAS_JOB],
    dependsOn: [Steps.ACCOUNT],
    executionHandler: fetchJobs,
  },
];
