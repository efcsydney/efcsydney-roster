import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import createHistory from 'history/createBrowserHistory';
import rootReducer from './reducer';
import logger from 'redux-logger';

export const history = createHistory();

let initialState = {};
let enhancers = [];
let middleware = [thunk, routerMiddleware(history)];

if (process.env.NODE_ENV === 'development') {
  middleware.push(logger);
}

const composedEnhancers = compose(applyMiddleware(...middleware), ...enhancers);

const store = createStore(rootReducer, initialState, composedEnhancers);

export default store;
