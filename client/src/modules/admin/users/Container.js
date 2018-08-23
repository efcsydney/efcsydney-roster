import _ from 'lodash';
import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Auth, NavBar } from 'modules/core';
import styled from 'styled-components';
import { Button, Cell, Grid, HeaderCell, Row } from 'components';
import { Link } from 'react-router-dom';
import IconPencil from 'react-icons/lib/fa/pencil';
import IconPlus from 'react-icons/lib/fa/plus';
import Popup from './Popup';
import { createApiActions, withResource } from 'resource';
import { media } from 'styled';

const { modifyUsers, createUsers } = createApiActions('users');

const mapResourceToProps = (resource, state, ownProps) => {
  const path = _.get(ownProps, 'match.path');
  const mode =
    (path.indexOf('/new') !== -1 && 'new') ||
    (path.indexOf('/edit') !== -1 && 'edit') ||
    'index';
  const paramId = _.get(ownProps, 'match.params.id', null);
  const selectedId = !_.isEmpty(paramId) ? parseInt(paramId, 10) : null;

  return {
    data: resource.data,
    mode,
    selectedId,
    ...ownProps
  };
};

export default withResource('users', mapResourceToProps)(
  class UserIndex extends Component {
    static propTypes = {
      data: PropTypes.object,
      mode: PropTypes.string,
      selectedId: PropTypes.number
    };
    static defaultProps = {
      data: {},
      mode: 'index',
      selectedId: null
    };
    constructor(props) {
      super(props);
      this.rootPath = '/admin/users';
    }
    handleAuthFail = () => {
      const { history } = this.props;
      history.replace('/login');
    };
    handlePopupClose = () => {
      const { history } = this.props;
      history.push(this.rootPath);
    };
    handlePopupSave = data => {
      const { dispatch, mode } = this.props;
      const { id, ...body } = data;
      if (mode === 'new') {
        dispatch(createUsers({ ...body }));
      } else {
        dispatch(modifyUsers({ id, ...body }));
      }
    };
    render() {
      const { data, mode, selectedId } = this.props;
      const hasPopup = _.includes(['edit', 'new'], mode);
      const selectedData = data[selectedId] || {};
      const isLoading = mode === 'edit' && _.isEmpty(selectedData);

      return (
        <Wrapper>
          <NavBar hasSwitcher={false} title="Roster System" />
          <HeadRow>
            <Link to={`${this.rootPath}/new`}>
              <Button kind="green" theme="solid">
                <StyledIconPlus />
                Create New User
              </Button>
            </Link>
          </HeadRow>
          <Body>
            <Auth onFail={this.handleAuthFail}>
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
            </Auth>
          </Body>
          {hasPopup && (
            <Popup
              mode={mode}
              data={selectedData}
              isLoading={isLoading}
              onSave={this.handlePopupSave}
              onClose={this.handlePopupClose}
            />
          )}
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
  justify-content: flex-end;
  ${media.mobile`
    justify-content: center;
  `};
`;
const Body = styled.div`
  margin: 10px;
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
