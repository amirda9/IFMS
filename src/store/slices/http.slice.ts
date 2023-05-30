import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {HttpActionType, HttpRequestAction} from '../actions/httpRequest.action';
import {excludeList, RequestKeyExclude} from '~/util/RequestList';
import {
  HttpResponseAction,
  HttpResponseActionType,
} from '../actions/httpResponse.action';
import {HttpSliceType} from '~/types/HttpSliceType';
import {
  SET_STORAGE,
  SetStorageActionType,
} from '~/store/actions/setStorage.action';

const initialState: HttpSliceType = {};

export const httpsSlice = createSlice({
  name: 'http',
  initialState,
  reducers: {
    httpClear: (state, action: PayloadAction<Array<RequestKeyExclude>>) => {
      const newState = {...state};
      action.payload.forEach(name => {
        newState[name] = {httpRequestStatus: 'idle'};
      });
      return newState;
    },
  },

  extraReducers: builder => {
    builder.addCase(HttpRequestAction, (state, action: HttpActionType) => {
      if (!excludeList.includes(action._name)) {
        return {
          ...state,
          [action._name]: {
            ...state[action._name as RequestKeyExclude],
            httpRequestStatus: 'loading',
            request: action.payload.requestData,
          },
        };
      }
      return state;
    });

    builder.addCase(
      HttpResponseAction,
      (state, action: HttpResponseActionType) => {
        const {httpResponseStatus, responseData, error} = action.payload;

        return {
          ...state,
          [action._name]: {
            httpRequestStatus: httpResponseStatus,
            error,
            data: httpResponseStatus === 'success' ? responseData : undefined,
            request: state[action._name]!.request,
          },
        };
      },
    );

    builder.addCase(SET_STORAGE, (state, action: SetStorageActionType) => {
      if (action.payload.status === 'success') {
        const {token, refresh} = action.payload.data!;
        return {
          ...state,
          token: token?.httpRequestStatus === 'success' ? token : undefined,
          refresh:
            refresh?.httpRequestStatus === 'success' ? refresh : undefined,
        };
      }
      return state;
    });
  },
});
export const {httpClear} = httpsSlice.actions;
export const httpsReducer = httpsSlice.reducer;
