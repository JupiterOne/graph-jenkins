import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';

import { JenkinsRepository } from '../../types';
import { Entities } from '../constants';

export function getRepositoryKey(id: string): string {
  return `jenkins_repository:${id}`;
}

export function createRepositoryEntity(
  repository: JenkinsRepository,
  webLink: string,
): Entity {
  return createIntegrationEntity({
    entityData: {
      source: repository,
      assign: {
        _type: Entities.REPOSITORY._type,
        _class: Entities.REPOSITORY._class,
        _key: getRepositoryKey(repository.url),
        name: repository.url,
        url: repository.url,
        webLink,
      },
    },
  });
}
