import { combineReducers } from 'redux';
import { createAction, handleAction, handleActions } from 'redux-actions';
import ServiceInfoAPI from 'apis/serviceInfo';
import EventsAPI from 'apis/events';
import store from 'store';

const PREFIX = 'index';

export const receiveRetrieveEvents = createAction(
  `${PREFIX}/RECEIVE_RETRIEVE_EVENTS`
);
export const requestRetrieveEvents = createAction(
  `${PREFIX}/REQUEST_RETRIEVE_EVENTS`,
  payload => {
    EventsAPI.retrieve(payload).then(data =>
      store.dispatch(receiveRetrieveEvents(data))
    );
    return payload;
  }
);
export const receiveModifyServiceInfo = createAction(
  `${PREFIX}/REQUEST_MODIFY_SERVICE_INFO`
);
export const requestModifyServiceInfo = createAction(
  `${PREFIX}/REQUEST_MODIFY_SERVICE_INFO`,
  payload => {
    const { id, ...body } = payload;
    ServiceInfoAPI.modify(id, body).then(data =>
      store.dispatch(receiveModifyServiceInfo(data))
    );
    return payload;
  }
);

const defaultState = {
  data: {},
  meta: {
    query: {},
    isLoading: false,
    isSaving: false
  }
};

export default combineReducers({
  data: handleAction(
    receiveRetrieveEvents,
    (state, { payload }) => payload,
    defaultState.data
  ),
  meta: combineReducers({
    query: handleAction(
      requestRetrieveEvents,
      (state, { payload }) => payload,
      defaultState.meta.query
    ),
    isLoading: handleActions(
      {
        [requestRetrieveEvents]: () => true,
        [receiveRetrieveEvents]: () => false
      },
      defaultState.meta.isLoading
    ),
    isSaving: handleActions(
      {
        [requestModifyServiceInfo]: () => true,
        [receiveModifyServiceInfo]: () => false
      },
      defaultState.meta.isSaving
    )
  })
});
