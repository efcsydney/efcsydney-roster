import _ from 'lodash';
import React, { Component } from 'react';
import ServicesAPI from 'apis/services';
import { Auth, NavBar } from 'modules/core';
import styled from 'styled-components';
import { Button, Grid, Row, Cell, HeaderCell } from 'components';
import { Link } from 'react-router-dom';
import IconPencil from 'react-icons/lib/fa/pencil';
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
      <Wrapper>
        <NavBar hasSwitcher={false} title="Roster System" />
        <Body>
          <Auth onFail={this.handleAuthFail} onSuccess={this.handleAuthSuccess}>
            <Grid>
              <thead>
                <Row>
                  <HeaderCell>ID</HeaderCell>
                  <HeaderCell>Service Title</HeaderCell>
                  <HeaderCell>Positions</HeaderCell>
                  <HeaderCell>Footnote Label</HeaderCell>
                  <HeaderCell>Occurrence</HeaderCell>
                  <HeaderCell>Actions</HeaderCell>
                </Row>
              </thead>
              <tbody>
                {data.map(
                  ({ footnoteLabel, frequency, label, id, positions }) => (
                    <Row>
                      <Cell>{id}</Cell>
                      <Cell>
                        <Link to={`/admin/edit/${id}`}>{label}</Link>
                      </Cell>
                      <Cell>{positions.length}</Cell>
                      <Cell>{footnoteLabel}</Cell>
                      <Cell>{_.capitalize(frequency)}</Cell>
                      <Cell>
                        <Link to={`/admin/edit/${id}`}>
                          <Button kind="blue">
                            <IconEdit />
                            Edit
                          </Button>
                        </Link>
                      </Cell>
                    </Row>
                  )
                )}
              </tbody>
            </Grid>
          </Auth>
        </Body>
      </Wrapper>
    );
  }
}

const Wrapper = styled.div``;
const Body = styled.div`
  margin: 10px;
`;
const IconEdit = styled(IconPencil)`
  margin-right: 4px;
`;
