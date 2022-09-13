import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';

import { JenkinsUser } from '../../types';
import { Entities } from '../constants';

export function getUserKey(id: string): string {
  return `jenkins_user:${id}`;
}

export function getUserId(user: JenkinsUser) {
  const userUrl = user.user.absoluteUrl;
  return userUrl.substring(userUrl.lastIndexOf('/') + 1);
}

export function createUserEntity(user: JenkinsUser): Entity {
  const userId = getUserId(user);

  return createIntegrationEntity({
    entityData: {
      source: user,
      assign: {
        _type: Entities.USER._type,
        _class: Entities.USER._class,
        _key: getUserKey(userId),
        id: userId,
        updatedOn: user.lastChange || undefined,
        project: user.project,
        webLink: user.user.absoluteUrl,
        fullName: user.user.fullName,
        name: userId,
        username: userId,
        active: true,
      },
    },
  });
}
