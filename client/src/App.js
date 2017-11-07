import React, { Component } from 'react';
import SelectedFoods from './SelectedFoods';
import FoodSearch from './FoodSearch';
import QuarterView from './components/QuarterView';
import styled from 'styled-components';
import leftArrowIcon from './assets/arrow_left.svg';
import rightArrowIcon from './assets/arrow_right.svg';
import moment from 'moment';

export default class App extends Component {
  state = {
    selectedFoods: [],
    events: [],
    date: new Date()
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
  };
  componentWillMount() {
    fetch('/api/events')
      .then(response => response.json())
      .then(data => this.setState({ events: data }));
  }
  removeFoodItem = itemIndex => {
    const filteredFoods = this.state.selectedFoods.filter(
      (item, idx) => itemIndex !== idx
    );
    this.setState({ selectedFoods: filteredFoods });
  };
  addFood = food => {
    const newFoods = this.state.selectedFoods.concat(food);
    this.setState({ selectedFoods: newFoods });
  };
  render() {
    const { selectedFoods, date } = this.state;

    return (
      <Wrapper>
        <ViewWrapper>
          <QuarterView date={date} data={this.state.events} />
          <PrevButton onClick={this.handleButtonClick.bind(this, 'prev')}>
            <img src={leftArrowIcon} />
          </PrevButton>
          <NextButton onClick={this.handleButtonClick.bind(this, 'next')}>
            <img src={rightArrowIcon} />
          </NextButton>
        </ViewWrapper>
        <SelectedFoods
          foods={selectedFoods}
          onFoodClick={this.removeFoodItem}
        />
        <FoodSearch onFoodClick={this.addFood} />
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
