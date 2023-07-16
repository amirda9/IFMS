import {AxiosHeaders, RawAxiosRequestHeaders} from 'axios';
import {select, cancelled} from 'redux-saga/effects';
import {RootState} from '~/store';
import {empty} from '~/util';
export function* configHeader(
  headers: RawAxiosRequestHeaders | AxiosHeaders,
  auth?: boolean,
) {
  if (!auth) {
    return headers;
  }
  const requestHeaders = {...headers};
  const token: string = yield select(
    (state: RootState) =>
      state.http.refresh?.data?.access_token ||
      state.http.login?.data?.access_token,
  );
  if (empty.includes(token)) {
    return false;
  }
  requestHeaders.Authorization = `Bearer ${token}`;
  return requestHeaders;
}
