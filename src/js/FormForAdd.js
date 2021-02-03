import React, {Component} from 'react';
import {TextInput, Dimensions} from 'react-native';
const {width, height} = Dimensions.get('window');

class FormForAdd extends Component {
  render() {
    const {label, value, onChangeText} = this.props;
    return (
      <TextInput
        label={label}
        style={styles.inputForm}
        onChangeText={(_v) => {
          onChangeText(_v);
        }}
        value={value}
      />
    );
  }
}

FormForAdd.defaultProps = {
  label: '',
  value: '',
  onChangeText: (_v) => null,
};

const styles = {
  inputForm: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    fontSize: 40,
    // width: width * 0.8,
  },
};

export default FormForAdd;
