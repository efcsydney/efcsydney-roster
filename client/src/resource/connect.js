/**
 * Usage:
 *
 * withResource('events')(
 *   class Container extends Component {
 *     render() {
 *       const { events } = this.props;
 *     }
 *   }
 * );
 *
 * Advanced Usage:
 *
 * const mapStateToQuery = state => {
 *   return {
 *     ...state['index'].query
 *   };
 * });
 * const mapResourceToProps = (filteredResource, state, ownProps) => {
 *   return {
 *     data: filteredResource.data,
 *     query: state['index'].query
 *   };
 * };
 * withResource('events', mapResourceToProps, mapStateToQuery)(
 *   class Container extends Component {
 *     render() {
 *       const { data, query: { page, limit } } = this.props;
 *     }
 *   }
 * );
 */
import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createApiActions } from './actions';

export const withResource = (
  resourceKey,
  mapResourceToProps,
  mapStateToQuery
) => WrappedComponent => {
  return connect((state, ownProps) => {
    const { resource } = state;
    const query = _.isFunction(mapStateToQuery) ? mapStateToQuery(state) : {};

    return {
      resource,
      query,
      state: _.clone(state),
      ownProps
    };
  })(
    class DataComponent extends Component {
      static propTypes = {
        resource: PropTypes.object,
        query: PropTypes.object,
        state: PropTypes.object,
        ownProps: PropTypes.object
      };
      static defaultProps = {
        resource: {},
        query: PropTypes.object,
        state: {},
        ownProps: {}
      };
      componentDidMount() {
        const { dispatch, query } = this.props;
        const actions = createApiActions(resourceKey);
        const retrieve = actions[_.camelCase(`retrieve ${resourceKey}`)];

        dispatch(retrieve(query));
      }
      render() {
        const {
          resource: { data, status, cache },
          state,
          ownProps
        } = this.props;

        const filteredResource = {
          data: data[resourceKey],
          status: status[resourceKey],
          cache
        };
        const props = mapResourceToProps
          ? mapResourceToProps(filteredResource, state, ownProps)
          : { [resourceKey]: data[resourceKey] };

        return <WrappedComponent {...this.props} {...ownProps} {...props} />;
      }
    }
  );
};
