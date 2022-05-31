import {
  RelationshipClass,
  StepEntityMetadata,
  StepRelationshipMetadata,
} from '@jupiterone/integration-sdk-core';

export const ACCOUNT_ENTITY_KEY = 'entity:account';
export const Steps = {
  ACCOUNT: 'fetch-account',
  JOB: 'fetch-job',
  USER: 'fetch-users',
  BUILD: 'fetch-build',
  REPOSITORY: 'fetch-repository',
  ROLE: 'fetch-roles',
  BUILD_USER_BUILD_RELATIONSHIPS: 'build-user-and-build-relationships',
  BUILD_USER_ROLE_RELATIONSHIPS: 'build-user-and-role-relationships',
};

export const Entities: Record<
  'ACCOUNT' | 'USER' | 'REPOSITORY' | 'ROLE' | 'JOB' | 'BUILD',
  StepEntityMetadata
> = {
  ACCOUNT: {
    resourceName: 'Account',
    _type: 'jenkins_account',
    _class: ['Account'],
  },
  JOB: {
    resourceName: 'Job',
    _type: 'jenkins_job',
    _class: ['Project'],
  },
  REPOSITORY: {
    resourceName: 'Repository',
    _type: 'jenkins_repository',
    _class: ['Repository'],
  },
  USER: {
    resourceName: 'User',
    _type: 'jenkins_user',
    _class: ['User'],
  },
  ROLE: {
    resourceName: 'Role',
    _type: 'jenkins_role',
    _class: ['AccessRole'],
  },
  BUILD: {
    resourceName: 'Build',
    _type: 'jenkins_build',
    _class: ['Configuration'],
  },
};

export const Relationships: Record<
  | 'ACCOUNT_HAS_USER'
  | 'ACCOUNT_HAS_REPOSITORY'
  | 'ACCOUNT_HAS_ROLE'
  | 'USER_ASSIGNED_ROLE'
  | 'USER_HAS_BUILD'
  | 'ACCOUNT_HAS_JOB'
  | 'JOB_HAS_BUILD'
  | 'BUILD_HAS_REPOSITORY'
  | 'JOB_HAS_JOB',
  StepRelationshipMetadata
> = {
  ACCOUNT_HAS_USER: {
    _type: 'jenkins_account_has_user',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.USER._type,
  },
  ACCOUNT_HAS_JOB: {
    _type: 'jenkins_account_has_job',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.JOB._type,
  },
  ACCOUNT_HAS_REPOSITORY: {
    _type: 'jenkins_account_has_repository',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.REPOSITORY._type,
  },
  ACCOUNT_HAS_ROLE: {
    _type: 'jenkins_account_has_role',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.ROLE._type,
  },
  USER_ASSIGNED_ROLE: {
    _type: 'jenkins_user_assigned_role',
    sourceType: Entities.USER._type,
    _class: RelationshipClass.ASSIGNED,
    targetType: Entities.ROLE._type,
  },
  USER_HAS_BUILD: {
    _type: 'jenkins_user_has_build',
    sourceType: Entities.USER._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.BUILD._type,
  },
  JOB_HAS_BUILD: {
    _type: 'jenkins_job_has_build',
    sourceType: Entities.JOB._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.BUILD._type,
  },
  BUILD_HAS_REPOSITORY: {
    _type: 'jenkins_build_has_repository',
    sourceType: Entities.BUILD._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.REPOSITORY._type,
  },
  JOB_HAS_JOB: {
    _type: 'jenkins_job_has_job',
    sourceType: Entities.JOB._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.JOB._type,
  },
};
