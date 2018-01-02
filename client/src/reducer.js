import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import index from './modules/Index/redux';

export default combineReducers({
  index,
  routing: routerReducer
});
