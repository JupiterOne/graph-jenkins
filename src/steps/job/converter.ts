import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';

import { JenkinsJob } from '../../types';
import { Entities } from '../constants';

export function getJobKey(id: string): string {
  return `jenkins_job:${id}`;
}

export function createJobEntity(project: JenkinsJob): Entity {
  return createIntegrationEntity({
    entityData: {
      source: project,
      assign: {
        _type: Entities.JOB._type,
        _class: Entities.JOB._class,
        _key: getJobKey(`${project.url}-${project.name}`),
        id: project.name,
        name: project.name,
        url: project.url,
      },
    },
  });
}
