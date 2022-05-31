import { accountSteps } from './account';
import { userSteps } from './user';
import { repositorySteps } from './repository';
import { buildSteps } from './build';
import { roleSteps } from './role';
import { jobSteps } from './job';

const integrationSteps = [
  ...accountSteps,
  ...jobSteps,
  ...buildSteps,
  ...userSteps,
  ...roleSteps,
  ...repositorySteps,
];

export { integrationSteps };
