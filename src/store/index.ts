import {configureStore, Middleware} from '@reduxjs/toolkit';
import {httpReducer} from './slices/http.slice';
import changetyperstate from './slices/networkslice';
import opticalroute from './slices/opticalroutslice'
import createSagaMiddleware from 'redux-saga';
import {AppSaga} from './saga';

const middlewares: Middleware[] = [];

const sagaMiddleware = createSagaMiddleware();

middlewares.push(sagaMiddleware);
export const store = configureStore({
  reducer: {
    http: httpReducer,
    network:changetyperstate,
    opticalroute:opticalroute
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(middlewares),
  devTools: true,
});

sagaMiddleware.run(AppSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
