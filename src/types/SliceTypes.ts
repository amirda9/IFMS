import {
  RequestKeyExclude,
  RequestListTypes,
  ResponseListType,
} from '~/util/RequestList';
import {HttpRequestStatusType} from '~/types/HttpRequestStatusType';
import {HttpErrorType} from './errorsTypes';

export type HttpSliceType<K extends RequestKeyExclude = RequestKeyExclude> = {
  [k in K]?: {
    httpRequestStatus: HttpRequestStatusType;
    data?: ResponseListType[k];
    error?: HttpErrorType;
    request?: RequestListTypes[k];
  };
};

export type UserAccessSliceType = {
  isEditingUserAccess: boolean;
};

export type UserGroupsSliceType = {
  isEditingGroupMembers: boolean;
};
