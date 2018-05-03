/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import ajax from '../ajax';
import DealList from './DealList';
import DealDetail from './DealDetail';
import SearchBar from './SearchBar';

class App extends Component {
  state = {
    deals: [],
    dealsFromSearch:[],
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
searchDeals = async (searchTerm) => {
  console.log('searchDeals called: ' + searchTerm);
  
  let dealsFromSearch = [];
  if(searchTerm) {
    dealsFromSearch = await ajax.fetchDealsSearchResults(searchTerm);
  }
  this.setState({ dealsFromSearch });
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
    
    return (
      <View style={styles.main}>
        <DealDetail initialDealData={this.currentDeal()}  onBack={this.unsetCurrentDeal}/>
      </View>
    );
  }
  const dealsToDisplay = 
    this.state.dealsFromSearch.length > 0 
      ? this.state.dealsFromSearch 
      : this.state.deals;
  if (dealsToDisplay.length > 0){
    return (  
      <View style={styles.main}>
        <SearchBar searchDeals={this.searchDeals}/>
        <DealList deals={dealsToDisplay} onItemPress={this.setCurrentDeal}/>
      </View>);
  }
  //Erik - 5/3/2018 Depricated - Use dealsToDisplay to dynamically show search results
  // if (this.state.deals.length > 0){
  //   return (  
  //     <View style={styles.main}>
  //       <SearchBar searchDeals={this.searchDeals}/>
  //       <DealList deals={this.state.deals} onItemPress={this.setCurrentDeal}/>
  //     </View>);
  // }
  return (
    <View style={styles.container}>
      <Text style={styles.header}>BakeSale</Text>
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
  main: {
    // marginTop: 30,
    //Erik - 5/3/2018 If 'ios' then 30, otherwise if 'android' 10
    marginTop: Platform.OS === 'ios' ? 30 : 10,
  },
  header: {
    fontSize: 40,
  },
});

export default App;