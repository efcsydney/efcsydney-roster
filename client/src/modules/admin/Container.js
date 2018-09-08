import $ from 'jquery';
import _ from 'lodash';
import { Route, Redirect, Switch } from 'react-router-dom';
import React, { PureComponent } from 'react';
import Nav from './services/Nav';
import { Auth, NavBar } from 'modules/core';
import AdminServices from './services';
import AdminEmail from './email';
import AdminChangelogs from './changelogs';
import AdminUsers from './users';
import styled from 'styled-components';
import { media } from 'styled';

export default class Admin extends PureComponent {
  state = {
    minHeight: 'auto'
  };
  constructor(props) {
    super(props);

    this.rootPath = '/admin/services';
    this.bodyEl = null;
    this.contentEl = null;
  }
  adjustHeight = () => {
    this.setState({ minHeight: this.getMinHeight() });
  };
  getMinHeight = () => {
    if (!this.bodyEl) {
      return this.state.minHeight;
    }
    const startPos = $(this.bodyEl).offset().top;
    const endPos = $(window).innerHeight();

    return `${endPos - startPos}px`;
  };
  handlePopupClose = () => {
    const { history } = this.props;

    history.push(this.rootPath);
  };
  handleWindowResize = () => {
    this.adjustHeight();
  };
  handleWindowResizeDecounce = _.debounce(this.handleWindowResize, 200);
  componentDidMount() {
    window.addEventListener('resize', this.handleWindowResizeDecounce);
    this.adjustHeight();
  }
  componentDidUpdate() {
    this.adjustHeight();
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowResizeDecounce);
  }
  render() {
    const { minHeight } = this.state;
    return (
      <Wrapper>
        <NavBar hasSwitcher={false} title="Roster System" />
        <Auth onFail={this.handleAuthFail}>
          <Body
            style={{ minHeight }}
            innerRef={el => {
              this.bodyEl = el;
            }}>
            <StyledNav />
            <Content
              style={{ minHeight }}
              innerRef={el => {
                this.contentEl = el;
              }}>
              <Switch>
                <Route path="/admin/services" component={AdminServices} />
                <Route path="/admin/email" component={AdminEmail} />
                <Route path="/admin/changelogs" component={AdminChangelogs} />
                <Route path="/admin/users" component={AdminUsers} />
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
  align-items: flex-start;
  display: flex;
  ${media.mobile`
    display: block;
  `};
`;
const Content = styled.div`
  background: #fcfcfc;
  box-sizing: border-box;
  flex: 1;
  overflow-x: auto;
  padding: 10px;
  position: relative;
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
