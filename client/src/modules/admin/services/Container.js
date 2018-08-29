import _ from 'lodash';
import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Route } from 'react-router-dom';
import styled from 'styled-components';
import { Button, Cell, Grid, HeaderCell, Row, ExternalLink } from 'components';
import { Link } from 'react-router-dom';
import IconPencil from 'react-icons/lib/fa/pencil';
import Popup from './Popup';
import { createApiActions, withResource } from 'resource';
import { media } from 'styled';
import Title from '../Title';

const { modifyServices, createServices } = createApiActions('services');

const mapResourceToProps = (resource, state, ownProps) => {
  const isLoading = _.get(resource, 'status.retrieve.isLoading', false);
  const serviceNames = _.map(
    _.get(state, 'resource.data.services', {}),
    service => service.name
  );

  return {
    data: resource.data,
    isLoading,
    serviceNames,
    ...ownProps
  };
};

export default withResource('services', mapResourceToProps)(
  class AdminIndex extends Component {
    static propTypes = {
      data: PropTypes.object,
      mode: PropTypes.string,
      selectedId: PropTypes.number
    };
    static defaultProps = {
      data: {}
    };
    constructor(props) {
      super(props);

      this.rootPath = '/admin/services';
    }
    handlePopupClose = () => {
      const { history } = this.props;

      history.push(this.rootPath);
    };
    handlePopupSave = mode => data => {
      const { dispatch, serviceNames } = this.props;
      const { id, ...body } = data;

      if (mode === 'new') {
        if (_.includes(serviceNames, data.name)) {
          alert(
            `The service URL path "${
              data.name
            }" has been used. Please update it.`
          );
          return;
        }
        dispatch(createServices({ ...body }));
      } else {
        dispatch(modifyServices({ id, ...body }));
      }
    };
    render() {
      const { data, isLoading } = this.props;

      return (
        <Wrapper>
          <HeadRow>
            <Title>Services Management</Title>
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
              {_.map(data, ({ frequency, label, id, positions, name }) => (
                <Row key={id}>
                  <Cell>
                    <ExternalLink to={`index/${name}`}>{label}</ExternalLink>
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
          <Route
            exact
            path="/admin/services/:mode(new|edit)/:id?"
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
  ${media.mobile`
    display: flex;
    flex-direction: column-reverse;
  `};
`;
const HeadRow = styled.div`
  display: flex;
  margin: 10px 0;
  align-items: center;
  justify-content: space-between;
  ${media.mobile`
    justify-content: center;
  `};
`;
const IconEdit = styled(IconPencil)`
  margin-right: 4px;
`;
