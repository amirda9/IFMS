import {ActionRequestType, LoginResponseType} from '~/types';
import * as api from '~/constant/api';

export const excludeList = ['categoryList'];
export type RequestKeyExclude = keyof Omit<RequestListTypes, 'uploadFile'>;

type RequestKeys = 'login' | 'refresh';
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
};

export type ResponseListType = {
  login: LoginResponseType;
  refresh: LoginResponseType;
};
