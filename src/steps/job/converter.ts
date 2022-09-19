import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';

import { JenkinsJob, JenkinsRepository } from '../../types';
import { Entities } from '../constants';

export function getJobKey(id: string): string {
  return `jenkins_job:${id}`;
}

export function createJobEntity(project: JenkinsJob, repos: string[]): Entity {
  return createIntegrationEntity({
    entityData: {
      source: {
        ...project,
        projectUrls: repos,
      },
      assign: {
        _type: Entities.JOB._type,
        _class: Entities.JOB._class,
        _key: getJobKey(`${project.url}-${project.name}`),
        id: project.name,
        name: project.name,
        webLink: project.url,
        projectUrls: repos,
      },
    },
  });
}

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
