import _ from 'lodash';
import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Route } from 'react-router-dom';
import styled from 'styled-components';
import { Button, Cell, Grid, HeaderCell, Row } from 'components';
import { Link } from 'react-router-dom';
import IconPencil from 'react-icons/lib/fa/pencil';
import IconPlus from 'react-icons/lib/fa/plus';
import Popup from './Popup';
import { createApiActions, withResource } from 'resource';
import { media } from 'styled';
import Title from '../Title';

const { modifyUsers, createUsers } = createApiActions('users');

const mapResourceToProps = (resource, state, ownProps) => {
  const isLoading = _.get(resource, 'status.retrieve.isLoading', false);

  return {
    data: resource.data,
    isLoading,
    ...ownProps
  };
};

export default withResource('users', mapResourceToProps)(
  class UserIndex extends Component {
    static propTypes = {
      data: PropTypes.object,
      selectedId: PropTypes.number
    };
    static defaultProps = {
      data: {},
      selectedId: null
    };
    constructor(props) {
      super(props);
      this.rootPath = '/admin/users';
    }
    handlePopupClose = () => {
      const { history } = this.props;
      history.push(this.rootPath);
    };
    handlePopupSave = mode => data => {
      const { dispatch, data: originUsers } = this.props;
      const { id, ...body } = data;

      const otherUsers = _.filter(originUsers, user => user.id !== id);
      const otherUsersEmail = _.map(otherUsers, otherUser => otherUser.email);

      if (_.includes(otherUsersEmail, data.email)) {
        alert(
          `The user email "${
            data.email
          }" has been used. Please use other email.`
        );
        return;
      }
      if (mode === 'new') {
        dispatch(createUsers({ ...body }));
      } else {
        dispatch(modifyUsers({ id, ...body }));
      }
    };
    render() {
      const { data, isLoading } = this.props;

      return (
        <Wrapper>
          <HeadRow>
            <Title>Users Management</Title>
            <Link to={`${this.rootPath}/new`}>
              <Button kind="green" theme="solid">
                <StyledIconPlus />
                Create New User
              </Button>
            </Link>
          </HeadRow>
          <Grid>
            <thead>
              <Row>
                <HeaderCell>Primary Name</HeaderCell>
                <HeaderCell>Secondary Name</HeaderCell>
                <HeaderCell>Email</HeaderCell>
                <HeaderCell>Actions</HeaderCell>
              </Row>
            </thead>
            <tbody>
              {_.map(data, ({ id, primaryName, secondaryName, email }) => (
                <Row key={id}>
                  <Cell>{primaryName}</Cell>
                  <Cell>{secondaryName}</Cell>
                  <Cell>{email}</Cell>
                  <ActionsCell>
                    <Link to={`${this.rootPath}/edit/${id}`}>
                      <StyledButton kind="blue">
                        <IconEdit />
                        Edit
                      </StyledButton>
                    </Link>
                  </ActionsCell>
                </Row>
              ))}
            </tbody>
          </Grid>
          <Route
            exact
            path="/admin/users/:mode(new|edit)/:id?"
            render={({ match: { params: { mode, id } } }) => (
              <Popup
                mode={mode}
                data={data[id]}
                isLoading={isLoading && mode === 'edit'}
                onSave={this.handlePopupSave(mode)}
                onClose={this.handlePopupClose}
              />
            )}
          />
        </Wrapper>
      );
    }
  }
);

const Wrapper = styled.div`
  overflow-x: auto;
`;
const HeadRow = styled.div`
  display: flex;
  margin: 10px 0;
  justify-content: space-between;
  ${media.mobile`
    justify-content: center;
  `};
`;
const ActionsCell = styled(Cell)`
  display: flex;
  justify-content: center;
`;
const StyledButton = styled(Button)`
  margin-left: 4px;
`;
const StyledIconPlus = styled(IconPlus)`
  margin-right: 4px;
`;
const IconEdit = styled(IconPencil)`
  margin-right: 4px;
`;
