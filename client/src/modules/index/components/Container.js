import React, { Component } from 'react';
import styled from 'styled-components';
import QuarterView from './QuarterView';
import { LoadingIndicator, DateBar, TagManager } from 'components';
import { NavBar } from 'modules/core';
import moment from 'moment';
import EditRole from './EditRole';
import EditDay from './EditDay';
import EventsAPI from 'apis/events';
import _ from 'lodash';
import { getQueryParams } from 'utils';
import { connect } from 'react-redux';

const mapStateToProps = state => ({ category: state.core.meta.category });

export default connect(mapStateToProps)(
  class App extends Component {
    state = {
      date: new Date(),
      isLoading: true,
      isEditingRole: false,
      isEditingDay: false,
      selectedData: {},
      params: {}
    };
    loadData = ({ from, to, category }) => {
      let queryParams = {};
      if (document.location.search.length > 0) {
        queryParams = getQueryParams(document.location.search);
      }
      queryParams.from = from;
      queryParams.to = to;
      queryParams.category = category;
      this.setState({ isLoading: true, params: queryParams });
      return EventsAPI.retrieve(queryParams)
        .then(data => {
          this.setState({
            events: data,
            isLoading: false
          });
        })
        .catch(e => {
          console.error(e); // eslint-disable-line
          this.setState({ isLoading: false });
        });
    };
    handleButtonClick = direction => {
      const { date } = this.state;
      const { category } = this.props;
      let newDate = moment(date).startOf('quarter');
      if (direction === 'prev') {
        newDate.subtract(1, 'Q');
      } else {
        newDate.add(1, 'Q');
      }
      this.setState({
        date: newDate.toDate()
      });

      this.loadData({
        from: newDate.format('YYYY-MM-DD'),
        to: newDate.endOf('quarter').format('YYYY-MM-DD'),
        category
      });
    };
    handleDayClick = ({ day, footnote }) => {
      this.setState({
        isEditingDay: true,
        selectedData: { date: day.toDate(), footnote }
      });
    };
    handleRoleClick = ({ day, member, role, names }) => {
      this.setState({
        isEditingRole: true,
        selectedData: { date: day.toDate(), member, role, names }
      });
    };
    handleEditDayClose = () => {
      this.setState({
        isEditingDay: false
      });
    };
    handleEditClose = () => {
      this.setState({
        isEditingRole: false,
        selectedData: null
      });
    };
    handleEditSave = form => {
      const { params: { mock } } = this.state;
      if (mock) {
        form.mock = mock;
      }
      EventsAPI.modify(form).then(() => {
        const clonedEvents = _.clone(this.state.events);
        const i = _.findIndex(clonedEvents.data, {
          date: moment(form.date).format('YYYY-MM-DD')
        });
        const j = _.findIndex(clonedEvents.data[i].members, {
          role: form.role
        });
        _.set(clonedEvents, `data.${i}.members.${j}.name`, form.name);
        this.setState({
          events: clonedEvents,
          isEditingRole: false,
          selectedData: null
        });
      });
    };
    handleEditDaySave = form => {
      const { params: { mock } } = this.state;
      if (mock) {
        form.mock = mock;
      }
      EventsAPI.modify(form).then(() => {
        const events = _.clone(this.state.events);
        const date = moment(form.date).format('YYYY-MM-DD');
        const i = _.findIndex(events.data, { date });
        _.set(events, `data.${i}.footnote`, form.footnote);
        this.setState({
          events,
          isEditingDay: false
        });
      });
    };
    componentWillMount() {
      const { category } = this.props;
      this.appendSentry();
      this.loadData({
        from: moment()
          .startOf('quarter')
          .format('YYYY-MM-DD'),
        to: moment()
          .endOf('quarter')
          .format('YYYY-MM-DD'),
        category
      });
    }
    appendSentry() {
      const env = process.env.NODE_ENV;
      if (env === 'qa' || env === 'production') {
        const sentryInit = document.createElement('script');
        const sentryInitHTML = document.createTextNode(
          `Raven.config('https://6d4d9e488cda4ef59dddc1e282a24a7b@sentry.io/263713', {
          release: '0e4fdef81448dcfa0e16ecc4433ff3997aa53572'
          , environment: '` +
            env +
            `'
        }).install();`
        );
        sentryInit.appendChild(sentryInitHTML);
        document.body.insertBefore(sentryInit, document.body.childNodes[0]);
      }
    }
    renderTagManager() {
      const env = process.env.NODE_ENV;

      if (env === 'qa') {
        return <TagManager gtmId="GTM-W8CJV63" />;
      } else if (env === 'production') {
        return <TagManager gtmId="GTM-KS4KKTW" />;
      } else {
        return <div />;
      }
    }
    render() {
      const {
        date,
        isLoading,
        isEditingDay,
        isEditingRole,
        selectedData
      } = this.state;

      const barProps = {
        date,
        onPrevClick: this.handleButtonClick.bind(this, 'prev'),
        onNextClick: this.handleButtonClick.bind(this, 'next')
      };

      return (
        <Wrapper>
          {this.renderTagManager()}
          <NavBar />
          <Content>
            <DateBar {...barProps} />
            <QuarterView
              date={date}
              data={this.state.events}
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
          {isEditingRole && (
            <EditRole
              title="Edit Event"
              isOpen={isEditingRole}
              {...selectedData}
              onClose={this.handleEditClose}
              onSave={this.handleEditSave}
            />
          )}
          {isEditingDay && (
            <EditDay
              title="Edit Day"
              isOpen={isEditingDay}
              {...selectedData}
              onClose={this.handleEditDayClose}
              onSave={this.handleEditDaySave}
            />
          )}
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
