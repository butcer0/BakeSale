import React, { Component } from 'react';
import { StyleSheet, View, Text, Image  } from 'react-native';
import PropTypes from 'prop-types';


class DealItem extends Component {
  static propTypes = {
    deal: PropTypes.object.isRequired,
    //Erik - 5/2/2018 PropTypes.Shape would be more specific
    // deal: PropTypes.shape.isRequired,
  };
  
  render() {
    const { deal } = this.props;
    return (
      <View>
        <Image source={{ uri: deal.media[0] }}
          style={styles.image} />
        <View>
          <Text>{deal.title}</Text>
          <Text>{deal.price}</Text>
          <Text>{deal.cause.name}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 150,
  },
});

export default DealItem;
