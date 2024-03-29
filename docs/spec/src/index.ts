import { IntegrationSpecConfig } from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../../src/config';
import { accountSpec } from './account';
import { userSpec } from './user';
import { jobSpec } from './job';

export const invocationConfig: IntegrationSpecConfig<IntegrationConfig> = {
  integrationSteps: [...accountSpec, ...userSpec, ...jobSpec],
};
