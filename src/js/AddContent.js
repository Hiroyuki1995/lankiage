import React, {Component} from 'react';
import {
  TextInput,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import {Button, Footer} from 'native-base';
import {Text} from 'react-native-elements';
import LanguageSelect from './LanguageSelect';
const {width, height} = Dimensions.get('window');
import 'react-native-get-random-values';
import translate from 'translate-google-api';
import {v4 as uuidv4} from 'uuid';
const Realm = require('realm');
import {WordSchema} from './Schema.js';
const defalutFrontLang = 'zh-cn';
const defalutBackLang = 'ja';
const wordSchema = {
  frontWord: '',
  backWord: '',
  isRegisterd: false,
};
var rightArrowButton = require('../png/right_arrow.png');
var leftArrowButton = require('../png/left_arrow.png');

class AddContent extends Component {
  constructor(props) {
    super(props);
    this.card = [];
    this.state = {
      words: [],
      loading: false,
      frontLang: defalutFrontLang,
      backLang: defalutBackLang,
      numberOfWords: 10,
      message: '',
      realm: null,
    };
    for (let i = 0; i < this.state.numberOfWords; i++) {
      this.state.words.push(wordSchema);
    }
    this.registerWords = this.registerWords.bind(this);
    this.resetWords = this.resetWords.bind(this);
    this.translate = this.translate.bind(this);
    this.changeContent = this.changeContent.bind(this);
    this.changeLanguage = this.changeLanguage.bind(this);
  }

  async translate(isForword = true) {
    const {words, frontLang, backLang} = this.state;
    const fromLang = isForword ? frontLang : backLang;
    const toLang = !isForword ? frontLang : backLang;
    console.log('translate function started');
    console.log(this.state);
    if (!fromLang || !toLang) {
      console.log('言語を設定してください');
    } else {
      const translationTargets = [];
      const keys = [];
      let key = 0;
      for (const word of words) {
        const targetWord = isForword ? word.frontWord : word.backWord;
        if (targetWord !== '') {
          console.log(`${targetWord}を翻訳します`);
          translationTargets.push(targetWord);
          keys.push(key);
        }
        key++;
      }
      console.log(translationTargets, keys);
      if (translationTargets.length > 0) {
        const result = await translate(translationTargets, {
          from: fromLang,
          tld: 'com',
          to: toLang,
        });
        console.log(result, keys);
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
      }
    }
  }

  changeContent(v, i, label) {
    this.setState((prevState) => {
      const updatedWords = prevState.words.map((word, index) => {
        if (index === i) {
          return {
            ...word,
            [label]: v,
          };
        }
        return word;
      });
      return {words: updatedWords};
    });
  }

  changeLanguage(v, label) {
    this.setState((prevState) => {
      return {[label]: v};
    });
  }

  async registerWords() {
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
          this.setState({realm});
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
    console.log(`updatedWords ${JSON.stringify(updatedWords)}`);
    this.setState(() => {
      let message;
      if (numberOfRegisterd === 0) {
        message = '登録できる単語はありません';
      } else {
        message = `${numberOfRegisterd}件の単語を登録しました`;
      }
      return {words: updatedWords, message: message};
    });
  }

  async resetWords() {
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
    const {realm} = this.state;
    if (realm !== null && !realm.isClosed) {
      realm.close();
    }
  }

  handleChange(id) {
    this.setState((prevState) => {
      const updatedTodos = prevState.todos.map((todo) => {
        if (todo.id === id) {
          todo.done = !todo.done;
        }
        return todo;
      });
      return {
        todos: updatedTodos,
      };
    });
  }

  render() {
    const {words, numberOfWords, message, frontLang, backLang} = this.state;
    console.log(JSON.stringify(this.state));
    return (
      <View className="input-area" style={styles.inputArea}>
        <View style={styles.languageSelectArea}>
          <LanguageSelect
            label="frontLang"
            style={styles.languageSelect}
            value={frontLang}
            onValueChange={(v) => this.changeLanguage(v, 'frontLang')}
          />
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
          <LanguageSelect
            label="backLang"
            style={styles.languageSelect}
            value={backLang}
            onValueChange={(v) => this.changeLanguage(v, 'backLang')}
          />
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
              <View
                key={i}
                className="input-area"
                style={styles.oneCardInputArea}>
                <View
                  className="front-input-area"
                  style={styles.oneSideInputArea}>
                  <View className="form-area">
                    <TextInput
                      multiline={true}
                      numberOfLines={10}
                      // maxLength={1000}
                      label="frontWord"
                      value={words[i].frontWord}
                      style={formStyle}
                      placeholder="front word"
                      onChangeText={(v) =>
                        this.changeContent(v, i, 'frontWord')
                      }
                    />
                  </View>
                </View>
                <View
                  className="back-input-area"
                  style={styles.oneSideInputArea}>
                  <View className="form-area">
                    <TextInput
                      label="backWord"
                      multiline={true}
                      value={words[i].backWord}
                      style={formStyle}
                      placeholder="back word"
                      onChangeText={(v) => this.changeContent(v, i, 'backWord')}
                    />
                  </View>
                </View>
              </View>,
            );
          }
          return <View>{items}</View>;
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

export default AddContent;
