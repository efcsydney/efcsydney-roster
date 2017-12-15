import React, { Component } from 'react';
import styled from 'styled-components';
import QuarterView from '../components/QuarterView';
import LoadingIndicator from '../components/LoadingIndicator';
import NavBar from '../components/NavBar';
import DateBar from '../components/DateBar';
import moment from 'moment';
import EditRole from './EditRole';
import EditDay from './EditDay';
import API from '../api';
import _ from 'lodash';
import { getQueryParams } from '../utils';

export default class App extends Component {
  state = {
    date: new Date(),
    isLoading: true,
    isEditingRole: false,
    isEditingDay: false,
    selectedData: {},
    selectedService: 'english',
    params: {}
  };
  loadData = ({ from, to }) => {
    let queryParams = {};
    if (document.location.search.length > 0) {
      queryParams = getQueryParams(document.location.search);
    }
    queryParams.from = from;
    queryParams.to = to;
    this.setState({ isLoading: true, params: queryParams });
    return API.retrieve(queryParams)
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
      to: newDate.endOf('quarter').format('YYYY-MM-DD')
    });
  };
  handleDayClick = () => {
    this.setState({
      isEditingDay: true
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
    form.mock = this.state.params.mock;
    API.modify(form).then(() => {
      const clonedEvents = _.clone(this.state.events);
      const i = _.findIndex(clonedEvents.data, {
        date: moment(form.date).format('YYYY-MM-DD')
      });
      const j = _.findIndex(clonedEvents.data[i].members, { role: form.role });
      _.set(clonedEvents, `data.${i}.members.${j}.name`, form.name);
      this.setState({
        events: clonedEvents,
        isEditingRole: false,
        selectedData: null
      });
    });
  };
  handleServiceChange = ({ value }) => {
    location.href = `#${value}`;
    this.setState({ selectedService: value });
  };
  componentWillMount() {
    this.loadData({
      from: moment()
        .startOf('quarter')
        .format('YYYY-MM-DD'),
      to: moment()
        .endOf('quarter')
        .format('YYYY-MM-DD')
    });
  }
  render() {
    const {
      date,
      isLoading,
      isEditingDay,
      isEditingRole,
      selectedData,
      selectedService
    } = this.state;

    const barProps = {
      date,
      onPrevClick: this.handleButtonClick.bind(this, 'prev'),
      onNextClick: this.handleButtonClick.bind(this, 'next')
    };

    return (
      <Wrapper>
        <NavBar
          value={selectedService}
          onServiceChange={this.handleServiceChange}
        />
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
            date={date}
            title="Edit Day"
            isOpen={isEditingDay}
            onClose={this.handleEditDayClose}
            {...selectedData}
          />
        )}
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  padding: 0 0 3em 0;
`;
const Content = styled.div`
  position: relative;
  margin: 10px;
`;
