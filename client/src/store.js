import _ from 'lodash';
import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import createSagaMiddleware from 'redux-saga';
import createHistory from 'history/createHashHistory';
import rootReducer from './reducer';
import logger from 'redux-logger';
import rootSaga from './sagas';

export const history = createHistory();
const sagaMiddleware = createSagaMiddleware();

let initialState = {};
let enhancers = [];
let middleware = [sagaMiddleware, routerMiddleware(history)];

const env = process.env.REACT_APP_ENV || process.env.NODE_ENV;
console.log('[DEBUG] process.env.NODE_ENV: ', process.env.NODE_ENV); // eslint-disable-line
console.log('[DEBUG] process.env.REACT_APP_ENV: ', process.env.REACT_APP_ENV); // eslint-disable-line
if (env === 'development') {
  middleware.push(logger);
}

const composedEnhancers = compose(applyMiddleware(...middleware), ...enhancers);
const store = createStore(rootReducer, initialState, composedEnhancers);
sagaMiddleware.run(rootSaga);

export default store;
