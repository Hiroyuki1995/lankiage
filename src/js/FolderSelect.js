import React, {Component} from 'react';
import {Text, StyleSheet, Dimensions} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
// import Ionicons from 'react-native-vector-icons/Ionicons';
const {width, height} = Dimensions.get('window');
import {Languages} from './Languages.js';
import 'react-native-get-random-values';

class FolderSelect extends Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate() {
    console.log('componentDidUpdate');
    if (this.props.label === this.props.focusForm) {
      this.select.togglePicker();
    }
  }

  render() {
    const {label, value, onValueChange} = this.props;
    return (
      <RNPickerSelect
        ref={(input) => (this.select = input)}
        onDonePress={this.props.onDonePress}
        onDownArrow={this.props.onDonePress}
        label={label}
        onValueChange={(_v) => onValueChange(_v)}
        items={this.props.items}
        style={pickerSelectStyles}
        placeholder={{label: 'Select a folder', value: ''}}
        Icon={() => (
          <Text
            style={{
              position: 'absolute',
              right: 10,
              top: 7,
              fontSize: 24,
              color: '#789'
            }}>
            ▼
          </Text>
        )}
        value={value}
      />
    );
  }
}

FolderSelect.defaultProps = {
  label: '',
  value: '',
  onValueChange: (_v) => null,
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    // flex: 1,
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
  },
});

export default FolderSelect;
