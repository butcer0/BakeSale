/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ajax from '../ajax';
import DealList from './DealList';
import DealDetail from './DealDetail';

class App extends Component {
  state = {
    deals: [],
    currentDealId: null,
  }
  async componentDidMount() {
    const deals = await ajax.fetchInitialDeals();
    //Erik - 5/2/2018 This 'performs a shallow merge of state'
    this.setState({ deals });
    //Erik - 5/2/2018 Can be simplified since not using prevState
    // this.setState((prevState) => {
    //   return { deals };
    // });
  }
setCurrentDeal = (dealId) => {
  this.setState({
    currentDealId: dealId
  });
};
currentDeal = () => {
  return this.state.deals.find(
    (deal) => deal.key === this.state.currentDealId
  );
};
unsetCurrentDeal = () => {
  this.setState({currentDealId: null});
};
render() {
  if(this.state.currentDealId) {
    return <DealDetail initialDealData={this.currentDeal()}  onBack={this.unsetCurrentDeal}/>;
  }
  if (this.state.deals.length > 0){
    return <DealList deals={this.state.deals} onItemPress={this.setCurrentDeal}/>;
  }
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome to BakeSale!</Text>
    </View>
  );
}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  header: {
    fontSize: 40,
  },
});

export default App;