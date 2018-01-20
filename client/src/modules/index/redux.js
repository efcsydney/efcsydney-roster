import _ from 'lodash';
import { combineReducers } from 'redux';
import { createAction, handleAction, handleActions } from 'redux-actions';
import ServiceInfoAPI from 'apis/serviceInfo';
import EventsAPI from 'apis/events';
import store from 'store';
import moment from 'moment';
import dotProp from 'dot-prop-immutable';

const PREFIX = 'index';

export const receiveRetrieveEvents = createAction(
  `${PREFIX}/RECEIVE_RETRIEVE_EVENTS`
);
export const requestRetrieveEvents = createAction(
  `${PREFIX}/REQUEST_RETRIEVE_EVENTS`,
  payload => {
    EventsAPI.retrieve(payload).then(({ data }) =>
      store.dispatch(receiveRetrieveEvents(data))
    );
    return payload;
  }
);
export const receiveModifyIdEvents = createAction(
  `${PREFIX}/RECEIVE_MODIFY_ID_EVENTS`
);
export const requestModifyIdEvents = createAction(
  `${PREFIX}/REQUEST_MODIFY_ID_EVENTS`,
  payload => {
    EventsAPI.modify(payload).then(() => {
      store.dispatch(receiveModifyIdEvents(payload));
    });
    return payload;
  }
);
export const receiveModifyServiceInfo = createAction(
  `${PREFIX}/RECEIVE_MODIFY_SERVICE_INFO`
);
export const requestModifyServiceInfo = createAction(
  `${PREFIX}/REQUEST_MODIFY_SERVICE_INFO`,
  payload => {
    let { id, ...body } = payload;
    body = dotProp.set(body, 'footnote', body.footnote.trim());
    body = dotProp.set(body, 'skipReason', body.skipReason.trim());
    body = dotProp.set(body, 'skipService', !!body.skipReason);
    ServiceInfoAPI.modify(id, body).then(() =>
      store.dispatch(
        receiveModifyServiceInfo({ id, serviceInfo: { id, ...body } })
      )
    );
    return payload;
  }
);
export const setSelectedData = createAction(`${PREFIX}/SET_SELECTED_DATA`);
export const toggleEditRole = createAction(`${PREFIX}/TOGGLE_EDIT_ROLE`);
export const toggleEditDay = createAction(`${PREFIX}/TOGGLE_EDIT_DAY`);

const defaultState = {
  data: [],
  meta: {
    isEditingDay: false,
    isEditingRole: false,
    isLoading: false,
    isSaving: false,
    query: {},
    selectedData: null
  }
};

export default combineReducers({
  data: handleActions(
    {
      [receiveRetrieveEvents]: (state, { payload }) => payload,
      [receiveModifyIdEvents]: (state, { payload }) => {
        const dayIndex = _.findIndex(state, {
          date: moment(payload.date).format('YYYY-MM-DD')
        });
        const roleIndex = _.findIndex(state[dayIndex].members, {
          role: payload.role
        });

        return dotProp.set(
          state,
          `${dayIndex}.members.${roleIndex}.name`,
          payload.name
        );
      },
      [receiveModifyServiceInfo]: (state, { payload }) => {
        const dayIndex = _.findIndex(state, day => {
          const id = _.get(day, 'serviceInfo.id', null);
          return id === payload.id;
        });
        return dotProp.set(
          state,
          `${dayIndex}.serviceInfo`,
          payload.serviceInfo
        );
      }
    },
    defaultState.data
  ),
  meta: combineReducers({
    query: handleAction(
      requestRetrieveEvents,
      (state, { payload }) => payload,
      defaultState.meta.query
    ),
    isEditingDay: handleActions(
      {
        [toggleEditDay]: (state, { payload }) =>
          _.isBoolean(payload) ? payload : !state,
        [receiveModifyServiceInfo]: () => false
      },
      defaultState.meta.isEditingDay
    ),
    isEditingRole: handleActions(
      {
        [toggleEditRole]: (state, { payload }) =>
          _.isBoolean(payload) ? payload : !state,
        [receiveModifyIdEvents]: () => false
      },
      defaultState.meta.isEditingRole
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
        [requestModifyIdEvents]: () => true,
        [receiveModifyIdEvents]: () => false,
        [requestModifyServiceInfo]: () => true,
        [receiveModifyServiceInfo]: () => false
      },
      defaultState.meta.isSaving
    ),
    selectedData: handleActions(
      {
        [toggleEditDay]: (state, { payload }) => {
          const isClosing =
            payload === false || (state && _.isUndefined(payload));
          return isClosing ? null : state;
        },
        [toggleEditRole]: (state, { payload }) => {
          const isClosing =
            payload === false || (state && _.isUndefined(payload));
          return isClosing ? null : state;
        },
        [setSelectedData]: (state, { payload }) => payload
      },
      defaultState.meta.selectedData
    )
  })
});
