import fetch, { Response } from 'node-fetch';
import {
  IntegrationProviderAPIError,
  IntegrationProviderAuthenticationError,
} from '@jupiterone/integration-sdk-core';
import { retry } from '@lifeomic/attempt';
import xml2js from 'xml2js';

import { IntegrationConfig } from './config';
import {
  JenkinsUser,
  JenkinsRole,
  JenkinsBuild,
  JenkinsJob,
  JenkinsJobConfig,
} from './types';

export type ResourceIteratee<T> = (each: T) => Promise<void> | void;

export class APIClient {
  private xmlParser: xml2js.Parser;

  constructor(readonly config: IntegrationConfig) {
    this.xmlParser = new xml2js.Parser();
  }

  private baseUri = this.config.hostName;
  private withBaseUri = (path: string) => `${this.baseUri}${path}`;
  private perPage = 50;

  private checkStatus = (response: Response) => {
    if (response.ok) {
      return response;
    } else {
      throw new IntegrationProviderAPIError(response);
    }
  };

  private async getXmlRequest(
    endpoint: string,
    method: 'GET',
  ): Promise<Response> {
    const auth =
      'Basic ' +
      Buffer.from(
        `${this.config.userName}` + ':' + `${this.config.apiKey}`,
      ).toString('base64');

    try {
      const options = {
        method,
        headers: {
          Authorization: auth,
        },
      };

      const response = await retry(
        async () => {
          const res: Response = await fetch(endpoint, options);
          this.checkStatus(res);
          return res;
        },
        {
          delay: 5000,
          factor: 2,
          maxAttempts: 5,
          minDelay: 100,
          maxDelay: 500,
          jitter: true,
          handleError: (err, context) => {
            if (
              err.statusCode !== 429 ||
              ([500, 502, 503].includes(err.statusCode) &&
                context.attemptNum > 1)
            ) {
              context.abort();
            }
          },
        },
      );

      return response.text();
    } catch (err) {
      throw new IntegrationProviderAPIError({
        endpoint: endpoint,
        status: err.status,
        statusText: err.statusText,
      });
    }
  }

  private async getRequest(endpoint: string, method: 'GET'): Promise<Response> {
    const auth =
      'Basic ' +
      Buffer.from(
        `${this.config.userName}` + ':' + `${this.config.apiKey}`,
      ).toString('base64');
    try {
      const options = {
        method,
        headers: {
          Authorization: auth,
        },
      };

      const response = await retry(
        async () => {
          const res: Response = await fetch(endpoint, options);
          this.checkStatus(res);
          return res;
        },
        {
          delay: 5000,
          factor: 2,
          maxAttempts: 5,
          minDelay: 100,
          maxDelay: 500,
          jitter: true,
          handleError: (err, context) => {
            if (
              err.statusCode !== 429 ||
              ([500, 502, 503].includes(err.statusCode) &&
                context.attemptNum > 1)
            ) {
              context.abort();
            }
          },
        },
      );

      return response.json();
    } catch (err) {
      throw new IntegrationProviderAPIError({
        endpoint: endpoint,
        status: err.status,
        statusText: err.statusText,
      });
    }
  }

  private async paginatedGeneralRequest<T>(
    uri: string,
    method: 'GET',
    accessor: string,
    iteratee: ResourceIteratee<T>,
  ): Promise<void> {
    let numElements = 0;
    let start = 0;
    let end = this.perPage;

    do {
      const response = await this.getRequest(`${uri}{${start},${end}}`, method);
      for (const item of response[accessor]) {
        await iteratee(item);
      }

      numElements = response[accessor].length;
      start = end - 1;
      end = end + this.perPage;
    } while (numElements == this.perPage);
  }

  private async paginatedBuildRequest<T>(
    uri: string,
    method: 'GET',
    iteratee: ResourceIteratee<T>,
  ): Promise<void> {
    let buildLength = 0;
    let start = 0;
    let end = this.perPage;
    do {
      const response = await this.getRequest(
        `${uri}tree=allBuilds[url]{${start},${end}}`,
        method,
      );

      for (const item of response.allBuilds || []) {
        await iteratee(item);
      }

      if (response.allBuilds) {
        buildLength = response.allBuilds.length;
      }

      start = end;
      end += this.perPage;
    } while (buildLength);
  }

  public async verifyAuthentication(): Promise<void> {
    const uri = this.withBaseUri(`/api/json`);
    try {
      await this.getRequest(uri, 'GET');
    } catch (err) {
      throw new IntegrationProviderAuthenticationError({
        cause: err,
        endpoint: uri,
        status: err.status,
        statusText: err.statusText,
      });
    }
  }

  public async iterateUsers(
    iteratee: ResourceIteratee<JenkinsUser>,
  ): Promise<void> {
    await this.paginatedGeneralRequest<JenkinsUser>(
      this.withBaseUri(
        `/asynchPeople/api/json?tree=users[lastChange,user[absoluteUrl,fullName]]`,
      ),
      'GET',
      'users',
      iteratee,
    );
  }

  public async iterateJobs(
    iteratee: ResourceIteratee<JenkinsJob>,
  ): Promise<void> {
    await this.paginatedGeneralRequest<JenkinsJob>(
      this.withBaseUri(`/api/json?tree=jobs[_class,url,name,color]`),
      'GET',
      'jobs',
      iteratee,
    );
  }

  public async iterateSubJobs(
    iteratee: ResourceIteratee<JenkinsJob>,
    url: string,
  ): Promise<void> {
    await this.paginatedGeneralRequest<JenkinsJob>(
      `${url}api/json?tree=jobs[_class,url,name,color]`,
      'GET',
      'jobs',
      iteratee,
    );
  }

  public async fetchJobConfig(jobUrl: string): Promise<JenkinsJobConfig> {
    const response = await this.getXmlRequest(`${jobUrl}config.xml`, 'GET');
    return this.xmlParser.parseStringPromise(response);
  }

  public async iterateBuilds(
    iteratee: ResourceIteratee<JenkinsBuild>,
    projectUrl: string,
  ): Promise<void> {
    await this.paginatedBuildRequest<JenkinsBuild>(
      `${projectUrl}api/json?`,
      'GET',
      iteratee,
    );
  }

  public async fetchBuildDetails(url: string): Promise<JenkinsBuild> {
    return await this.getRequest(`${url}/api/json`, 'GET');
  }

  public async getRoleMembers(role: JenkinsRole): Promise<any> {
    const request = await this.getRequest(
      this.withBaseUri(
        `/role-strategy/strategy/getRole?type=${role.roleType}&roleName=${role.name}`,
      ),
      'GET',
    );
    return request.sids;
  }

  public async getRoleDetails(role: string): Promise<JenkinsRole> {
    const colonIndex = role.lastIndexOf(':');
    const roleName = role.substring(colonIndex + 1);
    const roleType = role.substring(0, colonIndex);

    const request = await this.getRequest(
      this.withBaseUri(
        `/role-strategy/strategy/getRole?type=${roleType}&roleName=${roleName}`,
      ),
      'GET',
    );
    request.name = roleName;
    request.roleType = `${roleType}`;
    return request;
  }
}

export function createAPIClient(config: IntegrationConfig): APIClient {
  return new APIClient(config);
}
