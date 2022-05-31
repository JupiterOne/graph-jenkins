import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';

import { JenkinsRole } from '../../types';
import { Entities } from '../constants';

export function getRoleKey(name: string, roleType: string): string {
  return `jenkins_role:${roleType}:${name}`;
}

export function createRoleEntity(role: JenkinsRole): Entity {
  return createIntegrationEntity({
    entityData: {
      source: role,
      assign: {
        _type: Entities.ROLE._type,
        _class: Entities.ROLE._class,
        _key: getRoleKey(role.name, role.roleType),
        name: role.name,
        roleType: role.roleType,
        credentialsProviderManageDomains: role.credentialsProviderManageDomains,
        credentialsProviderView: role.credentialsProviderView,
        credentialsProviderUpdate: role.credentialsProviderUpdate,
        credentialsProviderDelete: role.credentialsProviderDelete,
        credentialsProviderCreate: role.credentialsProviderCreate,
        SCMTag: role.SCMTag,
        modelViewDelete: role.modelViewDelete,
        modelComputerConnect: role.modelComputerConnect,
        modelRunDelete: role.modelRunDelete,
        modelComputerCreate: role.modelComputerCreate,
        modelViewConfigure: role.modelViewConfigure,
        modelComputerBuild: role.modelComputerBuild,
        modelItemConfigure: role.modelItemConfigure,
        modelHudsonAdminister: role.modelHudsonAdminister,
        modelItemCancel: role.modelItemCancel,
        modelItemRead: role.modelItemRead,
        modelComputerDelete: role.modelComputerDelete,
        modelItemBuild: role.modelItemBuild,
        modelItemMove: role.modelItemMove,
        modelItemDiscover: role.modelItemDiscover,
        modelHudsonRead: role.modelHudsonRead,
        modelItemCreate: role.modelItemCreate,
        modelItemWorkspace: role.modelItemWorkspace,
        modelComputerProvision: role.modelComputerProvision,
        modelRunReplay: role.modelRunReplay,
        modelViewRead: role.modelViewRead,
        modelViewCreate: role.modelViewCreate,
        modelItemDelete: role.modelItemDelete,
        modelComputerConfigure: role.modelComputerConfigure,
        modelComputerDisconnect: role.modelComputerDisconnect,
        modelRunUpdate: role.modelRunUpdate,
      },
    },
  });
}
