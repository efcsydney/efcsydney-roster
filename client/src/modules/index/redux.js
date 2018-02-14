import _ from 'lodash';
import { combineReducers } from 'redux';
import reduceReducers from 'reduce-reducers';
import {
  combineActions,
  createAction,
  handleAction,
  handleActions
} from 'redux-actions';
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
export const setEvent = createAction(`${PREFIX}/SET_EVENT`);
export const setSelectedData = createAction(`${PREFIX}/SET_SELECTED_DATA`);
export const setServiceInfo = createAction(`${PREFIX}/SET_SERVICE_INFO`);
export const toggleEditRole = createAction(`${PREFIX}/TOGGLE_EDIT_ROLE`);
export const toggleEditDay = createAction(`${PREFIX}/TOGGLE_EDIT_DAY`);

export const defaultState = {
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

export const dataReducer = handleActions(
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
      return dotProp.set(state, `${dayIndex}.serviceInfo`, payload.serviceInfo);
    },
    [setEvent]: (state, { payload }) => {
      const dayIndex = _.findIndex(state, { date: payload.date });
      if (dayIndex === -1) {
        return state;
      }

      const memberIndex = _.findIndex(state[dayIndex].members, {
        role: payload.role
      });
      if (memberIndex === -1) {
        return state;
      }

      return dotProp.set(
        state,
        `${dayIndex}.members.${memberIndex}.name`,
        payload.name
      );
    },
    [setServiceInfo]: (state, { payload }) => {
      const dayIndex = _.findIndex(
        state,
        day => day.serviceInfo.id === payload.id
      );
      if (dayIndex === -1) {
        return state;
      }
      return dotProp.set(state, `${dayIndex}.serviceInfo`, payload);
    }
  },
  defaultState.data
);

export const selectedDataReducer = reduceReducers(
  handleAction(
    setSelectedData,
    (state, { payload }) => payload,
    defaultState.meta.selectedData
  ),
  handleAction(
    combineActions(toggleEditDay, toggleEditRole),
    {
      next(state, { payload }) {
        const isClosing =
          payload === false || (state && _.isUndefined(payload));
        return isClosing ? null : state;
      }
    },
    defaultState.meta.selectedData
  )
);

const queryReducer = handleAction(
  requestRetrieveEvents,
  (state, { payload }) => payload,
  defaultState.meta.query
);

const isEditingDayReducer = handleActions(
  {
    [toggleEditDay]: (state, { payload }) =>
      _.isBoolean(payload) ? payload : !state,
    [receiveModifyServiceInfo]: () => false
  },
  defaultState.meta.isEditingDay
);

const isEditingRoleReducer = handleActions(
  {
    [toggleEditRole]: (state, { payload }) =>
      _.isBoolean(payload) ? payload : !state,
    [receiveModifyIdEvents]: () => false
  },
  defaultState.meta.isEditingRole
);

const isLoadingReducer = handleActions(
  {
    [requestRetrieveEvents]: () => true,
    [receiveRetrieveEvents]: () => false
  },
  defaultState.meta.isLoading
);

const isSavingReducer = handleActions(
  {
    [requestModifyIdEvents]: () => true,
    [receiveModifyIdEvents]: () => false,
    [requestModifyServiceInfo]: () => true,
    [receiveModifyServiceInfo]: () => false
  },
  defaultState.meta.isSaving
);

export default combineReducers({
  data: dataReducer,
  meta: combineReducers({
    query: queryReducer,
    isEditingDay: isEditingDayReducer,
    isEditingRole: isEditingRoleReducer,
    isLoading: isLoadingReducer,
    isSaving: isSavingReducer,
    selectedData: selectedDataReducer
  })
});
