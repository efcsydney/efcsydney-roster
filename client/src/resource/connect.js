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
 * const mapResourceToProps = (resource, otherState, ownProps) => {
 *   data: resource.data,
 *   ...state['index']
 * };
 * withResource('events', mapResourceToProps, mapStateToQuery)(
 *   class Container extends Component {
 *     render() {
 *       const { data } = this.props;
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
    const { resource, ...otherState } = state;
    const query = _.isFunction(mapStateToQuery) ? mapStateToQuery(state) : {};

    return {
      resource,
      query,
      otherState,
      ownProps
    };
  })(
    class DataComponent extends Component {
      static propTypes = {
        resource: PropTypes.object,
        query: PropTypes.object,
        otherState: PropTypes.object,
        ownProps: PropTypes.object
      };
      static defaultProps = {
        resource: {},
        query: PropTypes.object,
        otherState: {},
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
          resource,
          resource: { data },
          otherState,
          ownProps
        } = this.props;
        const props = mapResourceToProps
          ? mapResourceToProps(resource, otherState, ownProps)
          : { [resourceKey]: data };

        return <WrappedComponent {...props} {...ownProps} />;
      }
    }
  );
};
