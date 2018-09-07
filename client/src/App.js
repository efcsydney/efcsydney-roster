import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import Index from './modules/index';
import Login from './modules/login';
import AdminUsers from './modules/admin/users';
import AdminServices from './modules/admin/services';
import { TagManager } from 'components';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.env = process.env.REACT_APP_ENV || process.env.NODE_ENV;
  }
  appendSentry() {
    const env = this.env;
    if (env === 'qa' || env === 'production') {
      const sentryInit = document.createElement('script');
      const sentryInitHTML = document.createTextNode(
        `Raven.config('https://6d4d9e488cda4ef59dddc1e282a24a7b@sentry.io/263713', {
            environment: '${env}'
          }).install();`
      );
      sentryInit.appendChild(sentryInitHTML);
      document.body.insertBefore(sentryInit, document.body.childNodes[0]);
    }
  }
  renderTagManager() {
    const env = this.env;

    if (env === 'qa') {
      return <TagManager gtmId="GTM-W8CJV63" />;
    } else if (env === 'production') {
      return <TagManager gtmId="GTM-KS4KKTW" />;
    } else {
      return <div />;
    }
  }
  componentWillMount() {
    this.appendSentry();
  }
  render() {
    return (
      <div>
        {this.renderTagManager()}
        <Switch>
          <Route exact path="/index/:category" component={Index} />
          <Route exact path="/index" component={Index} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/admin/services" component={AdminServices} />
          <Route exact path="/admin/services/new" component={AdminServices} />
          <Route
            exact
            path="/admin/services/edit/:id"
            component={AdminServices}
          />
          <Route exact path="/admin/users" component={AdminUsers} />
          <Route exact path="/admin/users/new" component={AdminUsers} />
          <Route exact path="/admin/users/edit/:id" component={AdminUsers} />
          <Redirect path="/admin" to="/admin/services" />
          <Redirect path="/chinese" to="/index/chinese" />
          <Redirect path="/english" to="/index/english" />
          <Redirect path="/preschool-junior" to="/index/preschool-junior" />
          <Redirect path="/preschool-middle" to="/index/preschool-middle" />
          <Redirect path="/preschool-senior" to="/index/preschool-senior" />
          <Redirect path="/prayer" to="/index/prayer" />
          <Redirect path="/" to="/index" />
        </Switch>
      </div>
    );
  }
}
