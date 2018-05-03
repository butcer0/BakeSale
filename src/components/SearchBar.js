import React, { Component } from 'react';
import { StyleSheet, TextInput  } from 'react-native';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';

class SearchBar extends Component {
  static propTypes = {
    searchDeals: PropTypes.func.isRequired,
  };
  state = {
    searchTerm: '',
  };
  debouncedSearchDeals = debounce(this.props.searchDeals, 300);
  handleChange = (searchTerm) => {
    this.setState({searchTerm}, () => {
      //debounce
      this.debouncedSearchDeals(this.state.searchTerm);
    });
  };

  render() {
   
    return (
      <TextInput 
        placeholder = 'Search all Deals'
        style={styles.input}
        onChangeText={this.handleChange} />
       
    );
  }
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    marginHorizontal: 12,
  },
});

export default SearchBar;
