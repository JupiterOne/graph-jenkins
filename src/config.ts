import {
  IntegrationExecutionContext,
  IntegrationValidationError,
  IntegrationInstanceConfigFieldMap,
  IntegrationInstanceConfig,
} from '@jupiterone/integration-sdk-core';

import { createAPIClient } from './client';

export const instanceConfigFields: IntegrationInstanceConfigFieldMap = {
  userName: {
    type: 'string',
  },
  apiKey: {
    type: 'string',
    mask: true,
  },
  hostName: {
    type: 'string',
  },
};

export interface IntegrationConfig extends IntegrationInstanceConfig {
  /**
   * The provider API client ID used to authenticate requests.
   */
  userName: string;

  /**
   * The provider API client secret used to authenticate requests.
   */
  apiKey: string;

  /**
   * The Jenkins server url
   */
  hostName: string;
}

export async function validateInvocation(
  context: IntegrationExecutionContext<IntegrationConfig>,
) {
  const { config } = context.instance;

  if (!config.userName || !config.apiKey || !config.hostName) {
    throw new IntegrationValidationError(
      'Config requires all of {userName, apiKey, hostName}',
    );
  }

  const apiClient = createAPIClient(config);
  await apiClient.verifyAuthentication();
}
