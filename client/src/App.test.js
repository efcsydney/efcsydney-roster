import React from 'react';
import { shallow } from 'enzyme';
import App from './App';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import store, { history } from './store';

xit('renders without crashing', () => {
  shallow(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <App />
      </ConnectedRouter>
    </Provider>
  );
});
