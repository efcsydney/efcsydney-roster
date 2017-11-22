import React, { Component } from 'react';
import styled from 'styled-components';
import QuarterView from '../components/QuarterView';
import LoadingIndicator from '../components/LoadingIndicator';
import NavBar from '../components/NavBar';
import leftArrowIcon from '../assets/arrow_left.svg';
import rightArrowIcon from '../assets/arrow_right.svg';
import moment from 'moment';
import Edit from './Edit';
import API from '../api';
import { media } from '../styled';

function getQueryParams(qs) {
  qs = qs.split('+').join(' ');
  let params = {},
    tokens,
    re = /[?&]?([^=]+)=([^&]*)/g;
  for (let paramCount = 0; paramCount < 20; paramCount++) {
    tokens = re.exec(qs);
    if (tokens == null) {
      break;
    }
    params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
  }
  return params;
}
export default class App extends Component {
  state = {
    date: new Date(),
    isLoading: true,
    isEditing: false,
    selectedData: {},
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
    API.modify(form);

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
    const { date, isLoading, isEditing, selectedData } = this.state;

    return (
      <Wrapper>
        <NavBar />
        <ViewWrapper>
          <QuarterView
            date={date}
            data={this.state.events}
            onCellClick={this.handleCellClick}
          />
          <PrevButtonTop
            className="zindexNavigator"
            onClick={this.handleButtonClick.bind(this, 'prev')}>
            <img src={leftArrowIcon} role="presentation" />
          </PrevButtonTop>
          <NextButtonTop
            className="zindexNavigator"
            onClick={this.handleButtonClick.bind(this, 'next')}>
            <img src={rightArrowIcon} role="presentation" />
          </NextButtonTop>
          <PrevButton
            className="zindexNavigator"
            onClick={this.handleButtonClick.bind(this, 'prev')}>
            <img src={leftArrowIcon} role="presentation" />
          </PrevButton>
          <NextButton
            className="zindexNavigator"
            onClick={this.handleButtonClick.bind(this, 'next')}>
            <img src={rightArrowIcon} role="presentation" />
          </NextButton>
          <LoadingIndicator
            overlay={true}
            active={isLoading}
            bgcolor="rgba(255, 255, 255, 0.7)"
          />
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

const Wrapper = styled.div``;
const ViewWrapper = styled.div`
  position: relative;
  margin: 10px;
`;
const Arrow = styled.button`
  bottom: 10px;
  width: 34px;
  height: 34px;
  align-items: center;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  border-width: 0;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.5);
  display: flex;
  line-height: 0;
  margin-top: -24px;
  outline: 0;
  position: fixed;
  transition: background 1s;
  &:hover {
    background: rgba(255, 255, 255, 1);
  }
  img {
    width: 15px;
    margin: 0 auto;
    display: inline-block;
  }
`;

const PrevButton = styled(Arrow)`
  left: 20px;
  ${media.mobile`
    left:15px;
    width: 27px;
    height: 27px;
  `};
`;
const PrevButtonTop = PrevButton.extend`
  position: absolute;
  bottom: auto;
  top: -38px;
  left: 10px;
  ${media.mobile`
    top: -48px;
    left: 0px;
  `};
`;

const NextButton = styled(Arrow)`
  right: 20px;
  ${media.mobile`
    right:15px;
    width: 27px;
    height: 27px;
  `};
`;
const NextButtonTop = NextButton.extend`
  position: absolute;
  bottom: auto;
  top: -38px;
  right: 10px;
  ${media.mobile`
    top: -48px;
    right: 0px;
  `};
`;
