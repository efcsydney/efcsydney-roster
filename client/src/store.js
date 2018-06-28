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

if (_.includes(['development', 'docker'], process.env.NODE_ENV)) {
  middleware.push(logger);
}

const composedEnhancers = compose(applyMiddleware(...middleware), ...enhancers);
const store = createStore(rootReducer, initialState, composedEnhancers);
sagaMiddleware.run(rootSaga);

export default store;
