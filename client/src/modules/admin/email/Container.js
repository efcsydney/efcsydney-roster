import React, { PureComponent } from 'react';
import styled from 'styled-components';
import Title from '../Title';

export default class AdminEmail extends PureComponent {
  constructor(props) {
    super(props);

    this.env = process.env.REACT_APP_ENV || process.env.NODE_ENV;
    this.src =
      this.env === 'development' ? 'http://localhost:3001/email' : '/email';
  }
  componentDidMount() {}
  componentWillUnmount() {}
  render() {
    return (
      <div>
        <Title>Email Management</Title>
        <Frame src={this.src} />
      </div>
    );
  }
}

const Frame = styled.iframe`
  width: 100%;
  min-height: 500px;
`;
