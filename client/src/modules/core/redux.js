import { combineReducers } from 'redux';
import { createAction, handleAction } from 'redux-actions';
import Cookies from 'js-cookie';

const PREFIX = 'core';

export const retrieveServices = createAction(`${PREFIX}/RETRIEVE_SERVICES`);
export const retrieveServicesComplete = createAction(
  `${PREFIX}/RETRIEVE_SERVICES_COMPLETE`
);
export const setMeta = createAction(`${PREFIX}/SET_META`);
export const switchCategory = createAction(`${PREFIX}/SWITCH_CATEGORY`);

function getCategory() {
  let category = document.URL.match(
    /(chinese|english|preschool-junior|preschool-middle|preschool-senior|prayer)/g
  );
  if (category) {
    Cookies.set('selectedService', category[0]);
    return category[0];
  }

  category = Cookies.get('selectedService');
  return category ? category : 'english';
}

function getLang() {
  let category = document.URL.match(/(chinese|english)/g);
  category = category ? category[0] : Cookies.get('selectedService');

  switch (category) {
    case 'chinese':
      return 'zh-TW';
    case 'english':
      return 'en-AU';
    default:
      return 'en-AU';
  }
}

const defaultState = {
  data: {
    services: []
  },
  meta: {
    lang: getLang(),
    category: getCategory()
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
