import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import IconServices from 'react-icons/lib/fa/calendar';
import IconEmail from 'react-icons/lib/fa/envelope';
import IconUsers from 'react-icons/lib/fa/group';
import IconChangelogs from 'react-icons/lib/fa/eye';
import { media } from 'styled';

export default class Nav extends Component {
  render() {
    return (
      <Wrapper {...this.props}>
        <NavItem
          isActive={window.location.hash.indexOf('/admin/services') > -1}>
          <Link to="/admin/services">
            <IconServices />
            <Label>Services</Label>
          </Link>
        </NavItem>
        <NavItem isActive={window.location.hash.indexOf('/admin/users') > -1}>
          <Link to="/admin/users">
            <IconUsers />
            <Label>Users</Label>
          </Link>
        </NavItem>
        <NavItem isActive={window.location.hash.indexOf('/admin/email') > -1}>
          <Link to="/admin/email">
            <IconEmail />
            <Label>Email</Label>
          </Link>
        </NavItem>
        <NavItem
          isActive={window.location.hash.indexOf('/admin/changelog') > -1}>
          <Link to="/admin/changelogs">
            <IconChangelogs />
            <Label>Changelogs</Label>
          </Link>
        </NavItem>
      </Wrapper>
    );
  }
}

const Wrapper = styled.ul`
  margin: 0 10px 10px 10px;
  a {
    padding: 10px 20px;
    text-align: right;
    display: block;
  }
  svg {
    font-size: 32px;
  }
  ${media.mobile`
    border-bottom: 1px dotted #bbb;
    margin-bottom: 10px;
    svg {
      font-size: 20px;
    }
  `};
`;
const Label = styled.div`
  padding: 5px 0;
  text-align: center;
  font-size: 12px;
`;
const NavItem = styled.li`
  display: block;
  margin-bottom: 10px;
  a:link,
  a:visited {
    background: ${props => (props.isActive ? '#666' : 'transparent')};
    text-shadow: ${props =>
      props.isActive ? '0 1px 3px rgba(0, 0, 0, 0.5);' : 'none'};
    border-radius: 5px;
    color: ${props => (props.isActive ? '#fff' : '#777')};
    display: block;
    padding: 10px;
    text-align: center;
  }
  a:hover {
    color: ${props => (props.isActive ? '#fff' : '#444')};
  }
  ${media.mobile`
    display: inline-block;
    width: 80px;
    padding: 5px;
  `};
`;
