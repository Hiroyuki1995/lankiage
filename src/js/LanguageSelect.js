import React, {Component} from 'react';
import {Text, StyleSheet, Dimensions} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
// import Ionicons from 'react-native-vector-icons/Ionicons';
const {width, height} = Dimensions.get('window');
import {Languages} from './Languages.js';
import 'react-native-get-random-values';

class LanguageSelect extends Component {
  constructor(props) {
    super(props);
    this.languages = Languages.map((language) => {
      return {
        label: language.name,
        value: language.code,
      };
    });
  }

  componentDidUpdate() {
    console.log('componentDidUpdate');
    if (this.props.label === this.props.focusForm) {
      this.select.togglePicker();
    }
  }

  render() {
    // let style =
    // if (this.state.isFocused) {
    // }
    const {label, value, onValueChange} = this.props;
    return (
      <RNPickerSelect
        ref={(input) => (this.select = input)}
        onDonePress={this.props.onDonePress}
        onDownArrow={this.props.onDownArrow}
        onUpArrow={this.props.onUpArrow}
        label={label}
        onValueChange={(_v) => onValueChange(_v)}
        items={this.languages}
        style={pickerSelectStyles}
        placeholder={{label: 'Select a language', value: ''}}
        Icon={() => <Text style={styles.triangleText}>▼</Text>}
        value={value}
      />
    );
  }
}

LanguageSelect.defaultProps = {
  label: '',
  value: '',
  onValueChange: (_v) => null,
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 5,
    paddingRight: 20,
    fontSize: 20,
    width: 270,
    backgroundColor: '#ffffff',
  },
});

const styles = StyleSheet.create({
  pickerIcon: {
    position: 'absolute',
    alignItems: 'flex-end',
    right: 95,
    color: '#789',
  },
  focusedSelectBox: {
    color: 'red',
    borderWidth: 3,
  },
  triangleText: {
    position: 'absolute',
    right: 10,
    top: 7,
    fontSize: 24,
    color: '#789',
  },
});

export default LanguageSelect;
