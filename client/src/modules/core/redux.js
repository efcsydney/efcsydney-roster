import { combineReducers } from 'redux';
import { createAction, handleAction } from 'redux-actions';

const PREFIX = 'core';

export const retrieveServices = createAction(`${PREFIX}/RETRIEVE_SERVICES`);
export const retrieveServicesComplete = createAction(
  `${PREFIX}/RETRIEVE_SERVICES_COMPLETE`
);
export const setMeta = createAction(`${PREFIX}/SET_META`);
export const switchCategory = createAction(`${PREFIX}/SWITCH_CATEGORY`);

const defaultState = {
  data: {
    services: []
  },
  meta: {
    lang: 'en-AU',
    category: 'english'
  }
};

export default combineReducers({
  data: combineReducers({
    services: handleAction(
      retrieveServicesComplete,
      (state, { payload }) => payload,
      defaultState.data.services
    )
  }),
  meta: combineReducers({
    lang: handleAction(
      setMeta,
      (state, { payload }) => payload.lang || state,
      defaultState.meta.lang
    ),
    category: handleAction(
      switchCategory,
      (state, { payload }) => payload,
      defaultState.meta.category
    )
  })
});
