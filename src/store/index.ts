import {configureStore, Middleware} from '@reduxjs/toolkit';
import {httpReducer} from './slices/http.slice';
import changetyperstate from './slices/networkslice';
import alarmstype from './slices/alarmstypeslice';
import opticalroute from './slices/opticalroutslice'
import rtu from './slices/rtu'
import networktreeslice from './slices/networktreeslice'
import testondemandSlice from './slices/testondemand'
import createSagaMiddleware from 'redux-saga'; 
import alarmsslice from './slices/alarmsslice'
import report from './slices/reportslice'
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
    alarmtypes:alarmstype,
    testondemandSlice:testondemandSlice,
    alarmsslice:alarmsslice,
    reportslice:report
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(middlewares),
  devTools: true,
});

sagaMiddleware.run(AppSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
