import _ from 'lodash';
import React, { Component } from 'react';
import styled from 'styled-components';
import QuarterView from './QuarterView';
import { LoadingIndicator, DateBar } from 'components';
import { NavBar } from 'modules/core';
import moment from 'moment';
import pusher from 'utils/pusher';
import EditDay from './EditDay';
import queryString from 'query-string';
import { EventsAPI } from 'apis';
import { getMemberNames, getCategory, setCategory } from 'utils';
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
import { createApiActions } from 'resource/actions';
import { media } from 'styled';

const mapStateToProps = (state, ownProps) => {
  const {
    history,
    match: {
      params: { category }
    },
    location: { search }
  } = ownProps;
  const services = _.get(state, 'resource.data.services', {});
  const serviceNames = _.map(services, service => service.name);
  const selectedService = _.find(services, { name: category }) || {};
  const {
    meta: { isEditingDay, isEditingRole, isLoading },
    data
  } = state.index;

  // Prevent user from inputing a non-existed service
  // Workaround - redirect to english service
  if (!_.isEmpty(services) && _.isEmpty(selectedService)) {
    setCategory('english');
    history.replace(`/index/english`);
  }

  const nextCategory = getCategory(category);
  if (!category) {
    history.replace(`/index/${nextCategory}`);
  }
  setCategory(nextCategory);

  return {
    category: nextCategory,
    data,
    frequency: selectedService.frequency || 'Sunday',
    query: queryString.parse(search),
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  class Container extends Component {
    constructor(props) {
      super(props);

      const fromDate = _.get(props, 'query.from');

      this.state = {
        date: fromDate ? new Date(fromDate) : new Date(),
        selectedData: {}
      };
    }
    loadPrevData({ from, to, category }) {
      const query = {
        from: moment(from)
          .subtract(1, 'Q')
          .format('YYYY-MM-DD'),
        to: moment(to)
          .subtract(1, 'Q')
          .format('YYYY-MM-DD'),
        category
      };

      return EventsAPI.retrieve(query);
    }
    loadData({ from, to, category }) {
      const { requestRetrieveEvents, retrieveEvents } = this.props;
      const query = {
        from:
          from ||
          moment()
            .startOf('quarter')
            .format('YYYY-MM-DD'),
        to:
          to ||
          moment()
            .endOf('quarter')
            .format('YYYY-MM-DD'),
        category
      };

      this.loadPrevData(query)
        .then(data => {
          this.setState({
            preQuarterMembers: getMemberNames(data.data)
          });
        })
        .catch(e => {
          console.error(e); // eslint-disable-line
        });

      requestRetrieveEvents(query);
      retrieveEvents(query);
    }
    handleButtonClick = direction => {
      const { date } = this.state;
      const { history, category } = this.props;
      let newDate = moment(date).startOf('quarter');
      if (direction === 'prev') {
        newDate.subtract(1, 'Q');
      } else {
        newDate.add(1, 'Q');
      }
      this.setState({
        date: newDate.toDate()
      });

      const fromDate = newDate.format('YYYY-MM-DD');
      const toDate = newDate.endOf('quarter').format('YYYY-MM-DD');
      history.replace({
        pathname: `/index/${category}`,
        search: `?from=${fromDate}&to=${toDate}`
      });
      this.loadData({ from: fromDate, to: toDate, category });
    };
    handleCategoryChange = category => {
      const { history, switchCategory } = this.props;
      const { date } = this.state;

      const fromDate = moment(date)
        .startOf('quarter')
        .format('YYYY-MM-DD');
      const toDate = moment(date)
        .endOf('quarter')
        .format('YYYY-MM-DD');

      history.push({
        pathname: `/index/${category}`,
        search: `?from=${fromDate}&to=${toDate}`
      });
      switchCategory(category);

      this.loadData({
        from: fromDate,
        to: toDate,
        category
      });
    };
    handleDayClick = data => {
      const { toggleEditDay, setSelectedData } = this.props;
      setSelectedData(data);
      toggleEditDay(true);
    };
    handleEventModified = data => {
      const { setEvent } = this.props;
      setEvent(data);
    };
    handleServiceInfoModified = data => {
      const { setServiceInfo } = this.props;
      setServiceInfo(data);
    };
    handleRoleClick = data => {
      const { toggleEditRole, setSelectedData } = this.props;
      setSelectedData(data);
      toggleEditRole(true);
    };
    handleHistoryChange = () => {
      const { category, switchCategory } = this.props;

      this.loadData({ category });
      switchCategory(category);
    };
    componentWillMount() {
      const { category, switchCategory, query } = this.props;

      this.channel = pusher.subscribe('index');
      this.channel.bind('event-modified', this.handleEventModified);
      this.channel.bind('serviceInfo-modified', this.handleServiceInfoModified);

      const nextCategory = getCategory(category);
      switchCategory(nextCategory);
      this.loadData({ category: nextCategory, ...query });
    }
    componentDidMount() {
      const { history } = this.props;

      this.unlisten = history.listen(this.handleHistoryChange);
    }
    componentWillUnmount() {
      this.unlisten();
    }
    getAllNames() {
      const { data } = this.props;
      const { preQuarterMembers } = this.state;

      return _(data)
        .map(event => event.members.map(member => member.name))
        .flatten()
        .union(preQuarterMembers)
        .filter(name => !_.isEmpty(name))
        .map(name => name.trim())
        .sort()
        .value();
    }
    render() {
      const { date } = this.state;
      const { data, frequency, isEditingDay, isLoading } = this.props;
      const barProps = {
        date,
        onPrevClick: this.handleButtonClick.bind(this, 'prev'),
        onNextClick: this.handleButtonClick.bind(this, 'next')
      };

      return (
        <Wrapper>
          <NavBar onCategoryChange={this.handleCategoryChange} />
          <Content>
            <DateBar {...barProps} />
            <QuarterView
              className="quarter-view"
              date={date}
              data={data}
              frequency={frequency}
              members={this.getAllNames()}
              onRoleClick={this.handleRoleClick}
              onDayClick={this.handleDayClick}
            />
            <DateBar position="bottom" {...barProps} />
          </Content>
          <LoadingIndicator
            overlay={true}
            active={isLoading}
            bgcolor="rgba(255, 255, 255, 0.7)"
          />
          {isEditingDay && <EditDay isOpen={true} />}
        </Wrapper>
      );
    }
  }
);
const Wrapper = styled.div`
  padding: 0 0 3em 0;
`;
const Content = styled.div`
  position: relative;
  margin: 10px;
`;
const PrintHeader = styled.div`
  display: none;
  ${media.print`
    display: block;
    height: 100px;
  `};
`;
