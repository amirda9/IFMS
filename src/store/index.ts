import {configureStore, Middleware} from '@reduxjs/toolkit';
import {httpReducer} from './slices/http.slice';
import changetyperstate from './slices/networkslice';
import alarmstype from './slices/alarmstypeslice';
import opticalroute from './slices/opticalroutslice'
import rtu from './slices/rtu'
import networktreeslice from './slices/networktreeslice'
import createSagaMiddleware from 'redux-saga';
import {AppSaga} from './saga';

const middlewares: Middleware[] = [];

const sagaMiddleware = createSagaMiddleware();

middlewares.push(sagaMiddleware);
export const store = configureStore({
  reducer: {
    http: httpReducer,
    network:changetyperstate,
    opticalroute:opticalroute,
    rtu:rtu,
    networktree:networktreeslice,
    alarmtypes:alarmstype
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(middlewares),
  devTools: true,
});

sagaMiddleware.run(AppSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
