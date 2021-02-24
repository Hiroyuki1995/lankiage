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

  render() {
    const {label, value, onValueChange} = this.props;
    return (
      <RNPickerSelect
        label={label}
        onValueChange={(_v) => onValueChange(_v)}
        items={this.languages}
        style={pickerSelectStyles}
        placeholder={{label: 'Select...', value: ''}}
        Icon={() => (
          <Text
            style={{
              position: 'absolute',
              right: 10,
              top: 5,
              fontSize: 18,
              color: '#789'
            }}>
            ▼
          </Text>
        )}
        // Icon={() => (
        //   <Ionicons
        //     name="chevron-down"
        //     size={25}
        //     color="gray"
        //     style={styles.pickerIcon}
        //   />
        // )}
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
    // marginLeft: 20,
    // marginRight: 20,
    // marginBottom: 10,
    padding: 5,
    paddingRight: 20,
    fontSize: 18,
    backgroundColor: '#ffffff',
    // width: '100%',
    // paddingVertical: 12,
    // paddingHorizontal: 10,
    // borderWidth: 1,
    // borderColor: '#789',
    // borderRadius: 4,
    // color: '#789',
    // paddingRight: 30, // to ensure the text is never behind the icon
    // width: 200,
    // marginLeft: 30,
    // alignItems: 'flex-end',
  },
  pickerText: {
    // position: 'absolute',
    // right: 95,
    // fontSize: 18,
    // color: '#789',
    // alignItems: 'flex-end',
  },
});

const styles = StyleSheet.create({
  pickerIcon: {
    position: 'absolute',
    alignItems: 'flex-end',
    right: 95,
    color: '#789',
  },
});

export default LanguageSelect;
