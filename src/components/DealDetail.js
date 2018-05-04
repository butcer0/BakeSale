import React, { Component } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  PanResponder, 
  Animated, 
  Dimensions, 
  ScrollView,
  Button,
  Linking
} from 'react-native';
import PropTypes from 'prop-types';

import { priceDisplay } from '../util';
import ajax from '../ajax';

const SWIPE_THRESHOLD = 0.4;
const SWIPE_DETAIL_ELASTICITY = 0.4;

class DealDetail extends Component {
  imageXPosition = new Animated.Value(0);
  detailXPosition = new Animated.Value(0);
  width = 0;

  static propTypes = {
    initialDealData: PropTypes.object.isRequired,
    //Erik - 5/2/2018 PropTypes.Shape would be more specific
    // deal: PropTypes.shape.isRequired,
    onBack: PropTypes.func.isRequired,
    onSwipe: PropTypes.func.isRequired,
  };
  
  state = {
    deal: this.props.initialDealData,
    imageIndex: 0,
  };

  imagePanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gs) => {
      this.imageXPosition.setValue(gs.dx);
    },
    onPanResponderRelease: (evt, gs) => {
      this.width = Dimensions.get('window').width;      
      if(Math.abs(gs.dx) > this.width * SWIPE_THRESHOLD)
      {
      // Swipe left or right
        const direction = Math.sign(gs.dx);
        // -1 for left, 1 for right
        Animated.timing(this.imageXPosition, {
          toValue: direction * this.width,
          duration: 250,
        }).start(() => this.handleSwipe(-1 * direction));
      } else {
        Animated.spring(this.imageXPosition, {
          toValue: 0,
        }).start();
      }
    },
  });

  handleSwipe = (indexDirection) => {
    if (!this.state.deal.media[this.state.imageIndex + indexDirection]) {
      Animated.spring(this.imageXPosition, {
        toValue: 0,
      }).start();
      return;
    }
    this.setState((prevState) => ({ 
      imageIndex: prevState.imageIndex + indexDirection
    }), () => {
      // Next image animation
      this.imageXPosition.setValue(indexDirection * this.width);
      Animated.spring(this.imageXPosition, {
        toValue: 0,
      }).start();
    });
    
  }

  detailPanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gs) => {
      this.detailXPosition.setValue(gs.dx * SWIPE_DETAIL_ELASTICITY);
    },
    onPanResponderRelease: (evt, gs) => {
      this.width = Dimensions.get('window').width;      
      if(Math.abs(gs.dx) > this.width * SWIPE_THRESHOLD)
      {
      // Swipe left or right
        const direction = Math.sign(gs.dx);
        // -1 for left, 1 for right
        Animated.timing(this.detailXPosition, {
          toValue: direction * this.width,
          duration: 250,
        }).start(() => this.handleDetailSwipe(-1 * direction));
      } else {
        Animated.spring(this.detailXPosition, {
          toValue: 0,
          duration: 100,
        }).start();
      }

    },
  });

  handleDetailSwipe = (indexDirection) => {
    if(this.props.onSwipe(indexDirection) === this.state.deal.key)
    {
      Animated.spring(this.detailXPosition, {
        toValue: 0,
      }).start();
      return;
    } else {
      // Next deal animation
      this.detailXPosition.setValue(indexDirection * this.width);
      Animated.spring(this.detailXPosition, {
        toValue: 0,
      }).start();
    }
  }


  async componentDidMount() {
    const fullDeal = await ajax.fetchDealDetail(this.state.deal.key);
    this.setState({deal: fullDeal,});
  }

  openDealUrl = () => {
    Linking.openURL(this.state.deal.url);
  }
   
  render() {
    const { deal } = this.state;
    return (
      <ScrollView contentContainerStyle={styles.deal}>
        <TouchableOpacity onPress={this.props.onBack}>
          <Text style={styles.backLink}>Back</Text>
        </TouchableOpacity>
        <Animated.Image 
          //Erik - 5/4/2018 This means spread the panHandlers (callback methods) in component
          {...this.imagePanResponder.panHandlers}
          source={{ uri: deal.media[this.state.imageIndex] }} 
          style={[{ left: this.imageXPosition}, styles.image]} />
        <Animated.View 
          {...this.detailPanResponder.panHandlers}
          style={[{ left: this.detailXPosition}, styles.detail]} >
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
          <View style={styles.buyNow}>
            <Button 
              title="Buy this deal!" 
              onPress={this.openDealUrl}
            />
          </View>
         
        </Animated.View>
      </ScrollView>
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
  buyNow: {
    marginHorizontal: '30%',
  }
});

export default DealDetail;
