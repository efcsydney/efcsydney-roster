import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import Index from './modules/index';

export default () => (
  <Switch>
    <Route exact path="/" component={Index} />
    <Route exact path="/chinese" component={Index} />
    <Route exact path="/english" component={Index} />
    <Redirect to="/" />
  </Switch>
);
