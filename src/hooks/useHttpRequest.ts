import {useEffect, useRef} from 'react';
import {useAppDispatch, useAppSelector} from '~/hooks/reduxHooks';
import {RootState} from '~/store';
import {RequestKeyExclude, RequestListTypes} from '~/util/RequestList';
import {httpRequestAction} from '~/store/actions';
import {httpClear} from '~/store/slices';
import {shallowEqual} from 'react-redux';

export interface Request {
  <K extends RequestKeyExclude>(
    requestName: K,
    requestData: RequestListTypes[K],
  ): void;
}

interface UseHttpRequest {
  <S>(effects: {
    deps?: any[];
    selector: (state: RootState) => S;
    onUpdate?: (lastState: S, state: S) => void;
    clearAfterUnmount?: RequestKeyExclude[];
    initialRequests?: (request: Request, state: S) => void;
  }): {
    state: S;
    request: Request;
    dispatch: ReturnType<typeof useAppDispatch>;
  };
}

const useHttpRequest: UseHttpRequest = effects => {
  const dispatch = useAppDispatch();
  const state = useAppSelector(effects.selector, shallowEqual);
  const lastState = useRef(state);

  useEffect(() => {
    effects.onUpdate?.(lastState.current, state);

    lastState.current = state;
  }, [state, ...(effects.deps || [])]);

  const request: Request = (requestName, requestData) => {
    dispatch(httpRequestAction(requestName, requestData));
  };

  useEffect(() => {
    effects.initialRequests?.(request, state);
    if (effects.clearAfterUnmount) {
      return () => {
        dispatch(httpClear(effects.clearAfterUnmount!));
      };
    }
  }, []);

  return {state, request, dispatch};
};

export default useHttpRequest;
