export type JenkinsUser = {
  lastChange: string | null;
  project: string | null;
  user: {
    absoluteUrl: string;
    fullName: string;
  };
  id: string;
};

export type JenkinsJob = {
  _class: string;
  name: string;
  url: string;
  color: string;
  projectUrls: string[];
};

export type JenkinsJobConfig = {
  project?: {
    properties?: [
      {
        'com.coravy.hudson.plugins.github.GithubProjectProperty': [
          {
            projectUrl: string[];
          },
        ];
      },
    ];
  };
};

export type JenkinsRepository = {
  url: string;
  name: string;
};

export type JenkinsRole = {
  name: string;
  roleType: string;
  credentialsProviderManageDomains: string;
  credentialsProviderView: string;
  credentialsProviderUpdate: string;
  credentialsProviderDelete: string;
  credentialsProviderCreate: string;
  SCMTag: string;
  modelViewDelete: string;
  modelComputerConnect: string;
  modelRunDelete: string;
  modelComputerCreate: string;
  modelViewConfigure: string;
  modelComputerBuild: string;
  modelItemConfigure: string;
  modelHudsonAdminister: string;
  modelItemCancel: string;
  modelItemRead: string;
  modelComputerDelete: string;
  modelItemBuild: string;
  modelItemMove: string;
  modelItemDiscover: string;
  modelHudsonRead: string;
  modelItemCreate: string;
  modelItemWorkspace: string;
  modelComputerProvision: string;
  modelRunReplay: string;
  modelViewRead: string;
  modelViewCreate: string;
  modelItemDelete: string;
  modelComputerConfigure: string;
  modelComputerDisconnect: string;
  modelRunUpdate: string;
};
