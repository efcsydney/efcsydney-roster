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
import { getMemberNames } from 'utils';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { switchCategory } from 'modules/core/redux';
import { requestRetrieveEvents } from 'modules/index/redux';

const mapStateToProps = state => {
  const { meta: { category } } = state.core;
  const { meta: { isLoading }, data } = state.index;
  return {
    category,
    data,
    isLoading
  };
};
const mapDispatchToProps = dispatch =>
  bindActionCreators({ switchCategory, requestRetrieveEvents }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(
  class App extends Component {
    state = {
      date: new Date(),
      isEditingRole: false,
      isEditingDay: false,
      selectedData: {},
      params: {}
    };
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
      const { requestRetrieveEvents } = this.props;
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
    }
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
    handleCategoryChange = category => {
      const { history } = this.props;
      history.replace(category);

      this.loadData({ category });
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
    handleHistoryChange = ({ pathname }) => {
      const { history, category, switchCategory } = this.props;

      pathname = pathname.replace('/', '');
      if (pathname !== 'english' && pathname !== 'chinese') {
        history.replace(category);
        return;
      }
      this.loadData({ category: pathname });
      switchCategory(pathname);
    };
    componentWillMount() {
      const { category, switchCategory } = this.props;
      this.appendSentry();

      switchCategory(category);
      this.loadData({ category });
    }
    componentDidMount() {
      const { history } = this.props;

      history.listen(this.handleHistoryChange);
    }

    appendSentry() {
      const env = process.env.NODE_ENV;
      if (env === 'qa' || env === 'production') {
        const sentryInit = document.createElement('script');
        const sentryInitHTML = document.createTextNode(
          `Raven.config('https://6d4d9e488cda4ef59dddc1e282a24a7b@sentry.io/263713', {
            environment: '${env}'
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
        isEditingDay,
        isEditingRole,
        selectedData,
        preQuarterMembers
      } = this.state;
      const { data, isLoading } = this.props;

      const barProps = {
        date,
        onPrevClick: this.handleButtonClick.bind(this, 'prev'),
        onNextClick: this.handleButtonClick.bind(this, 'next')
      };

      return (
        <Wrapper>
          {this.renderTagManager()}
          <NavBar onCategoryChange={this.handleCategoryChange} />
          <Content>
            <DateBar {...barProps} />
            <QuarterView
              date={date}
              data={data}
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
              preQuarterMembers={preQuarterMembers}
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
