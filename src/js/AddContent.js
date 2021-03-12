import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Button as NativeButton,
  ImageBackground,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {Button} from 'native-base';
import {Text} from 'react-native-elements';
const {width} = Dimensions.get('window');
import 'react-native-get-random-values';
import translate from 'translate-google-api';
import {Languages} from './Languages.js';
import EditOneCard from './EditOneCard';
const wordSchema = {
  frontWord: '',
  backWord: '',
  isRegisterd: false,
};
const inputAccessoryViewID = 'uniqueID';
const nextButton = require('../png/right_arrow.png');

class AddContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      words: this.props.route.params.words ? this.props.route.params.words : [],
      numberOfWords: this.props.route.params.numberOfWords
        ? this.props.route.params.numberOfWords
        : 5,
      message: '',
      // realm: null,
      currentFocus: {
        key: null,
        isFront: true,
      },
    };
    this.frontLangCode = this.props.route.params.folder.frontLangCode;
    this.backLangCode = this.props.route.params.folder.backLangCode;
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
    this.backToList = this.backToList.bind(this);
    this.getLangName = this.getLangName.bind(this);
    this.addCard = this.addCard.bind(this);
  }

  backToList() {
    this.props.navigation.goBack();
  }

  addCard() {
    this.setState((prevState) => {
      const words = prevState.words;
      words.push(wordSchema);
      return {
        numberOfWords: prevState.numberOfWords + 1,
        words,
        currentFocus: {
          key: null,
        },
      };
    });
  }

  getLangName(langCode) {
    if (langCode) {
      for (let language of Languages) {
        if (language.code === langCode) {
          return language.name;
        }
      }
    }
    return null;
  }

  getLangTranslateCode(langCode) {
    console.log(`langCode ${langCode}`);
    if (langCode) {
      for (let language of Languages) {
        if (language.code === langCode) {
          return language.translateCode;
        }
      }
    }
    return null;
  }

  translate(isForword = true) {
    let message = '';
    const {words} = this.state;
    const frontLangTranslateCode = this.getLangTranslateCode(
      this.frontLangCode,
    );
    const backLangTranslateCode = this.getLangTranslateCode(this.backLangCode);
    const fromLang = isForword ? frontLangTranslateCode : backLangTranslateCode;
    const toLang = !isForword ? frontLangTranslateCode : backLangTranslateCode;
    if (!fromLang || !toLang) {
      message = 'Please set the languages';
      this.setState({message: message});
      return;
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
                  currentFocus: {
                    key: null,
                  },
                };
              } else {
                return {word};
              }
            });
            this.setState({words: updatedWords, message: ''});
          })
          .catch((error) => {
            this.setState({message: error.message});
          });
      }
    }
  }

  changeContent(name, value, i) {
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
  }

  changeLanguage(v, label) {
    this.setState({[label]: v});
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
    console.log('focusNextWord');
    this.setState((prevState) => {
      const currentFocusKey = prevState.currentFocus.key;
      if (
        !(
          !prevState.currentFocus.isFront &&
          prevState.currentFocus.key === prevState.numberOfWords - 1
        )
      ) {
        if (prevState.currentFocus.isFront) {
          return {
            currentFocus: {
              key: currentFocusKey,
              isFront: false,
            },
          };
        } else {
          return {
            currentFocus: {
              key: currentFocusKey + 1,
              isFront: true,
            },
          };
        }
      }
    });
  }

  formFocus(key, isFront) {
    console.log('formFocus', key, isFront);
    this.setState({
      currentFocus: {
        key: key,
        isFront: isFront,
      },
    });
  }

  registerWords(isEditing = false) {
    this.setState({message: ''});
    const {words} = this.state;
    const updatedWords = [];
    let numberOfRegisterd = 0;
    console.log(`${this.props.route.params.folder.id}`);
    // try {
    this.props.route.params.registerWords(
      this.state,
      this.props.route.params.folder.id,
      isEditing,
    );
    for (const word of words) {
      if (
        word.frontWord &&
        this.frontLangCode &&
        word.backWord &&
        this.backLangCode
      ) {
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
        if (!isEditing) {
          message = `Registerd ${numberOfRegisterd} words`;
        } else {
          message = `Edited ${numberOfRegisterd} words`;
        }
      }
      return {
        words: updatedWords,
        message: message,
        currentFocus: {
          key: null,
        },
      };
    });
  }

  resetWords() {
    this.setState(() => {
      const words = [];
      for (let i = 0; i < this.state.numberOfWords; i++) {
        words.push(wordSchema);
      }
      return {
        words,
        message: '',
        currentFocus: {
          key: null,
        },
      };
    });
  }

  componentWillUnmount() {
    console.log('componentWillUnmount in AddContent');
  }

  componentDidDisappear() {
    console.log('componentDidDisappear in AddContent');
  }

  render() {
    console.log(`currentFocus ${JSON.stringify(this.state.currentFocus)}`);
    const {words, numberOfWords, message} = this.state;
    return (
      // <ImageBackground
      //   style={styles.backgroundImage}
      //   // resizeMode="contain"
      //   source={require('../png/milky-way.jpg')}>
      <View style={styles.container}>
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="always"
          extraScrollHeight={170}
          style={styles.inputArea}>
          {(() => {
            if (!this.props.route.params.isEditing) {
              return (
                <View style={styles.cardPlusIconView}>
                  <TouchableOpacity onPress={this.addCard}>
                    <Icon
                      name="card-plus"
                      style={styles.cardPlusIcon}
                    />
                  </TouchableOpacity>
                </View>
              );
            }
          })()}
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
              <Text style={styles.languageText}>
                {this.getLangName(this.frontLangCode)}
              </Text>
            </View>
            <View style={styles.buttonArea}>
              <TouchableOpacity onPress={() => this.translate(true)}>
                <IonIcon name="arrow-redo" style={styles.translationButton} />
              </TouchableOpacity>
              <Icon name="google-translate" style={styles.translateIcon} />
              <TouchableOpacity onPress={() => this.translate(false)}>
                <IonIcon
                  name="arrow-redo"
                  style={[styles.translationButton, styles.reverseButton]}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.oneLanguageSelectArea}>
              <Text style={styles.languageText}>
                {this.getLangName(this.backLangCode)}
              </Text>
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
                <EditOneCard
                  id={i}
                  key={i}
                  word={words[i]}
                  currentFocusKey={this.state.currentFocus.key}
                  currentFocusSide={this.state.currentFocus.isFront}
                  onChange={this.changeContent}
                  onFormFocus={this.formFocus}
                  // inputAccessoryViewID={inputAccessoryViewID}
                  onSubmitEditing={this.focusNextWord}
                  scroll={this.scroll}
                />,
              );
            }
            return <View>{items}</View>;
          })()}
          {/* <InputAccessoryView
            nativeID={inputAccessoryViewID}
            backgroundColor="#ffffff"
            style={styles.keyboradToolbar}>
            <View style={styles.keyboradToolbar}>
              <View style={styles.directionButtons}>
                <MaterialIcon
                  name="arrow-back-ios"
                  style={styles.directionButton}
                  onPress={this.focusBackWord}
                />
                <MaterialIcon
                  name="arrow-forward-ios"
                  style={styles.directionButton}
                  onPress={this.focusNextWord}
                />
              </View>
              <View style={styles.actionButtons}>
                <NativeButton
                  style={styles.keyboardButton}
                  onPress={() => this.registerWords()}
                  title="Save"
                />
                <NativeButton
                  style={styles.keyboardButton}
                  onPress={this.resetWords}
                  title="Reset"
                />
              </View>
            </View>
          </InputAccessoryView> */}
          <View style={styles.buttonAreaView}>
            {(() => {
              if (!this.props.route.params.isEditing) {
                return (
                  <View style={styles.submitButtonView}>
                    <Button
                      block
                      primary
                      variant="contained"
                      style={[styles.button, styles.submitButton]}
                      onPress={() => this.registerWords()}>
                      <Text style={styles.submitButtonText}>Save</Text>
                    </Button>
                    <Button
                      block
                      light
                      variant="contained"
                      style={[styles.button, styles.resetButton]}
                      onPress={this.resetWords}>
                      <Text style={styles.resetButtonText}>Reset</Text>
                    </Button>
                  </View>
                );
              } else {
                return (
                  <View style={styles.submitButtonView}>
                    <Button
                      block
                      primary
                      variant="contained"
                      style={[styles.button, styles.submitButton]}
                      onPress={() => this.registerWords(true)}>
                      <Text style={styles.submitButtonText}>Save</Text>
                    </Button>
                    <Button
                      block
                      light
                      variant="contained"
                      style={[styles.button, styles.resetButton]}
                      onPress={this.backToList}>
                      <Text style={styles.resetButtonText}>Cancel</Text>
                    </Button>
                  </View>
                );
              }
            })()}
          </View>
          {/* </KeyboardAvoidingView> */}
        </KeyboardAwareScrollView>
      </View>
      // </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  inputArea: {
    flexDirection: 'column',
    paddingTop: 10,
    paddingLeft: width * 0.02,
    paddingRight: width * 0.02,
    // flex: 1,
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
    width: '30%',
  },
  resetButton: {
    width: '30%',
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
    color: '#ffffff',
    fontSize: 20,
  },
  resetButtonText: {
    color: '#ffffff',
    fontSize: 20,
  },
  messageView: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flex: 1,
    // margin: 10,
  },
  messageText: {
    color: '#ffffff',
    fontSize: 20,
    // padding: 10,
    fontStyle: 'italic',
    textDecorationLine: 'underline',
  },
  translationButton: {
    // width: 30,
    // height: 30,
    fontSize: 40,
    color: 'rgb(0,122,255)',
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
    flex: 1,
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
    // flex: 1,
    justifyContent: 'center',
    // flexDirection: 'row',
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
    // flexDirection: 'row',
    justifyContent: 'flex-end',
    // position: 'absolute',
    // right: 10,
  },
  directionButton: {
    fontSize: 20,
    width: 18,
    height: 18,
    marginHorizontal: 10,
    color: 'rgb(10,132,255)',
  },
  translateIcon: {
    fontSize: 25,
    color: '#ffffff',
  },
  reverseButton: {
    transform: [{rotate: '180deg'}],
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    // backgroundColor: 'rgba(0,0,0, 0.5)',
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  languageText: {
    fontSize: 20,
    color: '#ffffff',
    textAlign: 'center',
  },
  keyboardAvoidingView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  buttonAreaView: {
    flex: 1,
    marginBottom: 50,
  },
  cardPlusIconView: {
    flex: 1,
    alignItems: 'flex-end',
  },
  cardPlusIcon: {
    fontSize: 50,
    color: '#ffffff',
  },
});

export default AddContent;
