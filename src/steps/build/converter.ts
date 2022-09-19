// import {
//   createIntegrationEntity,
//   Entity,
// } from '@jupiterone/integration-sdk-core';

// import { JenkinsBuild } from '../../types';
// import { Entities } from '../constants';

// export function getBuildKey(id: string): string {
//   return `jenkins_build:${id}`;
// }

// function getStartedByUserId(build: JenkinsBuild) {
//   for (const action of build.actions) {
//     if (action.causes) {
//       for (const cause of action.causes) {
//         if (
//           cause.shortDescription.includes('Started by user') &&
//           cause.userId
//         ) {
//           return cause.userId;
//         }
//       }
//     }
//   }
//   return undefined;
// }

// function getRemoteUrl(build: JenkinsBuild) {
//   for (const action of build.actions) {
//     if (
//       action._class &&
//       action._class === 'hudson.plugins.git.util.BuildData'
//     ) {
//       if (action.remoteUrls.length > 0) {
//         return action.remoteUrls[0];
//       }
//     }
//   }
//   return undefined;
// }

// export function createBuildEntity(build: JenkinsBuild): Entity {
//   const startedByUserId = getStartedByUserId(build);
//   const remoteUrl = getRemoteUrl(build);

//   return createIntegrationEntity({
//     entityData: {
//       source: build,
//       assign: {
//         _type: Entities.BUILD._type,
//         _class: Entities.BUILD._class,
//         _key: getBuildKey(build.url),
//         id: build.url,
//         webLink: build.url,
//         name: build.url,
//         remoteUrl,
//         startedByUserId,
//       },
//     },
//   });
// }
