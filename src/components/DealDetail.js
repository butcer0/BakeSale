import React, { Component } from 'react';
import { StyleSheet, View, Text, Image  } from 'react-native';
import PropTypes from 'prop-types';

import { priceDisplay } from '../util';
import ajax from '../ajax';

class DealDetail extends Component {
  static propTypes = {
    initialDealData: PropTypes.object.isRequired,
    //Erik - 5/2/2018 PropTypes.Shape would be more specific
    // deal: PropTypes.shape.isRequired,
  };
  
  state = {
    deal: this.props.initialDealData,
  };

  async componentDidMount() {
    const fullDeal = await ajax.fetchDealDetail(this.state.deal.key);
    
    this.setState({deal: fullDeal,});
  }
  //Erik - 5/2/2018 Alternative way to write method
  // componentDidMount = async() => {
  //   await ajax.fetchDealDetail(this.state.deal.key);
  // };
  
  render() {
    const { deal } = this.state;
    return (
      <View style={styles.deal}>
        <Image source={{ uri: deal.media[0] }} style={styles.image} />
        <View style={styles.detail}>
          <View>
            <Text style={styles.title}>{deal.title}</Text>
          </View>
          <View style={styles.footer}>
            <View style={styles.info}>
              <Text style={styles.price}>{priceDisplay(deal.price)}</Text>
              <Text style={styles.cause}>{deal.cause.name}</Text>
            </View>
            {deal.user &&(
              <View style={styles.user}>
                <Image source={{ uri: deal.user.avatar }} style={styles.avatar} />
                <Text>{deal.user.name}</Text>
              </View>
            )}
          </View>
          <View style={styles.description}>
            <Text>{deal.description}</Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  deal: {
    marginHorizontal: 12,
    marginTop: 50,
    borderColor: '#bbb',
    borderWidth: 1,
  },
  image: {
    width: '100%',
    height: 150,
    backgroundColor: '#ccc',
  },
  detail: {
  },
  title: {
    fontSize: 16,
    padding: 10,
    fontWeight: 'bold',
    backgroundColor: 'rgba(237, 149, 45, 0.4)',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 15,
  },
  info: {
    alignItems: 'center',
  },
  user: {
    alignItems: 'center',
  },
  cause: {
    marginVertical: 10,
  },
  price: {
    fontWeight: 'bold'
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  description: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderStyle: 'dotted',
    margin: 10,
    padding: 10,
  },
});

export default DealDetail;
