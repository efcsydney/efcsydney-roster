import React, { Component } from 'react';
import { Auth, NavBar } from 'modules/core';
import styled from 'styled-components';

export default class AdminIndex extends Component {
  handleAuthFail = () => {
    const { history } = this.props;

    history.replace('login');
  };
  render() {
    return (
      <div>
        <NavBar hasSwitcher={false} title="Roster System" />
        <GridWrapper>
          <Auth height="500px" onFail={this.handleAuthFail}>
            <Grid>
              <tbody>
                <tr>
                  <Cell>It's our admin portal</Cell>
                </tr>
              </tbody>
            </Grid>
          </Auth>
        </GridWrapper>
      </div>
    );
  }
}

const GridWrapper = styled.div`
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  margin: 10px;
  min-height: 500px;
`;
const Grid = styled.table`
  border-radius: 4px;
  width: 100%;
`;
const Cell = styled.td`
  border-radius: 4px;
  text-align: center;
  padding: 10px;
`;
