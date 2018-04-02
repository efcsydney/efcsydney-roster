import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import Index from './modules/index';
import Login from './modules/login';
import Admin from './modules/admin';

export default class App extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={Index} />
        <Route exact path="/chinese" component={Index} />
        <Route exact path="/english" component={Index} />
        <Route exact path="/preschool-junior" component={Index} />
        <Route exact path="/preschool-middle" component={Index} />
        <Route exact path="/preschool-senior" component={Index} />
        <Route exact path="/prayer" component={Index} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/admin" component={Admin} />
        <Route path="/admin/edit/:id" component={Admin} />
        <Redirect to="/" />
      </Switch>
    );
  }
}
