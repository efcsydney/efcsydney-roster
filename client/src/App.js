import React from 'react';
import { Route } from 'react-router-dom';
import Index from './modules/index';

export default () => (
  <div>
    <Route exact path="/" component={Index} />
  </div>
);
