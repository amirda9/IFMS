import axios, {AxiosRequestConfig, AxiosResponse} from 'axios';
import {put} from 'redux-saga/effects';
import {httpResponseAction} from '~/store/actions';
import {RequestKeyExclude} from '~/util';

type ParamsType = {
  config: AxiosRequestConfig<any>;
  actionName: string;
  sagaName?: string;
  addToList?: boolean;
};
export function* request({
  config,
  actionName,
  sagaName,
  addToList,
}: ParamsType) {
  const response: AxiosResponse = yield axios.request(config);
  if (sagaName) {
    yield put({type: sagaName, payload: response.data, _name: actionName});
  } else {
    yield put(
      httpResponseAction(actionName as RequestKeyExclude, {
        httpResponseStatus: 'success',
        responseData: response.data,
        addToList: addToList,
      }),
    );
  }
}
