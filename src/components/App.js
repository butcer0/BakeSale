import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Animated, Easing, Dimensions } from 'react-native';
import ajax from '../ajax';
import DealList from './DealList';
import DealDetail from './DealDetail';
import SearchBar from './SearchBar';

class App extends Component {
  //Erik - 5/4/2018 This will represent relative value
  titleXPosition = new Animated.Value(0);
  state = {
    deals: [],
    dealsFromSearch:[],
    currentDealId: null,
  };

  animateTitle = (direction = 1) => {
    const width = Dimensions.get('window').width - 158;
    Animated.timing(
      this.titleXPosition, { 
        toValue: direction * (width / 2)
        , duration: 1000
        , easing: Easing.sin }
    ).start(({ finished }) => {
      //Erik - 5/4/2018 If animation 'finished' successfully -> then call callback
      // If this was unmounted, then it will not continue bc animation didn't finish
      if (finished)
      {
        this.animateTitle(-1 * direction); 
      }
    });
    //Erik - 5/4/2018 Changed to Timing for smoother transition
    // Animated.spring(
    //   this.titleXPosition,
    //   { toValue: direction * 100 }
    // ).start(() => {this.animateTitle(-1 * direction); });
  };

  async componentDidMount() {
    this.animateTitle();
    const deals = await ajax.fetchInitialDeals();
    //Erik - 5/2/2018 This 'performs a shallow merge of state'
    this.setState({ deals });
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
 
  return (
    <Animated.View style={[{ left: this.titleXPosition }, styles.container]}>
      <Text style={styles.header}>BakeSale</Text>
    </Animated.View>
    //Erik - 5/4/2018 Animated Text
    // <View style={styles.container}>
    //   <Text style={styles.header}>BakeSale</Text>
    // </View>
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
    //Erik - 5/3/2018 If 'ios' then 30, otherwise if 'android' 10
    marginTop: Platform.OS === 'ios' ? 30 : 10,
  },
  header: {
    fontSize: 40,
  },
});

export default App;