import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import core from 'modules/core/redux';
import index from 'modules/index/redux';
import { resourceReducer } from 'resource';

export default combineReducers({
  resource: resourceReducer,
  core,
  index,
  routing: routerReducer
});
