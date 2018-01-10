import { combineReducers } from 'redux';
import { createAction, handleAction } from 'redux-actions';
import Cookies from 'js-cookie';

const PREFIX = 'core';

export const switchCategory = createAction(`${PREFIX}/SWITCH_CATEGORY`);

function getServiceName() {
  const urlServiceRegex = document.URL.match(/(chinese|enghlish)/g);
  let serviceName = urlServiceRegex;
  if (serviceName) {
    return serviceName;
  }
  serviceName = Cookies.get('selectedService');
  return serviceName ? serviceName : 'english';
}

const defaultState = {
  data: [],
  meta: {
    lang: 'en-US',
    category: getServiceName()
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
