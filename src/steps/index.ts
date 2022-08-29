import { accountSteps } from './account';
import { userSteps } from './user';
import { repositorySteps } from './repository';
import { buildSteps } from './build';
import { jobSteps } from './job';

const integrationSteps = [
  ...accountSteps,
  ...jobSteps,
  ...buildSteps,
  ...userSteps,
  ...repositorySteps,
];

export { integrationSteps };
