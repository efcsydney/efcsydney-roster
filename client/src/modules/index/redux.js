import { combineReducers } from 'redux';
import { createAction, handleAction } from 'redux-actions';

const PREFIX = 'index';

export const switchCategory = createAction(`${PREFIX}/SWITCH_CATEGORY`);

const defaultState = {
  data: [],
  meta: {
    lang: 'en-US',
    category: 'english'
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
