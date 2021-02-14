import React, {Component} from 'react';
import {
  TextInput,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  InputAccessoryView,
  Button as NativeButton,
} from 'react-native';
import {Button} from 'native-base';
import {Text} from 'react-native-elements';
import LanguageSelect from './LanguageSelect';
const {width, height} = Dimensions.get('window');
import 'react-native-get-random-values';
import translate from 'translate-google-api';
import {v4 as uuidv4} from 'uuid';
const Realm = require('realm');
import {WordSchema} from './Schema.js';
import EditOneCard from './EditOneCard';
const defalutFrontLang = 'zh-cn';
const defalutBackLang = 'ja';
const wordSchema = {
  frontWord: '',
  backWord: '',
  isRegisterd: false,
};
var rightArrowButton = require('../png/right_arrow.png');
var leftArrowButton = require('../png/left_arrow.png');
var nextButton = require('../png/next.png');
var backButton = require('../png/back.png');
const inputAccessoryViewID = 'uniqueID';

class AddContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      words: [],
      loading: false,
      frontLang: defalutFrontLang,
      backLang: defalutBackLang,
      numberOfWords: 5,
      message: '',
      // realm: null,
      currentFocus: {
        key: 0,
        isFront: true,
      },
    };
    for (let i = 0; i < this.state.numberOfWords; i++) {
      this.state.words.push(wordSchema);
    }
    this.registerWords = this.registerWords.bind(this);
    this.resetWords = this.resetWords.bind(this);
    this.translate = this.translate.bind(this);
    this.changeContent = this.changeContent.bind(this);
    this.changeLanguage = this.changeLanguage.bind(this);
    this.focusNextWord = this.focusNextWord.bind(this);
    this.focusBackWord = this.focusBackWord.bind(this);
    this.formFocus = this.formFocus.bind(this);
  }

  translate(isForword = true) {
    this.setState({message: ''});
    const {words, frontLang, backLang} = this.state;
    const fromLang = isForword ? frontLang : backLang;
    const toLang = !isForword ? frontLang : backLang;
    if (!fromLang || !toLang) {
      this.setState({message: 'Please set the languages'});
    } else {
      const translationTargets = [];
      const keys = [];
      let key = 0;
      for (const word of words) {
        const targetWord = isForword ? word.frontWord : word.backWord;
        if (targetWord !== '') {
          translationTargets.push(targetWord);
          keys.push(key);
        }
        key++;
      }
      if (translationTargets.length > 0) {
        translate(translationTargets, {
          from: fromLang,
          tld: 'com',
          to: toLang,
        })
          .then((result) => {
            const resultWordLabel = isForword ? 'backWord' : 'frontWord';
            const updatedWords = words.map((word, index) => {
              if (keys.includes(index)) {
                return {
                  ...word,
                  [resultWordLabel]: result[index],
                };
              } else {
                return {word};
              }
            });
            this.setState({words: updatedWords});
          })
          .catch((error) => {
            this.setState({message: error.message});
          });
      }
    }
  }

  changeContent = (name, value, i) => {
    this.setState((prevState) => {
      const updatedWords = prevState.words.map((word, index) => {
        if (index === i) {
          return {
            ...word,
            [name]: value,
          };
        }
        return word;
      });
      return {words: updatedWords};
    });
  };

  changeLanguage(v, label) {
    this.setState((prevState) => {
      return {[label]: v};
    });
  }

  focusBackWord() {
    this.setState((prevState) => {
      const currentFocusKey = prevState.currentFocus.key;
      if (
        !(prevState.currentFocus.isFront && prevState.currentFocus.key === 0)
      ) {
        const nextFocusKey = prevState.currentFocus.isFront
          ? currentFocusKey - 1
          : currentFocusKey;
        return {
          currentFocus: {
            key: nextFocusKey,
            isFront: !prevState.currentFocus.isFront,
          },
        };
      }
    });
  }

  focusNextWord() {
    this.setState((prevState) => {
      const currentFocusKey = prevState.currentFocus.key;
      if (
        !(
          !prevState.currentFocus.isFront &&
          prevState.currentFocus.key === prevState.numberOfWords - 1
        )
      ) {
        const nextFocusKey = prevState.currentFocus.isFront
          ? currentFocusKey
          : currentFocusKey + 1;
        return {
          currentFocus: {
            key: nextFocusKey,
            isFront: !prevState.currentFocus.isFront,
          },
        };
      }
    });
  }

  formFocus(key, isFront) {
    this.setState({
      currentFocus: {
        key: key,
        isFront: isFront,
      },
    });
  }

  registerWords() {
    this.setState({message: ''});
    const {words, frontLang, backLang} = this.state;
    const updatedWords = [];
    let numberOfRegisterd = 0;
    for (const word of words) {
      if (word.frontWord && frontLang && word.backWord && backLang) {
        // this.setState({loading: true});
        Realm.open({
          schema: [WordSchema],
          deleteRealmIfMigrationNeeded: true,
        }).then((realm) => {
          realm.write(() => {
            realm.create('Word', {
              id: uuidv4(),
              frontWord: word.frontWord,
              frontLang: frontLang,
              backWord: word.backWord,
              backLang: backLang,
              createdAt: new Date(),
            });
          });
          // this.setState({realm});
        });
        updatedWords.push({
          ...word,
          isRegisterd: true,
        });
        numberOfRegisterd++;
      } else {
        updatedWords.push({...word});
      }
    }
    this.setState(() => {
      let message;
      if (numberOfRegisterd === 0) {
        message = 'There are no words that can be registed';
      } else {
        message = `Registerd ${numberOfRegisterd} words`;
      }
      return {words: updatedWords, message: message};
    });
  }

  resetWords() {
    this.setState(() => {
      const words = [];
      for (let i = 0; i < this.state.numberOfWords; i++) {
        words.push(wordSchema);
      }
      return {words, message: ''};
    });
  }

  componentWillUnmount() {
    // Close the realm if there is one open.
    // const {realm} = this.state;
    // if (realm !== null && !realm.isClosed) {
    //   realm.close();
    // }
  }

  render() {
    const {words, numberOfWords, message, frontLang, backLang} = this.state;
    return (
      <View className="input-area" style={styles.inputArea}>
        {(() => {
          if (message) {
            return (
              <View style={styles.messageView}>
                <Text style={styles.messageText}>{message}</Text>
              </View>
            );
          }
        })()}
        <View style={styles.languageSelectArea}>
          <View style={styles.oneLanguageSelectArea}>
            <LanguageSelect
              label="frontLang"
              style={styles.languageSelect}
              value={frontLang}
              onValueChange={(v) => this.changeLanguage(v, 'frontLang')}
            />
          </View>
          <View style={styles.buttonArea}>
            <TouchableOpacity onPress={() => this.translate(true)}>
              <Image
                source={rightArrowButton}
                style={styles.translationButton}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.translate(false)}>
              <Image
                source={leftArrowButton}
                style={styles.translationButton}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.oneLanguageSelectArea}>
            <LanguageSelect
              label="backLang"
              style={styles.languageSelect}
              value={backLang}
              onValueChange={(v) => this.changeLanguage(v, 'backLang')}
            />
          </View>
        </View>
        {(() => {
          const items = [];
          for (let i = 0; i < numberOfWords; i++) {
            let formStyle = {};
            if (words[i].isRegisterd) {
              formStyle = [styles.inputForm, styles.inputRegisterdForm];
            } else {
              formStyle = styles.inputForm;
            }
            items.push(
              // <View>
              <EditOneCard
                id={i}
                key={i}
                word={words[i]}
                currentFocusKey={this.state.currentFocus.key}
                currentFocusSide={this.state.currentFocus.isFront}
                onChange={this.changeContent}
                onFormFocus={this.formFocus}
                inputAccessoryViewID={inputAccessoryViewID}
              />,
            );
          }
          return <View>{items}</View>;
        })()}
        <InputAccessoryView
          nativeID={inputAccessoryViewID}
          backgroundColor="#ffffff"
          // style={styles.keyboradToolbar}
        >
          <View style={styles.keyboradToolbar}>
            <View style={styles.directionButtons}>
              <TouchableOpacity
                style={false ? {display: 'none'} : {display: 'flex'}}
                onPress={this.focusBackWord}>
                <Image source={backButton} style={styles.directionButton} />
              </TouchableOpacity>
              <TouchableOpacity
                style={false ? {display: 'none'} : {display: 'flex'}}
                onPress={this.focusNextWord}>
                <Image source={nextButton} style={styles.directionButton} />
              </TouchableOpacity>
            </View>
            <View style={styles.actionButtons}>
              <NativeButton
                style={styles.keyboardButton}
                onPress={this.registerWords}
                title="Save"
              />
              <NativeButton
                style={styles.keyboardButton}
                onPress={this.resetWords}
                title="Reset"
              />
            </View>
          </View>
        </InputAccessoryView>
        <View>
          <View style={{flex: 1}}>
            <View style={styles.submitButtonView}>
              <Button
                block
                variant="contained"
                style={[styles.button, styles.submitButton]}
                onPress={this.registerWords}>
                <Text h3 style={styles.submitButtonText}>
                  Save
                </Text>
              </Button>
              <Button
                block
                variant="contained"
                style={[styles.button, styles.resetButton]}
                onPress={this.resetWords}>
                <Text h3 style={styles.resetButtonText}>
                  Reset
                </Text>
              </Button>
            </View>
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
    // flex: 1,
    // alignItems: 'flex-end',
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
    width: '20%',
    // flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  languageSelectArea: {
    flexDirection: 'row',
    // flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  oneLanguageSelectArea: {
    width: '40%',
    // flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyboardButton: {
    textAlign: 'center',
    // paddingHorizontal: 10,
  },
  inputAccessoryView: {
    // backgroundColor: '#ffffff',
    // flexDirection: 'row',
    // flex: 1,
    // // alignItems: 'flex-end',
    // justifyContent: 'center',
  },
  keyboardButtonText: {
    flex: 1,
    color: '#007aff',
    textAlign: 'center',
  },
  keyboradToolbar: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: '#F8F8F8',
    // paddingHorizontal: 8,
    height: 48,
  },
  directionButtons: {
    // alignItems: 'flex-start',
    flexDirection: 'row',
    // justifyContent: 'flex-start',
    position: 'absolute',
    left: 10,
  },
  actionButtons: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    position: 'absolute',
    right: 10,
  },
  directionButton: {
    width: 18,
    height: 18,
    marginHorizontal: 10,
  },
});

export default AddContent;
