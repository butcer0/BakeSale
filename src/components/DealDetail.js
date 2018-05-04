import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, PanResponder, Animated, Dimensions  } from 'react-native';
import PropTypes from 'prop-types';

import { priceDisplay } from '../util';
import ajax from '../ajax';

class DealDetail extends Component {
  imageXPosition = new Animated.Value(0);
  imagePanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gs) => {
      this.imageXPosition.setValue(gs.dx);
      // console.log('Moving', gs.dx);
    },
    onPanResponderRelease: (evt, gs) => {
      const width = Dimensions.get('window').width;      
      if(Math.abs(gs.dx) > width * 0.4)
      {
      // Swipe left or right
        const direction = Math.sign(gs.dx);
        // -1 for left, 1 for right
        Animated.timing(this.imageXPosition, {
          toValue: direction * width,
          duration: 250,
        }).start();
      }
      
      // if(gs.dx < -1 * width * 0.4)
      // {
      // // Swipe left
      //   Animated.timing(this.imageXPosition, {
      //     toValue: -1 * width,
      //     duration: 250,
      //   }).start();
      // }
      
      // console.log('Released', gs.dx);
    },
  });
  static propTypes = {
    initialDealData: PropTypes.object.isRequired,
    //Erik - 5/2/2018 PropTypes.Shape would be more specific
    // deal: PropTypes.shape.isRequired,
    onBack: PropTypes.func.isRequired,
  };
  
  state = {
    deal: this.props.initialDealData,
    imageIndex: 0,
  };

  async componentDidMount() {
    const fullDeal = await ajax.fetchDealDetail(this.state.deal.key);
    this.setState({deal: fullDeal,});
  }
   
  render() {
    const { deal } = this.state;
    return (
      <View style={styles.deal}>
        <TouchableOpacity onPress={this.props.onBack}>
          <Text style={styles.backLink}>Back</Text>
        </TouchableOpacity>
        <Animated.Image 
          //Erik - 5/4/2018 This means spread the panHandlers (callback methods) in component
          {...this.imagePanResponder.panHandlers}
          source={{ uri: deal.media[this.state.imageIndex] }} 
          style={[{ left: this.imageXPosition}, styles.image]} />
        {/* <Image 
          //Erik - 5/4/2018 This means spread the panHandlers (callback methods) in component
          {...this.imagePanResponder.panHandlers}
          source={{ uri: deal.media[this.state.imageIndex] }} 
          style={styles.image} /> */}
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
  backLink: {
    marginBottom: 5,
    color: '#22f',
    marginLeft: 10,
  },
  image: {
    width: '100%',
    height: 150,
    backgroundColor: '#ccc',
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
