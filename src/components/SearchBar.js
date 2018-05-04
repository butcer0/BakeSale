import React, { Component } from 'react';
import { StyleSheet, TextInput  } from 'react-native';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';

class SearchBar extends Component {
  static propTypes = {
    searchDeals: PropTypes.func.isRequired,
    initialSearchTerm: PropTypes.string.isRequired,
  };
  state = {
    searchTerm: this.props.initialSearchTerm,
  };
searchDeals = (searchTerm) => {
  this.props.searchDeals(searchTerm);
  // blur
  this.inputElement.blur();
}

  debouncedSearchDeals = debounce(this.searchDeals, 300);
  handleChange = (searchTerm) => {
    this.setState({searchTerm}, () => {
      //debounce
      this.debouncedSearchDeals(this.state.searchTerm);
    });
  };

  render() {
   
    return (
      <TextInput 
        ref = {(inputElement) => {this.inputElement = inputElement;}}
        value={this.state.searchTerm}
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
