import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import core from 'modules/core/redux';
import index from 'modules/index/redux';

export default combineReducers({
  core,
  index,
  routing: routerReducer
});
