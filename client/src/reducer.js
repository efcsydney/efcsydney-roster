import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import index from './modules/index/redux';

export default combineReducers({
  index,
  routing: routerReducer
});
