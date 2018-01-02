import { combineReducers } from 'redux';

const defaultState = {
  data: [],
  meta: {
    lang: 'en-US',
    category: 'english'
  }
};

export default combineReducers(defaultState);
