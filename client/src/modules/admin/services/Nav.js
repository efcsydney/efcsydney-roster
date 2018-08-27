import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import IconServices from 'react-icons/lib/fa/calendar';
import IconEmail from 'react-icons/lib/fa/envelope';
import IconUsers from 'react-icons/lib/fa/group';
import IconChangelogs from 'react-icons/lib/fa/eye';
import { media } from 'styled';

const NavItem = ({ path, label, iconComponent }) => {
  const isActive = window.location.hash.indexOf(path) > -1;
  return (
    <StyledNavItem isActive={isActive}>
      <Link to={path}>
        {iconComponent}
        <Label>{label}</Label>
      </Link>
    </StyledNavItem>
  );
};

export default class Nav extends Component {
  render() {
    return (
      <Wrapper {...this.props}>
        <NavItem
          label="Services"
          path="/admin/services"
          iconComponent={<IconServices />}
        />
        <NavItem
          label="Users"
          path="/admin/users"
          iconComponent={<IconUsers />}
        />
        <NavItem
          label="Email"
          path="/admin/email"
          iconComponent={<IconEmail />}
        />
        <NavItem
          label="Changelogs"
          path="/admin/changelogs"
          iconComponent={<IconChangelogs />}
        />
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
    display: flex;
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
  ${media.mobile`
    display: block;
    font-size: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
  `};
`;
const StyledNavItem = styled.li`
  box-sizing: border-box;
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
    flex: 1;
    padding: 5px;
    width: 25%;
    a:link,
    a:visited {
      padding: 10px 5px 5px;
    }
  `};
`;
