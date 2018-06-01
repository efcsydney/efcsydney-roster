import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ServicesAPI } from 'apis';
import { Auth, NavBar } from 'modules/core';
import styled from 'styled-components';
import { Button, Cell, Grid, HeaderCell, Row, ExternalLink } from 'components';
import { Link } from 'react-router-dom';
import IconPencil from 'react-icons/lib/fa/pencil';
import { withResource } from 'resource/connect';
import Popup from './Popup';

const mapStateToProps = (state, ownProps) => {
  const path = _.get(ownProps, 'match.path');
  const mode =
    (path.indexOf('/new') !== -1 && 'new') ||
    (path.indexOf('/edit') !== -1 && 'edit') ||
    'index';
  const paramId = _.get(ownProps, 'match.params.id', null);
  const selectedId = !_.isEmpty(paramId) ? parseInt(paramId, 10) : null;

  return {
    mode,
    selectedId
  };
};
export default withResource('services')(
  connect(mapStateToProps)(
    class AdminIndex extends Component {
      state = {
        data: []
      };
      constructor(props) {
        super(props);

        this.rootPath = '/admin/services';
      }
      handleAuthFail = () => {
        const { history } = this.props;

        history.replace('/login');
      };
      handleAuthSuccess = () => {
        ServicesAPI.retrieve().then(({ data }) => {
          this.setState({ data });
        });
      };
      handlePopupClose = () => {
        const { history } = this.props;

        history.push(this.rootPath);
      };
      handlePopupSave = data => {
        const { history } = this.props;
        const { data: prevData } = this.state;
        const nextData = _.clone(prevData);

        const { id, ...body } = data;
        const offset = _.findIndex(prevData, { id: id });

        ServicesAPI.modify(id, body)
          .then(({ data }) => {
            nextData[offset] = data;
            this.setState({ data: nextData });
          })
          .catch(e => alert(e.message))
          .finally(() => history.push(this.rootPath));
      };
      render() {
        const { data } = this.state;
        const { mode, selectedId } = this.props;
        const hasPopup = _.includes(['new', 'edit'], mode);
        const selectedData = _.find(data, { id: selectedId }) || {};
        const isLoading = mode === 'edit' && _.isEmpty(selectedData);

        return (
          <Wrapper>
            <NavBar hasSwitcher={false} title="Roster System" />
            <Body>
              <Auth
                onFail={this.handleAuthFail}
                onSuccess={this.handleAuthSuccess}>
                <HeadRow>
                  <Link to={`${this.rootPath}/new`}>
                    <Button kind="green" theme="solid">
                      Create New Service
                    </Button>
                  </Link>
                </HeadRow>
                <Grid>
                  <thead>
                    <Row>
                      <HeaderCell>Service Title</HeaderCell>
                      <HeaderCell>Positions</HeaderCell>
                      <HeaderCell>Frequency</HeaderCell>
                      <HeaderCell>Actions</HeaderCell>
                    </Row>
                  </thead>
                  <tbody>
                    {data.map(({ frequency, label, id, positions, name }) => (
                      <Row key={id}>
                        <Cell>
                          <ExternalLink to={name}>{label}</ExternalLink>
                        </Cell>
                        <Cell>{positions.length}</Cell>
                        <Cell>{_.capitalize(frequency)}</Cell>
                        <Cell>
                          <Link to={`${this.rootPath}/edit/${id}`}>
                            <Button kind="blue">
                              <IconEdit />
                              Edit
                            </Button>
                          </Link>
                        </Cell>
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
  )
);

const Wrapper = styled.div``;
const Body = styled.div`
  margin: 10px;
`;
const HeadRow = styled.div`
  display: flex;
  margin: 10px 0;
  justify-content: flex-end;
`;
const IconEdit = styled(IconPencil)`
  margin-right: 4px;
`;
