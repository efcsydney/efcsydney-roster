import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import Index from './modules/index';
import Login from './modules/login';
import Admin from './modules/admin';

export default () => (
  <Switch>
    <Route exact path="/" component={Index} />
    <Route exact path="/chinese" component={Index} />
    <Route exact path="/english" component={Index} />
    <Route exact path="/login" component={Login} />
    <Route exact path="/admin" component={Admin} />
    <Redirect to="/" />
  </Switch>
);
