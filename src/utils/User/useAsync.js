import * as React from "react";

const REQUEST_STATUS = {
  IDLE: "idle",
  PENDING: "pending",
  RESOLVED: "resolved",
  REJECTED: "rejected",
};

const asyncReducer = (state, action) => {
  switch (action.type) {
    case REQUEST_STATUS.PENDING:
      return {
        status: REQUEST_STATUS.PENDING,
        data: null,
        error: null
      }

    case REQUEST_STATUS.RESOLVED:
      return {
        status: REQUEST_STATUS.RESOLVED,
        data: action.data,
        error: null
      }

    case REQUEST_STATUS.REJECTED:
      return {
        status: REQUEST_STATUS.REJECTED,
        data: null,
        error: action.error
      }

      
    default:
      throw Error(`Unhandled status: ${action.type}`);
  }
}

const useSafeDispatch = (dispatch) => {

  const mounted = React.useRef(false);

  React.useLayoutEffect(() => {
    mounted.current = true;
    return () => (mounted.current = false);
  }, []);

  return React.useCallback(
    (...args) => (mounted.current ? dispatch(...args) : void 0),
    [dispatch]
  );
};

const useAsync = (initialState) => {
  const [state, unsafeDispatch] = React.useReducer(asyncReducer, {
    status: REQUEST_STATUS.IDLE,
    user: null,
    error: null,
    ...initialState
  });

  const dispatch = useSafeDispatch(unsafeDispatch);

  const run = React.useCallback((promise) => {
    dispatch({ type: REQUEST_STATUS.PENDING});
    promise.then(
      (data) => {
        dispatch({ type: REQUEST_STATUS.RESOLVED, data});
      },
      (error) => {
        dispatch({ type: REQUEST_STATUS.REJECTED, error});
      }
    );
  }, [dispatch]);

  return { ...state, run}
}

export { useAsync, REQUEST_STATUS };
