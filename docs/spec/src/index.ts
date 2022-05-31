import { IntegrationSpecConfig } from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../../src/config';
import { accountSpec } from './account';
import { userSpec } from './user';
import { roleSpec } from './role';
import { repositorySpec } from './repository';
import { jobSpec } from './job';
import { buildSpec } from './build';

export const invocationConfig: IntegrationSpecConfig<IntegrationConfig> = {
  integrationSteps: [
    ...accountSpec,
    ...userSpec,
    ...roleSpec,
    ...repositorySpec,
    ...jobSpec,
    ...buildSpec,
  ],
};
