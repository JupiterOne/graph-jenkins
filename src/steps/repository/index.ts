import {
  createDirectRelationship,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../config';
import { Entities, Relationships, Steps } from '../constants';
import { JenkinsRepository } from '../../types';
import { createRepositoryEntity, getRepositoryKey } from './converter';

export async function fetchRepositories({
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  await jobState.iterateEntities(
    { _type: Entities.BUILD._type },
    async (buildEntity) => {
      const remoteUrl = buildEntity.remoteUrl;
      if (!remoteUrl) {
        return;
      }

      const hasRepositoryEntity = await jobState.findEntity(
        getRepositoryKey(remoteUrl.toString()),
      );

      if (hasRepositoryEntity) {
        await jobState.addRelationship(
          createDirectRelationship({
            _class: RelationshipClass.HAS,
            from: buildEntity,
            to: hasRepositoryEntity,
          }),
        );
      } else {
        const repository: JenkinsRepository = {
          url: remoteUrl.toString(),
          name: remoteUrl.toString(),
        };

        const repositoryEntity = await jobState.addEntity(
          createRepositoryEntity(repository, buildEntity.url as string),
        );

        await jobState.addRelationship(
          createDirectRelationship({
            _class: RelationshipClass.HAS,
            from: buildEntity,
            to: repositoryEntity,
          }),
        );
      }
    },
  );
}

export const repositorySteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.REPOSITORY,
    name: 'Fetch Repositories',
    entities: [Entities.REPOSITORY],
    relationships: [Relationships.BUILD_HAS_REPOSITORY],
    dependsOn: [Steps.BUILD],
    executionHandler: fetchRepositories,
  },
];
