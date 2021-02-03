import React, {Component} from 'react';
import {
  TextInput,
  Text,
  View,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import {Button, Input, Item, Label, StyleProvider} from 'native-base';
import {buttonTheme} from '../native-base-theme/components/Button';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import Validation from './Validation';
import LanguageSelect from './LanguageSelect';
const {width, height} = Dimensions.get('window');
import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';
import FormForAdd from './FormForAdd';
const Realm = require('realm');
import {WordSchema} from './Schema.js';

class OneContentForAdd extends Component {
  constructor(props) {
    super(props);
    this.card = [];
    this.state = {
      realm: null,
      frontWord: '',
      backWord: '',
      frontLang: 'zh-CN',
      backLang: 'ja-JP',
      loading: false,
    };
  }

  // async componentDidMount() {
  //
  // }

  render() {
    console.log(`words:${this.props.words}`);
    console.log(`frontWord:${this.state.frontWord}`);
    // const numOfCards = 3;
    // let inputForms;
    const {frontWord, backWord, frontLang, backLang} = this.state;
    return (
      <View className="input-area" style={styles.oneCardInputArea}>
        <View className="front-input-area" style={styles.oneSideInputArea}>
          <View>
            <View className="form-area">
              <LanguageSelect
                label="frontLang"
                style={styles.languageSelect}
                value={frontLang}
                onValueChange={(v) => this.setState({frontLang: v})}
              />
              <FormForAdd
                label="frontWord"
                value={frontWord}
                onChangeText={(v) => this.setState({frontWord: v})}
              />
            </View>
          </View>
        </View>
        <View className="back-input-area" style={styles.oneSideInputArea}>
          <View>
            <View className="form-area">
              <LanguageSelect
                label="backLang"
                style={styles.languageSelect}
                value={backLang}
                onValueChange={(v) => this.setState({backLang: v})}
              />
              <FormForAdd
                label="backWord"
                value={backWord}
                onChangeText={(v) => this.setState({backWord: v})}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }
}

OneContentForAdd.defaultProps = {
  label: '',
  value: '',
  onChangeText: (_v) => null,
};

const styles = StyleSheet.create({
  inputArea: {
    flexDirection: 'column',
    marginTop: height * 0.1,
    marginLeft: width * 0.05,
    marginRight: width * 0.05,
  },
  oneCardInputArea: {
    flexDirection: 'row',
    flex: 1,
  },
  oneSideInputArea: {
    width: '50%',
    paddingLeft: '2%',
    paddingRight: '2%',
  },
  inputForm: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: width * 0.8,
  },
  languageSelect: {
    flex: 1,
    alignItems: 'flex-end',
  },
  submitButton: {
    padding: 10,
  },
  submitButtonView: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flex: 1,
    margin: 10,
  },
  submitButtonText: {
    color: 'white',
  },
});

export default OneContentForAdd;
