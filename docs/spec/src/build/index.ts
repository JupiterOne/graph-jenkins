import { StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const buildSpec: StepSpec<IntegrationConfig>[] = [
  // {
  //   /**
  //    * ENDPOINT: {HOSTNAME}/job/{PROJECTNAME}/api/json?depth=1
  //    * PATTERN: Fetch Entities
  //    */
  //   id: 'fetch-build',
  //   name: 'Fetch Build',
  //   entities: [
  //     {
  //       resourceName: 'Build',
  //       _type: 'jenkins_build',
  //       _class: ['Configuration'],
  //     },
  //   ],
  //   relationships: [
  //     {
  //       _type: 'jenkins_job_has_build',
  //       sourceType: 'jenkins_job',
  //       _class: RelationshipClass.HAS,
  //       targetType: 'jenkins_build',
  //     },
  //   ],
  //   dependsOn: ['fetch-job'],
  //   implemented: true,
  // },
  // {
  //   /**
  //    * ENDPOINT: {HOSTNAME}/job/{PROJECTNAME}/api/json?depth=1
  //    * PATTERN: Fetch Entities
  //    */
  //   id: 'build-user-and-build-relationships',
  //   name: 'Build User and Build Relationships',
  //   entities: [],
  //   relationships: [
  //     {
  //       _type: 'jenkins_user_has_build',
  //       sourceType: 'jenkins_user',
  //       _class: RelationshipClass.HAS,
  //       targetType: 'jenkins_build',
  //     },
  //   ],
  //   dependsOn: ['fetch-build', 'fetch-users'],
  //   implemented: true,
  // },
];
