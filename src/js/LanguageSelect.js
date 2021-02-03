import React, {Component} from 'react';
import {Text, StyleSheet, Dimensions} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import Ionicons from 'react-native-vector-icons/Ionicons';
const {width, height} = Dimensions.get('window');
import 'react-native-get-random-values';

class LanguageSelect extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {label, value, onValueChange} = this.props;
    return (
      <RNPickerSelect
        label={label}
        onValueChange={(_v) => onValueChange(_v)}
        items={[
          {label: '日本語', value: 'ja'},
          {label: '中文', value: 'zh-cn'},
          {label: 'English', value: 'en'},
        ]}
        style={pickerSelectStyles}
        placeholder={{label: 'Select a Language', value: ''}}
        Icon={() => (
          <Ionicons
            name="chevron-down"
            size={25}
            color="gray"
            style={styles.pickerIcon}
          />
        )}
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
    // borderWidth: 1,
    // borderColor: '#ccc',
    // borderRadius: 4,
    // marginLeft: 20,
    // marginRight: 20,
    marginBottom: 10,
    padding: 5,
    paddingRight: 20,
    fontSize: 18,
    width: '100%',
    // paddingVertical: 12,
    // paddingHorizontal: 10,
    // borderWidth: 1,
    // borderColor: '#789',
    // borderRadius: 4,
    // color: '#789',
    // paddingRight: 30, // to ensure the text is never behind the icon
    // width: 200,
    // marginLeft: 30,
    alignItems: 'flex-end',
  },
  pickerText: {
    position: 'absolute',
    right: 95,
    fontSize: 18,
    color: '#789',
    alignItems: 'flex-end',
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
