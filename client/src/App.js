import React, { Component } from 'react';
import SelectedFoods from './SelectedFoods';
import FoodSearch from './FoodSearch';
import QuarterView from './components/QuarterView';
import styled from 'styled-components';
import data from './data.json';

export default class App extends Component {
  state = {
    selectedFoods: []
  };
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
    const { selectedFoods } = this.state;
    return (
      <Wrapper>
        <QuarterView date={new Date()} data={data} />
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
