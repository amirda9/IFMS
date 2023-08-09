import {
  AccessCreateType,
  AccessListType,
  ActionRequestType,
  LoginResponseType,
  NetworkDetailType,
  NetworkType,
  UserListType,
} from '~/types';
import * as api from '~/constant/api';

export const excludeList = ['categoryList'];
export type RequestKeyExclude = keyof Omit<RequestListTypes, 'uploadFile'>;

type RequestKeys =
  | 'login'
  | 'refresh'
  | 'networkList'
  | 'networkDetail'
  | 'networkCreate'
  | 'networkDelete'
  | 'networkUpdate'
  | 'networkAccessList'
  | 'userList'
  | 'networkAccessUpdate';
export const RequestList: Record<RequestKeys, ActionRequestType> = {
  login: {
    url: api.baseUrl + api.loginUrl,
    method: 'post',
    headers: {'content-type': 'application/x-www-form-urlencoded'},
  },
  refresh: {
    url: api.baseUrl + api.refreshTokenUrl,
    method: 'post',
    headers: {'content-type': 'application/x-www-form-urlencoded'},
  },
  userList: {
    url: api.baseUrl + api.userListUrl,
    method: 'get',
    auth: true,
  },
  networkCreate: {
    url: api.baseUrl + api.networkCreateUrl,
    method: 'post',
    auth: true,
  },
  networkList: {
    url: api.baseUrl + api.networkListUrl,
    method: 'get',
    auth: true,
  },
  networkDetail: {
    url: api.baseUrl + api.networkDetailUrl,
    method: 'get',
    auth: true,
  },
  networkDelete: {
    url: api.baseUrl + api.networkDetailUrl,
    method: 'delete',
    auth: true,
  },
  networkUpdate: {
    url: api.baseUrl + api.networkDetailUrl,
    method: 'put',
    auth: true,
  },
  networkAccessList: {
    url: api.baseUrl + api.networkAccessListUrl,
    method: 'get',
    auth: true,
  },
  networkAccessUpdate: {
    url: api.baseUrl + api.networkAccessListUpdate,
    method: 'post',
    auth: true,
  },
};

export type RequestListTypes = {
  login: {
    data: {
      username: string;
      password: string;
    };
  };
  refresh: {
    data: {refresh_token: string};
  };
  userList: undefined;
  networkCreate: {
    data: {
      name: string;
      description: string;
    };
  };
  networkList: undefined;
  networkDetail: {params: {networkId: string}};
  networkDelete: {params: {networkId: string}};
  networkUpdate: {params: {networkId: string}; data: {description: string}};
  networkAccessList: {params: {network_id: string}};
  networkAccessUpdate: {
    params: {network_id: string};
    data: {users: AccessCreateType[]};
  };
};

export type ResponseListType = {
  login: LoginResponseType;
  refresh: LoginResponseType;
  userList: UserListType[];
  networkCreate: NetworkType;
  networkList: NetworkType[];
  networkDetail: NetworkDetailType;
  networkDelete: {count: number};
  networkUpdate: NetworkType;
  networkAccessList: {users: AccessListType[]};
  networkAccessUpdate: {count: number};
};
