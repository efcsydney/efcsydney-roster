import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import core from 'modules/core/redux';

export default combineReducers({
  core,
  routing: routerReducer
});
