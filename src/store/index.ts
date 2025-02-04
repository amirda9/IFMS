import { configureStore, Middleware } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Default local storage for web
import { httpReducer } from './slices/http.slice';
import createIndexedDBStorage from "./indexedDBStorage"; // Path to the custom storage file
import changetyperstate from './slices/networkslice';
import alarmstype from './slices/alarmstypeslice';
import opticalroute from './slices/opticalroutslice';
import rtu from './slices/rtu';
import networktreeslice from './slices/networktreeslice';
import testondemandSlice from './slices/testondemand';
import createSagaMiddleware from 'redux-saga';
import alarmsslice from './slices/alarm/alarmsslice';
import report from './slices/reportslice';
import resultbrouserRtuslice from './slices/resultbrouserRtuslice';
import { AppSaga } from './saga';
import resultbroserOpticalroutslice from './slices/resultbroserOpticalroutslice';
import { alarmApi } from './slices/alarm/alarmapislice';
const middlewares: Middleware[] = [];
const sagaMiddleware = createSagaMiddleware();
middlewares.push(sagaMiddleware);

// Create a persist config for networktree
const networktreePersistConfig = {
  key: 'networktree',
  storage: createIndexedDBStorage("MyReduxDB", "networktreeStore"), // Use custom storage

  // storage,
};

// Wrap the networktree reducer with persistReducer
const persistedNetworktreeReducer = persistReducer(
  networktreePersistConfig,
  networktreeslice
);

export const store = configureStore({
  reducer: {
    http: httpReducer,
    network: changetyperstate,
    opticalroute: opticalroute,
    rtu: rtu,
    networktree: persistedNetworktreeReducer, // Use persisted reducer here
    alarmtypes: alarmstype,
    testondemandSlice: testondemandSlice,
    alarmsslice: alarmsslice,
    reportslice: report,
    resultbrouserRtuslice: resultbrouserRtuslice,
    resultbroserOpticalroutslice: resultbroserOpticalroutslice,
    [alarmApi.reducerPath]: alarmApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(middlewares).concat(alarmApi.middleware),
  devTools: true,
});

sagaMiddleware.run(AppSaga);

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;