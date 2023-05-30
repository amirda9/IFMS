import {RequestList, RequestListTypes} from '~/util/RequestList';

export const HttpRequestAction = 'HTTP REQUEST [Global]';

export type HttpActionType<
  K extends keyof RequestListTypes = keyof RequestListTypes,
> = {
  type: typeof HttpRequestAction;
  _name: K;
  payload: {
    requestData: RequestListTypes[K];
    actionData: (typeof RequestList)[K];
  };
};
const httpRequestAction = <
  K extends keyof RequestListTypes = keyof RequestListTypes,
>(
  requestName: K,
  requestData: RequestListTypes[K],
): HttpActionType<K> => ({
  type: HttpRequestAction,
  payload: {requestData, actionData: RequestList[requestName]},
  _name: requestName,
});

export default httpRequestAction;
