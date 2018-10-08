import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Container from './index';
import './index.css';

ReactDOM.render(
  React.createElement(Container),
  document.getElementById('root')
);