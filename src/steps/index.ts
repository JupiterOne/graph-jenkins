import { accountSteps } from './account';
import { userSteps } from './user';
// import { buildSteps } from './build';
import { jobSteps } from './job';

const integrationSteps = [
  ...accountSteps,
  ...jobSteps,
  // ...buildSteps,
  ...userSteps,
];

export { integrationSteps };
