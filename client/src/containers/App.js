import React, { Component } from 'react';
import styled from 'styled-components';
import QuarterView from '../components/QuarterView';
import LoadingIndicator from '../components/LoadingIndicator';
import NavBar from '../components/NavBar';
import DateBar from '../components/DateBar';
import TagManager from '../components/TagManager';
import moment from 'moment';
import Edit from './Edit';
import API from '../api';
import _ from 'lodash';
import { getQueryParams } from '../utils';

export default class App extends Component {
  state = {
    date: new Date(),
    isLoading: true,
    isEditing: false,
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
  handleCellClick = ({ day, member, role, names }) => {
    this.setState({
      isEditing: true,
      selectedData: { date: day.toDate(), member, role, names }
    });
  };
  handleEditClose = () => {
    this.setState({
      isEditing: false,
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
        isEditing: false,
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
  renderTagManager() {
    console.log(process.env); // eslint-disable-line
    const env = process.env.REACT_APP_ENV;
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
      isEditing,
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
        {this.renderTagManager()}
        <NavBar
          value={selectedService}
          onServiceChange={this.handleServiceChange}
        />
        <Content>
          <DateBar {...barProps}/>
          <QuarterView
            date={date}
            data={this.state.events}
            onCellClick={this.handleCellClick}
          />
          <DateBar position="bottom" {...barProps}/>
        </Content>
        <LoadingIndicator
          overlay={true}
          active={isLoading}
          bgcolor="rgba(255, 255, 255, 0.7)"
        />
        {isEditing && (
          <Edit
            title="Edit Event"
            isOpen={isEditing}
            {...selectedData}
            onClose={this.handleEditClose}
            onSave={this.handleEditSave}
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
