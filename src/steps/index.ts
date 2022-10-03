import { accountSteps } from './account';
import { userSteps } from './user';
import { jobSteps } from './job';

const integrationSteps = [...accountSteps, ...jobSteps, ...userSteps];

export { integrationSteps };
