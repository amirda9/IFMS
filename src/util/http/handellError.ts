import {AxiosError} from 'axios';
import {put, select, take} from 'redux-saga/effects';
import {RootState} from '~/store';
import {httpRequestAction, httpResponseAction} from '~/store/actions';
import {
  HttpResponseAction,
  HttpResponseActionType,
} from '~/store/actions/httpResponse.action';
import {RequestKeyExclude, RequestListTypes} from '~/util';

type ParamsType = {
  error: AxiosError<any>;
  auth?: boolean;
  actionName: keyof RequestListTypes;
  requestData: RequestListTypes[keyof RequestListTypes];
  addToList?: boolean;
};

export function* handelError({
  requestData,
  auth,
  error,
  actionName,
  addToList,
}: ParamsType) {
  const e = error as AxiosError<any>;
  if (
    auth &&
    e.isAxiosError &&
    e.response?.status === 403 &&
    e.response?.data?.code === 'token_not_valid'
  ) {
    const refresh: string = yield select(
      (state: RootState) => state.http.login?.data?.refresh_token,
    );
    yield put(httpRequestAction('refresh', {data: {refresh_token: refresh}}));
    let refreshAction: HttpResponseActionType = yield take(HttpResponseAction);
    while (refreshAction._name !== 'refresh') {
      refreshAction = yield take(HttpResponseAction);
    }
    if (refreshAction.payload.httpResponseStatus !== 'error') {
      yield put(httpRequestAction(actionName, requestData));
      return;
    }
  }
  yield put(
    httpResponseAction(actionName as RequestKeyExclude, {
      httpResponseStatus: 'error',
      error: JSON.parse(JSON.stringify(e?.response || {})),
      addToList: addToList,
    }),
  );
}
