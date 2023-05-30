import {HttpActionType, HttpRequestAction} from '../actions/httpRequest.action';
import {put, select, take, takeEvery} from 'redux-saga/effects';
import axios, {AxiosError, AxiosResponse} from 'axios';
import {httpRequestAction, httpResponseAction} from '../actions';
import {RequestKeyExclude} from '~/util/RequestList';
import {RequestDataType} from '~/types';
import {RootState} from '~/store';
import {
  HttpResponseAction,
  HttpResponseActionType,
} from '~/store/actions/httpResponse.action';
import {convertObjectToFormData, convertObjectToUrlParams} from '~/util';

function* HttpRequest(action: HttpActionType) {
  const {
    actionData: {method, url, sagaName, headers, auth},
    requestData,
  } = action.payload;

  const data = requestData as RequestDataType;

  let requestHeaders: typeof headers = {};
  if (headers) {
    requestHeaders = {...requestHeaders, ...headers};
  }
  if (auth) {
    const token: string = yield select(
      ({http: {refresh, login}}: RootState) =>
        refresh?.data?.access_token || login?.data?.access_token,
    );
    if ([null, undefined, ''].includes(token)) {
      return;
    }
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  let urlWithParams = convertObjectToUrlParams(url, data?.params);
  let formData = convertObjectToFormData(data?.formData);

  try {
    const response: AxiosResponse = yield axios.request({
      method,
      url: urlWithParams,
      headers: requestHeaders,
      data: formData || data?.data,
      params: data?.queryString,
    });
    if (sagaName) {
      yield put({type: sagaName, payload: response.data, _name: action._name});
    } else {
      yield put(
        httpResponseAction(action._name as RequestKeyExclude, {
          httpResponseStatus: 'success',
          responseData: response.data,
          addToList: data?.addToList,
        }),
      );
    }
  } catch (error) {
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
      let refreshAction: HttpResponseActionType = yield take(
        HttpResponseAction,
      );
      while (refreshAction._name !== 'refresh') {
        refreshAction = yield take(HttpResponseAction);
      }
      if (refreshAction.payload.httpResponseStatus !== 'error') {
        yield put(httpRequestAction(action._name, action.payload.requestData));
        return;
      }
    }
    yield put(
      httpResponseAction(action._name as RequestKeyExclude, {
        httpResponseStatus: 'error',
        error: JSON.parse(JSON.stringify(e?.response || {})),
        addToList: data?.addToList,
      }),
    );
  }
}

export default takeEvery(HttpRequestAction, HttpRequest);
