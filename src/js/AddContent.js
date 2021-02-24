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
  ImageBackground,
} from 'react-native';
import {Navigation} from 'react-native-navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {Button} from 'native-base';
import {Text} from 'react-native-elements';
const {width, height} = Dimensions.get('window');
import 'react-native-get-random-values';
import translate from 'translate-google-api';
import {v4 as uuidv4} from 'uuid';
const Realm = require('realm');
import {WordSchema} from './Schema.js';
import {Languages} from './Languages.js';
import EditOneCard from './EditOneCard';
import {ScrollView} from 'react-native';
const wordSchema = {
  frontWord: '',
  backWord: '',
  isRegisterd: false,
};
var nextButton = require('../png/next.png');
var backButton = require('../png/back.png');
const inputAccessoryViewID = 'uniqueID';

class AddContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      words: this.props.route.params.words ? this.props.route.params.words : [],
      loading: false,
      frontLangCode: this.props.route.params.folder.frontLangCode,
      backLangCode: this.props.route.params.folder.backLangCode,
      numberOfWords: this.props.route.params.numberOfWords
        ? this.props.route.params.numberOfWords
        : 5,
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
    this.backToList = this.backToList.bind(this);
    this.getLangName = this.getLangName.bind(this);
  }

  backToList() {
    console.log('aaa');
    this.props.navigation.goBack();
  }

  getLangName(langCode) {
    console.log(`langCode ${langCode}`);
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
    this.setState({message: ''});
    const {words, frontLangCode, backLangCode} = this.state;
    const frontLangTranslateCode = this.getLangTranslateCode(frontLangCode);
    const backLangTranslateCode = this.getLangTranslateCode(backLangCode);
    const fromLang = isForword ? frontLangTranslateCode : backLangTranslateCode;
    const toLang = !isForword ? frontLangTranslateCode : backLangTranslateCode;
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

  registerWords(isEditing = false) {
    console.log(`isEditing`, isEditing);
    this.setState({message: ''});
    const {words, frontLangCode, backLangCode} = this.state;
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
      if (word.frontWord && frontLangCode && word.backWord && backLangCode) {
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
    console.log('componentWillUnmount in AddContent');
  }

  componentDidDisappear() {
    console.log('componentDidDisappear in AddContent');
  }

  render() {
    const {
      words,
      numberOfWords,
      message,
      frontLangCode,
      backLangCode,
    } = this.state;
    return (
      <ImageBackground
        style={styles.backgroundImage}
        // resizeMode="contain"
        source={require('../png/milky-way.jpg')}>
        <View style={styles.container}>
          <ScrollView style={styles.inputArea}>
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
                  {this.getLangName(frontLangCode)}
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
                  {this.getLangName(backLangCode)}
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
            </InputAccessoryView>
            <View>
              <View style={{flex: 1}}>
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
            </View>
          </ScrollView>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  inputArea: {
    flexDirection: 'column',
    paddingTop: height * 0.06,
    paddingLeft: width * 0.02,
    paddingRight: width * 0.02,
    flex: 1,
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
  },
  translationButton: {
    // width: 30,
    // height: 30,
    fontSize: 40,
    color: '#ffffff',
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
    width: width,
    height: height,
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0, 0.5)',
  },
  languageText: {
    fontSize: 20,
    color: '#ffffff',
    textAlign: 'center',
  },
});

export default AddContent;
