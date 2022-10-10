import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const userSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: {HOSTNAME}/asynchPeople/api/json
     * PATTERN: Fetch Entities
     */
    id: 'fetch-users',
    name: 'Fetch Users',
    entities: [
      {
        resourceName: 'User',
        _type: 'jenkins_user',
        _class: ['User'],
      },
    ],
    relationships: [
      {
        _type: 'jenkins_account_has_user',
        sourceType: 'jenkins_account',
        _class: RelationshipClass.HAS,
        targetType: 'jenkins_user',
      },
    ],
    dependsOn: ['fetch-account'],
    implemented: true,
  },
];
