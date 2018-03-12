import _ from 'lodash';
import React, { Component } from 'react';
import ServicesAPI from 'apis/services';
import { Auth, NavBar } from 'modules/core';
import styled from 'styled-components';

export default class AdminIndex extends Component {
  state = {
    data: []
  };
  handleAuthFail = () => {
    const { history } = this.props;

    history.replace('login');
  };
  handleAuthSuccess = () => {
    ServicesAPI.retrieve().then(({ data }) => {
      this.setState({ data });
    });
  };
  render() {
    const { data } = this.state;
    return (
      <div>
        <NavBar hasSwitcher={false} title="Roster System" />
        <GridWrapper>
          <Auth onFail={this.handleAuthFail} onSuccess={this.handleAuthSuccess}>
            <Grid>
              <thead>
                <tr>
                  <th>Service Title</th>
                  <th>Positions</th>
                  <th>Footnote Label</th>
                  <th>Occurrence</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map(
                  ({ footnoteLabel, frequency, label, id, positions }) => (
                    <tr>
                      <td>{label}</td>
                      <td>{positions.length}</td>
                      <td>{footnoteLabel}</td>
                      <td>{_.capitalize(frequency)}</td>
                      <td>
                        <a href={`edit/${id}`}>Edit</a>
                      </td>
                    </tr>
                  )
                )}
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
