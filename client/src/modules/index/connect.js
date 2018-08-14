import _ from 'lodash';
import moment from 'moment';
import queryString from 'query-string';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { switchCategory } from 'modules/core/redux';
import {
  setEvent,
  setSelectedData,
  setServiceInfo,
  toggleEditRole,
  toggleEditDay
} from 'modules/index/redux';
import { createApiActions, withResource } from 'resource';
import { getCategory, setCategory } from 'utils';

const mapStateToProps = (state, ownProps) => {
  const {
    history,
    match: { params: { category } },
    location: { search }
  } = ownProps;

  const services = _.get(state, 'resource.data.services', {});
  const serviceNames = _.map(services, service => service.name);
  const selectedService = _.find(services, { name: category }) || {};
  const events = _.get(state, 'resource.data.events', {});
  const { meta: { isEditingDay, isEditingRole, isLoading } } = state.index;

  const nextCategory = getCategory(category);
  if (!category) {
    history.replace(`/index/${nextCategory}`);
  }

  setCategory(nextCategory);
  return {
    category: nextCategory, // serviceName
    data: _.map(events),
    frequency: selectedService.frequency || 'Sunday',
    query: queryString.parse(search), // We probably don't need it?
    isEditingDay,
    isEditingRole,
    isLoading,
    serviceNames
  };
};

const mapDispatchToProps = dispatch => {
  const { retrieveEvents } = createApiActions('events');
  return bindActionCreators(
    {
      retrieveEvents,
      setEvent,
      setSelectedData,
      setServiceInfo,
      switchCategory,
      toggleEditDay,
      toggleEditRole
    },
    dispatch
  );
};

const connectServices = withResource(
  'services',
  ({ data }, state, ownProps) => {
    return {
      services: _.map(data),
      ...ownProps
    };
  }
);

const connectEvents = withResource(
  'events',
  ({ data }, state, ownProps) => {
    return {
      events: _.map(data),
      ...ownProps
    };
  },
  (state, ownProps) => {
    const { location: { search }, match: { params: { category } } } = ownProps;
    const query = queryString.parse(search);
    const from =
      query.from ||
      moment()
        .startOf('quarter')
        .format('YYYY-MM-DD');
    const to =
      query.to ||
      moment()
        .endOf('quarter')
        .format('YYYY-MM-DD');

    return {
      from,
      to,
      category: getCategory(category)
    };
  }
);

export default MyComponent =>
  connectServices(
    connectEvents(connect(mapStateToProps, mapDispatchToProps)(MyComponent))
  );
