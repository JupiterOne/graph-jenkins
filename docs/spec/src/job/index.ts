import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../../../src/config';

export const jobSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: {HOSTNAME}/api/json
     * PATTERN: Fetch Entities
     */
    id: 'fetch-job',
    name: 'Fetch Jobs',
    entities: [
      {
        resourceName: 'Job',
        _type: 'jenkins_job',
        _class: ['Project'],
      },
    ],
    relationships: [
      {
        _type: 'jenkins_account_has_job',
        sourceType: 'jenkins_account',
        _class: RelationshipClass.HAS,
        targetType: 'jenkins_job',
      },
      {
        _type: 'jenkins_job_has_job',
        sourceType: 'jenkins_job',
        _class: RelationshipClass.HAS,
        targetType: 'jenkins_job',
      },
    ],
    dependsOn: ['fetch-account'],
    implemented: true,
  },
];
