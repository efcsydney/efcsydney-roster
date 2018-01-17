import { combineReducers } from 'redux';
import { createAction, handleAction } from 'redux-actions';
import Cookies from 'js-cookie';
import moment from 'moment';
import 'moment/locale/en-au';
import 'moment/locale/zh-tw';
import i18n from 'i18n';

const PREFIX = 'core';

export const switchCategory = createAction(
  `${PREFIX}/SWITCH_CATEGORY`,
  payload => {
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
        let lang;
        switch (payload) {
          case 'english':
            lang = 'en-AU';
            break;
          case 'chinese':
            lang = 'zh-TW';
            break;
          default:
            lang = 'en-US';
        }

        // FIXME - Side effects
        moment.locale(lang);
        i18n.changeLanguage(lang);

        return lang;
      },
      defaultState.meta.lang
    ),
    category: handleAction(
      switchCategory,
      (state, { payload }) => {
        Cookies.set('selectedService', payload);
        return payload;
      },
      defaultState.meta.category
    )
  })
});
