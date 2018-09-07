import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { ApolloProvider } from 'react-apollo';
import ApolloClient from 'apollo-boost';
import store, { history } from './store';
import App from './App';
import './index.css';

const env = process.env.REACT_APP_ENV || process.env.NODE_ENV;
let baseUrl = 'http://localhost:3001';
switch (env) {
  case 'production':
    baseUrl = 'https://roster.efcsydney.org';
    break;
  case 'qa':
    baseUrl = 'https://demo-roster.efcsydney.org';
    break;
  case 'development':
    baseUrl = 'http://localhost:3001';
    break;
  default:
}
const client = new ApolloClient({ uri: `${baseUrl}/graphql` });

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root') // eslint-disable-line no-undef
);
