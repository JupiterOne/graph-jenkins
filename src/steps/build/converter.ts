import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';

import { JenkinsBuild } from '../../types';
import { Entities } from '../constants';

export function getBuildKey(id: string): string {
  return `jenkins_build:${id}`;
}

export function createBuildEntity(build: JenkinsBuild): Entity {
  const startedByUserId = build.actions[0].causes[0].userId;
  let remoteUrl;
  for (const index in build.actions || []) {
    if (build.actions[index]._class == 'hudson.plugins.git.util.BuildData') {
      const remoteUrlTemp = build.actions[index].remoteUrls;
      remoteUrl = remoteUrlTemp;
      break;
    }
  }

  return createIntegrationEntity({
    entityData: {
      source: build,
      assign: {
        _type: Entities.BUILD._type,
        _class: Entities.BUILD._class,
        _key: getBuildKey(build.url),
        id: build.url,
        url: build.url,
        name: build.url,
        remoteUrl: remoteUrl,
        startedByUserId: startedByUserId,
      },
    },
  });
}
