import {
  createDirectRelationship,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
  getRawData,
} from '@jupiterone/integration-sdk-core';

import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { Entities, Relationships, Steps } from '../constants';
import { JenkinsBuild, JenkinsJob } from '../../types';
import { createBuildEntity } from './converter';
import { getUserKey } from '../user/converter';

export async function fetchBuilds({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

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

      await apiClient.iterateBuilds(async (build) => {
        const buildDetails = await apiClient.fetchBuildDetails(build.url);
        const buildEntity = await jobState.addEntity(
          createBuildEntity(buildDetails),
        );

        await jobState.addRelationship(
          createDirectRelationship({
            _class: RelationshipClass.HAS,
            from: jobEntity,
            to: buildEntity,
          }),
        );
      }, job.url);
    },
  );
}

export async function buildUserAndBuildRelationships({
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  await jobState.iterateEntities(
    { _type: Entities.BUILD._type },
    async (buildEntity) => {
      const build = getRawData<JenkinsBuild>(buildEntity);
      if (!build) {
        logger.warn(
          { _key: buildEntity._key },
          'Could not get raw data for device entity',
        );
        return;
      }
      const userId = buildEntity.startedByUserId;

      if (userId) {
        const isUserEntity = await jobState.findEntity(
          getUserKey(userId.toString()),
        );

        if (isUserEntity)
          await jobState.addRelationship(
            createDirectRelationship({
              _class: RelationshipClass.HAS,
              from: isUserEntity,
              to: buildEntity,
            }),
          );
      }
    },
  );
}

export const buildSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.BUILD,
    name: 'Fetch Build',
    entities: [Entities.BUILD],
    relationships: [Relationships.JOB_HAS_BUILD],
    dependsOn: [Steps.JOB],
    executionHandler: fetchBuilds,
  },
  {
    id: Steps.BUILD_USER_BUILD_RELATIONSHIPS,
    name: 'Build User and Build Relationships',
    entities: [],
    relationships: [Relationships.USER_HAS_BUILD],
    dependsOn: [Steps.BUILD, Steps.USER],
    executionHandler: buildUserAndBuildRelationships,
  },
];
