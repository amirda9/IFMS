import {
  ActionRequestType,
  LoginResponseType,
  NetworkDetailType,
  NetworkType,
} from '~/types';
import * as api from '~/constant/api';

export const excludeList = ['categoryList'];
export type RequestKeyExclude = keyof Omit<RequestListTypes, 'uploadFile'>;

type RequestKeys = 'login' | 'refresh' | 'networkList' | 'networkDetail';
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
  networkList: {
    url: api.baseUrl + api.networkList,
    method: 'get',
    auth: true,
  },
  networkDetail: {
    url: api.baseUrl + api.networkDetail,
    method: 'get',
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
  networkList: undefined;
  networkDetail: {params: {networkId: string}};
};

export type ResponseListType = {
  login: LoginResponseType;
  refresh: LoginResponseType;
  networkList: NetworkType[];
  networkDetail: NetworkDetailType;
};
