import { Route, Redirect, Switch } from 'react-router-dom';
import React, { PureComponent } from 'react';
import Nav from './services/Nav';
import { Auth, NavBar } from 'modules/core';
import AdminServices from './services';
import UnderConstruction from './UnderConstruction';
import styled from 'styled-components';
import { media } from 'styled';

export default class Admin extends PureComponent {
  constructor(props) {
    super(props);

    this.rootPath = '/admin/services';
  }
  handlePopupClose = () => {
    const { history } = this.props;

    history.push(this.rootPath);
  };
  render() {
    return (
      <Wrapper>
        <NavBar hasSwitcher={false} title="Roster System" />
        <Auth onFail={this.handleAuthFail}>
          <Body>
            <StyledNav />
            <Content>
              <Switch>
                <Route path="/admin/services" component={AdminServices} />
                <Route
                  path="/admin/email"
                  render={() => <UnderConstruction title="Email Management" />}
                />
                <Route
                  path="/admin/changelogs"
                  render={() => (
                    <UnderConstruction title="Changelogs Management" />
                  )}
                />
                <Route
                  path="/admin/users"
                  render={() => <UnderConstruction title="Users Management" />}
                />
                <Redirect to="/admin/services" />
              </Switch>
            </Content>
          </Body>
        </Auth>
      </Wrapper>
    );
  }
}

const Wrapper = styled.div``;
const Body = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 10px;
  ${media.mobile`
    display: block;
  `};
`;
const Content = styled.div`
  flex: 1;
  overflow-x: auto;
  min-width: 500px;
  ${media.mobile`
    min-width: auto;
 `};
`;
const StyledNav = styled(Nav)`
  min-width: 10%;
  max-width: 150px;
  white-space: nowrap;
  text-align: center;
  ${media.mobile`
    min-width: none;
    max-width: none;
  `};
`;
