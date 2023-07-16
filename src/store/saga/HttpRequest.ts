import {HttpActionType, HttpRequestAction} from '../actions/httpRequest.action';
import {takeEvery} from 'redux-saga/effects';
import {RequestDataType} from '~/types';
import {
  configHeader,
  convertObjectToFormData,
  convertObjectToUrlParams,
  handelError,
  request,
} from '~/util';

function* HttpRequest(action: HttpActionType) {
  const {
    actionData: {method, url, sagaName, headers, auth},
    requestData,
  } = action.payload;
  const data = requestData as RequestDataType;

  const requestHeaders: typeof headers | false = yield configHeader(
    headers!,
    auth,
  );
  if (requestHeaders === false) {
    return;
  }

  const urlWithParams = convertObjectToUrlParams(url, data?.params);
  const formData = convertObjectToFormData(data?.formData);

  try {
    yield request({
      config: {
        method,
        url: urlWithParams,
        headers: requestHeaders,
        data: formData || data?.data,
        params: data?.queryString,
      },
      addToList: data.addToList,
      sagaName,
      actionName: action._name,
    });
  } catch (error) {
    yield handelError({
      auth,
      error: error as any,
      requestData: action.payload.requestData,
      actionName: action._name,
      addToList: data?.addToList,
    });
  }
}

export default takeEvery(HttpRequestAction, HttpRequest);
