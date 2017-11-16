import React, { Component } from 'react';
import styled from 'styled-components';
import QuarterView from '../components/QuarterView';
import leftArrowIcon from '../assets/arrow_left.svg';
import rightArrowIcon from '../assets/arrow_right.svg';
import moment from 'moment';
import Edit from './Edit';
import API from '../api';

export default class App extends Component {
  state = {
    date: new Date(),
    isEditing: false,
    selectedData: {}
  };
  loadData = ({ from, to }) => {
    return API.retrieve({
      from,
      to
    })
      .then(data => {
        this.setState({ events: data });
      })
      .catch(e => console.error(e)); // eslint-disable-line
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
    console.log(form);
    fetch('/api/events', {
      method: "PUT",
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form)
    })
    .then(
          (resp) => resp.json()
    ) 
    .then(function(data) {
          if(data.result !== 'OK'){
            console.log("error");
          }
    }).catch(function() {
          console.log("error");
    });

    this.setState({
      isEditing: false,
      selectedData: null
    });
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
    const { date, isEditing, selectedData } = this.state;

    return (
      <Wrapper>
        <ViewWrapper>
          <QuarterView
            date={date}
            data={this.state.events}
            onCellClick={this.handleCellClick}
          />
          <PrevButton onClick={this.handleButtonClick.bind(this, 'prev')}>
            <img src={leftArrowIcon} role="presentation" />
          </PrevButton>
          <NextButton onClick={this.handleButtonClick.bind(this, 'next')}>
            <img src={rightArrowIcon} role="presentation" />
          </NextButton>
        </ViewWrapper>
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

const Wrapper = styled.div`margin: 10px;`;
const ViewWrapper = styled.div`position: relative;`;
const Arrow = styled.button`
  align-items: center;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  border-width: 0;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1);
  display: flex;
  height: 48px;
  line-height: 0;
  margin-top: -24px;
  outline: 0;
  position: fixed;
  top: 50%;
  width: 48px;
  transition: background 1s;
  &:hover {
    background: rgba(255, 255, 255, 1);
  }
  img {
    margin: 0 auto;
    display: inline-block;
  }
`;
const PrevButton = styled(Arrow)`left: 10px;`;
const NextButton = styled(Arrow)`right: 10px;`;
