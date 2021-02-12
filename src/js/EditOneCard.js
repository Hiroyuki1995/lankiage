import React, {Component} from 'react';
import {TextInput, View, StyleSheet, Dimensions} from 'react-native';
const {width, height} = Dimensions.get('window');
import 'react-native-get-random-values';
const defalutFrontLang = 'zh-cn';
const defalutBackLang = 'ja';
const wordSchema = {
  frontWord: '',
  backWord: '',
  isRegisterd: false,
};

class EditOneCard extends Component {
  constructor(props) {
    super(props);
    this.card = [];
    this.state = {
      // word: this.props.word,
      words: [],
      loading: false,
      frontLang: defalutFrontLang,
      backLang: defalutBackLang,
      numberOfWords: 10,
      message: '',
      realm: null,
    };
    // console.log(this.state.word);
    this.changeContent = this.changeContent.bind(this);
  }

  changeContent(v, label) {
    // this.setState((prevState) => {
    //   return {
    //     word: {
    //       ...prevState.word,
    //       [label]: v,
    //     },
    //   };
    // });
    // this.props.word[label] = v;
    // console.log(this.props.word);
    // this.setState((prevState) => {
    //   const updatedWords = prevState.words.map((word, index) => {
    //     if (index === i) {
    //       return {
    //         ...word,
    //         [label]: v,
    //       };
    //     }
    //     return word;
    //   });
    //   return {words: updatedWords};
    // });
  }

  render() {
    let formStyle = {};
    const word = this.props.word;
    if (word.isRegisterd) {
      formStyle = [styles.inputForm, styles.inputRegisterdForm];
    } else {
      formStyle = styles.inputForm;
    }
    return (
      <View className="input-area" style={styles.oneCardInputArea}>
        <View className="front-input-area" style={styles.oneSideInputArea}>
          <View className="form-area">
            <TextInput
              multiline={true}
              numberOfLines={10}
              // maxLength={1000}
              name="frontWord"
              value={word.frontWord}
              style={formStyle}
              placeholder="front word"
              onChangeText={(value) => {
                this.props.onChange('frontWord', value, this.props.id);
              }}
            />
          </View>
        </View>
        <View className="back-input-area" style={styles.oneSideInputArea}>
          <View className="form-area">
            <TextInput
              name="backWord"
              multiline={true}
              value={word.backWord}
              style={formStyle}
              placeholder="back word"
              onChangeText={(value) => {
                this.props.onChange('backWord', value, this.props.id);
              }}
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  inputArea: {
    flexDirection: 'column',
    marginTop: height * 0.06,
    marginLeft: width * 0.02,
    marginRight: width * 0.02,
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  oneCardInputArea: {
    flexDirection: 'row',
    flex: 1,
    marginBottom: 10,
    marginTop: 10,
  },
  oneSideInputArea: {
    width: '50%',
    paddingLeft: '2%',
    paddingRight: '2%',
  },
  inputForm: {
    flex: 1,
    height: 100,
    fontSize: 22,
    borderRadius: 4,
    // paddingHorizontal: 30,
    backgroundColor: '#ffffff',
    shadowColor: '#ccc',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 0,
    shadowOpacity: 1,
    textAlign: 'center',
    textAlignVertical: 'top',
  },
  inputRegisterdForm: {
    backgroundColor: '#87cefa',
  },
  languageSelect: {
    flex: 1,
    alignItems: 'flex-end',
    width: '40%',
  },
  button: {
    padding: 10,
    margin: 10,
  },
  submitButton: {
    backgroundColor: '#2c8ef4',
    color: 'white',
  },
  resetButton: {
    borderColor: '#2c8ef4',
    borderWidth: 1,
    backgroundColor: 'white',
    color: '#2c8ef4',
  },
  submitButtonView: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flex: 0.2,
    margin: 10,
    // position: 'absolute',
    bottom: 0,
    // height: height * 0.2,
  },
  submitButtonText: {
    color: 'white',
  },
  resetButtonText: {
    color: '#2c8ef4',
  },
  messageView: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flex: 1,
    // margin: 10,
  },
  messageText: {
    color: 'red',
    fontSize: 20,
    // padding: 10,
  },
  translationButton: {
    width: 30,
    height: 30,
  },
  buttonArea: {
    flexDirection: 'column',
  },
  languageSelectArea: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default EditOneCard;
