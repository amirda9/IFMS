// eslint-disable-next-line prettier/prettier
import type {AxiosHeaders, Method,RawAxiosRequestHeaders} from 'axios';
import {FormDataValueType} from '~/util';

export type RequestType<N extends string, D> = {
  code: number;
  message: string;
  error: boolean;
  data: D;
  __typename: N;
};

export type RequestListType<N extends string, D> = {
  code: number;
  message: string;
  error: boolean;
  data: {
    [K in string]: {
      current_page: number;
      data: D[];
      first_page_url: string;
      from: number;
      last_page: number;
      last_page_url: string;
      links: Array<{url: null | string; label: string; active: boolean}>;
      next_page_url: null | string;
      path: string;
      per_page: number;
      prev_page_url: null | string;
      to: number;
      total: number;
    };
  };
  __typename: N;
};

export type ActionRequestType = {
  method: Method;
  url: string;
  sagaName?: string;
  headers?: RawAxiosRequestHeaders | AxiosHeaders;
  auth?: boolean;
};
export type RequestDataType = {
  data: any;
  params: {[k: string]: string | number};
  formData: Record<string, FormDataValueType>;
  queryString: {[k: string]: string | number};
  addToList?: boolean;
};
