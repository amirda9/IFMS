import {all} from 'redux-saga/effects';
import HttpRequest from './HttpRequest';

export function* AppSaga() {
  yield all([HttpRequest]);
}
