import {RequestKeyExclude, ResponseListType} from '~/util/RequestList';
import {HttpErrorType} from '~/types/errorsTypes';

export const HttpResponseAction = 'Http Response [http]';

type HttpPayloadType<K extends RequestKeyExclude = RequestKeyExclude> = {
  httpResponseStatus: 'success' | 'error';
  responseData?: Pick<ResponseListType, RequestKeyExclude>[K];
  error?: HttpErrorType;
  addToList?: boolean;
};

export type HttpResponseActionType<
  K extends RequestKeyExclude = RequestKeyExclude,
> = {
  type: typeof HttpResponseAction;
  _name: K;
  payload: HttpPayloadType;
};
const httpResponseAction = <K extends RequestKeyExclude = RequestKeyExclude>(
  requestName: K,
  payload: HttpPayloadType,
): HttpResponseActionType<K> => ({
  type: HttpResponseAction,
  payload,
  _name: requestName,
});

export default httpResponseAction;
