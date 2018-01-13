import { combineReducers } from 'redux';
import { createAction, handleAction } from 'redux-actions';
import Cookies from 'js-cookie';

const PREFIX = 'core';

export const switchCategory = createAction(
  `${PREFIX}/SWITCH_CATEGORY`,
  payload => {
    Cookies.set('selectedService', payload);
    return payload;
  }
);

function getCategory() {
  let category = document.URL.match(/(chinese|english)/g);
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
      return 'en-US';
  }
}

const defaultState = {
  data: [],
  meta: {
    lang: getLang(),
    category: getCategory()
  }
};

export default combineReducers({
  meta: combineReducers({
    lang: handleAction(
      switchCategory,
      (state, { payload }) => {
        switch (payload) {
          case 'english':
            return 'en-AU';
          case 'chinese':
            return 'zh-TW';
          default:
            return 'en-US';
        }
      },
      defaultState.meta.lang
    ),
    category: handleAction(
      switchCategory,
      (state, { payload }) => payload,
      defaultState.meta.category
    )
  })
});
