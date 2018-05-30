import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import core from 'modules/core/redux';
import index from 'modules/index/redux';
import {
  asyncStateReducer,
  asyncDataReducer,
  asyncCacheReducer
} from 'resource/reducer';

export default combineReducers({
  '@request': asyncStateReducer,
  '@resource': asyncDataReducer,
  '@cache': asyncCacheReducer,
  core,
  index,
  routing: routerReducer
});
