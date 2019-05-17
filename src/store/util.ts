import { ActionType } from 'typesafe-actions';
import { Middleware } from 'redux';

export type DispatchFunction<T, S> = (action: ActionType<any>, getState: () => S) => Promise<T>;

export type DispatchHandler<T, S> = {
  request: ActionType<any>;
  success: ActionType<any>;
  failure: ActionType<any>;
  dispatchFunction: DispatchFunction<T, S>;
};

export type DispatchHandlerMapping<T, S> = {
  actionType: string;
  handler: DispatchHandler<T, S>;
};

export type DispatchHandlers<T, S> = Map<string, DispatchHandler<T, S> >;

export function getAsyncHandler<T, S> (
      actionType: string,
      request: ActionType<any>, success: ActionType<any>, failure: ActionType<any>,
      dispatchFunction: DispatchFunction<T, S>): DispatchHandlerMapping<T, S> {

  return {
    actionType,
    handler: {
      request,
      success,
      failure,
      dispatchFunction
    }
  };
};

// Function to create async middleware (quite similar to Redux-Thunk) to handle specific actions
export function getAsyncMiddleware (handlers: DispatchHandlers<any, any>) {

  const middleware: Middleware<{}, {}> = ({ getState }) => dispatch => async (action: ActionType<any>) => {
    dispatch(action);

    // We handle only specific action types
    if (!handlers.has(action.type)) {
      return;
    }

    const handler = handlers.get(action.type);

    dispatch(handler.request());            // signal start of request
    try {
      let result = await handler.dispatchFunction(action, getState);
      dispatch(handler.success(result));    // signal success
    } catch (e) {
      dispatch(handler.failure(e));         // signal failure
    }
  };

  return middleware;
};
