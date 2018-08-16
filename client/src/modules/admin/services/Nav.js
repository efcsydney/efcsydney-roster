import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
export default class Nav extends Component {
  render() {
    return (
      <Wrapper style={{ float: 'left' }}>
        <li>
          <Link to="/admin/services">Services</Link>
        </li>
        <li>
          <Link to="/admin/users">Users</Link>
        </li>
        <li>
          <Link to="/admin/email">Email</Link>
        </li>
        <li>
          <Link to="/admin/changelog">Changelog</Link>
        </li>
      </Wrapper>
    );
  }
}

const Wrapper = styled.ul`
  float: left;
  width: 10%;
  margin: 0;
  a {
    padding: 10px 20px;
    text-align: right;
    display: block;
  }
`;
