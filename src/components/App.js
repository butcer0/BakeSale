/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ajax from '../ajax';
import DealList from './DealList';

class App extends Component {
  state = {
    deals: [],
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
  render() {
    return (
      <View style={styles.container}>
        {
          this.state.deals.length > 0
            ?  (<DealList deals={this.state.deals} />)
            : (<Text style={styles.header}>Welcome to BakeSale!</Text>)
        }
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