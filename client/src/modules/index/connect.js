import _ from 'lodash';
import queryString from 'query-string';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { switchCategory } from 'modules/core/redux';
import {
  requestModifyServiceInfo,
  requestRetrieveEvents,
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

  console.log(ownProps);

  const services = _.get(state, 'resource.data.services', {});
  const serviceNames = _.map(services, service => service.name);
  const selectedService = _.find(services, { name: category }) || {};
  const {
    meta: { isEditingDay, isEditingRole, isLoading },
    data
  } = state.index;

  const nextCategory = getCategory(category);
  if (!category) {
    history.replace(`/index/${nextCategory}`);
  }

  setCategory(nextCategory);
  return {
    category: nextCategory, // serviceName
    data,
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
      requestModifyServiceInfo,
      requestRetrieveEvents,
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

    return {
      category: getCategory(category),
      ...query
    };
  }
);

export default MyComponent =>
  connectServices(
    connectEvents(connect(mapStateToProps, mapDispatchToProps)(MyComponent))
  );
