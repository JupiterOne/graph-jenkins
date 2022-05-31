import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const repositorySpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: ENDPOINT: {HOSTNAME}/job/{PROJECTNAME}/api/json?depth=1
     * PATTERN: Fetch Entities
     */
    id: 'fetch-repository',
    name: 'Fetch Repositories',
    entities: [
      {
        resourceName: 'Repository',
        _type: 'jenkins_repository',
        _class: ['Repository'],
      },
    ],
    relationships: [
      {
        _type: 'jenkins_build_has_repository',
        sourceType: 'jenkins_build',
        _class: RelationshipClass.HAS,
        targetType: 'jenkins_repository',
      },
    ],
    dependsOn: ['fetch-build'],
    implemented: true,
  },
];
