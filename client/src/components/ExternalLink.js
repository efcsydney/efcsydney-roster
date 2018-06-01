import React, { Component } from 'react';
import IconExternalLink from 'react-icons/lib/fa/external-link';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

export default class ExternalLink extends Component {
  render() {
    return (
      <span>
        <Link target="_blank" to={`/${this.props.to}`}>
          {this.props.children}
          <StyleIconExternalLink />
        </Link>
      </span>
    );
  }
}

const StyleIconExternalLink = styled(IconExternalLink)`
  margin-left: 4px;
`;
