import {
  RequestKeyExclude,
  RequestListTypes,
  ResponseListType,
} from '~/util/RequestList';
import {AxiosError} from 'axios';

export const HttpResponseAction = 'Http Response [http]';

export type HttpResponseActionType<
  K extends RequestKeyExclude = RequestKeyExclude,
> = {
  type: typeof HttpResponseAction;
  _name: K;
  payload: {
    httpResponseStatus: 'success' | 'error';
    responseData?: Pick<ResponseListType, RequestKeyExclude>[K];
    error?: Error | AxiosError;
    addToList?: boolean;
  };
};
const httpResponseAction = <K extends RequestKeyExclude = RequestKeyExclude>(
  requestName: K,
  payload: {
    httpResponseStatus: 'success' | 'error';
    responseData?: Pick<ResponseListType, RequestKeyExclude>[K];
    error?: Error | AxiosError;
    addToList?: boolean;
  },
): HttpResponseActionType<K> => ({
  type: HttpResponseAction,
  payload,
  _name: requestName,
});

export default httpResponseAction;
