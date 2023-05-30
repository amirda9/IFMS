import {
  RequestKeyExclude,
  RequestListTypes,
  ResponseListType,
} from '~/util/RequestList';
import {HttpRequestStatusType} from '~/types/HttpRequestStatusType';
import {AxiosError} from 'axios';

export type HttpSliceType<K extends RequestKeyExclude = RequestKeyExclude> = {
  [k in K]?: {
    httpRequestStatus: HttpRequestStatusType;
    data?: ResponseListType[k];
    error?: AxiosError | Error;
    request?: RequestListTypes[k];
  };
};
