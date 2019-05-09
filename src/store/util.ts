import { ActionType } from 'typesafe-actions';
import { Middleware } from 'redux';

export type DispatchFunction<T, S> = (action: ActionType<any>, getState: () => S) => Promise<T>;

// Function to create async middleware to handle a specific action

export function getMiddleware<T, S> (
    actionType: string,
    request: ActionType<any>, success: ActionType<any>, failure: ActionType<any>,
    dispatchFunction: DispatchFunction<T, S>) {

  const middleware: Middleware<{}, S> = ({ getState }) => dispatch => async (action: ActionType<any>) => {
    dispatch(action);

    // We handle only one specific action type
    if (action.type !== actionType) {
      return;
    }

    dispatch(request());            // signal start of request
    try {
      let result: T = await dispatchFunction(action, getState);
      dispatch(success(result));    // signal success
    } catch (e) {
      dispatch(failure(e));         // signal failure
    }
  };

  return middleware;
};
