import {configureStore, Middleware} from '@reduxjs/toolkit';
import {httpReducer, userAccessReducer, userGroupsReducer} from './slices';
import createSagaMiddleware from 'redux-saga';
import {AppSaga} from './saga';

const middlewares: Middleware[] = [];

const sagaMiddleware = createSagaMiddleware();

middlewares.push(sagaMiddleware);
export const store = configureStore({
  reducer: {
    http: httpReducer,
    userAccess: userAccessReducer,
    userGroups: userGroupsReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(middlewares),
  devTools: true,
});

sagaMiddleware.run(AppSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
