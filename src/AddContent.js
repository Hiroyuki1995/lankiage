import React, {Component} from 'react';
import {TextInput, View, Image, StyleSheet, Dimensions} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import {Button, Text, Form} from 'native-base';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import Tts from 'react-native-tts';
import Validation from './Validation';
const {width, height} = Dimensions.get('window');

class AddContent extends Component {
  constructor(props) {
    super(props);
    this.card = [];
    this.state = {
      words: [],
      isFront: true,
      info: {
        frontWord: '',
        backWord: '',
        frontLang: '',
        backLang: '',
      },
      message: {
        frontWord: '',
        backWord: '',
        frontLang: '',
        backLang: '',
      },
      loading: false,
    };
    this.handleClick = this.handleClick.bind(this);
    this.registNewWord = this.registNewWord.bind(this);
    this.handleWordChange = this.handleWordChange.bind(this);
    this.canSubmit = this.canSubmit.bind(this);
    this.handleLangChange = this.handleLangChange.bind(this);
    this.translate = this.translate.bind(this);
    this.canTranslate = this.canTranslate.bind(this);
  }

  async componentDidMount() {
    const response = await fetch('http://localhost:8080/api/words');
    const json = await response.json();
    // console.log(`json:${JSON.stringify(json)}`);
    this.setState({
      words: json,
    });
  }

  // サブミットできるときtrueを返す
  canSubmit = () => {
    const {info, message, loading} = this.state;

    const validInfo =
      Object.values(info).filter((value) => {
        return value === '';
      }).length === 0;
    const validMessage =
      Object.values(message).filter((value) => {
        return value !== '';
      }).length === 0;
    return validInfo && validMessage && !loading;
  };

  // 翻訳できるときtrueを返す
  canTranslate = () => {
    const target = ['frontWord', 'frontLang', 'backLang'];
    const {info} = this.state;

    for (let i = 0; i < target.length; i++) {
      if (info[target[i]] === '') {
        return false;
      }
      console.log('can translate');
      return true;
    }
  };

  async translate(isForword = true) {
    const {info} = this.state;
    const frontWord = info.frontWord;
    const frontLang = info.frontLang;
    const backLang = info.backLang;
    const backWord = info.backWord;
    const query = isForword
      ? `beforeWord=${frontWord}&beforeLang=${frontLang}&afterLang=${backLang}`
      : `beforeWord=${backWord}&beforeLang=${backLang}&afterLang=${frontLang}`;
    const answer = isForword ? 'backWord' : 'frontWord';
    const response = await fetch(
      `http://localhost:8080/api/translate?${query}`,
    );
    const json = await response.json();
    this.setState({
      info: {...info, [answer]: json.text},
    });
  }

  async registNewWord() {
    this.setState({loading: true});
    var fd = new FormData(document.getElementById('form'));
    fd.append('isFront', true);
    var object = {};
    fd.forEach(function (value, key) {
      object[key] = value;
    });
    console.log(JSON.stringify(object));
    const url = 'http://localhost:8080/api/words';
    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(object),
    });
    const response2 = await fetch('http://localhost:8080/api/words');
    const json = await response2.json();
    this.setState({
      words: json,
    });
    this.setState({loading: true});
  }

  handleClick(id) {
    this.setState((prevState) => {
      console.log(`id:${id}`);
      return {
        isFront: !prevState.isFront,
      };
    });
  }

  handleSoundButtonPress(word) {
    this.state.words.map((prevWord) => {
      if (prevWord.id === word.id) {
        let uttr = {};
        if (prevWord.isFront) {
          uttr.text = word.frontWord;
          uttr.voice = word.frontLang;
        } else {
          uttr.text = word.backWord;
          uttr.voice = word.backLang;
        }
        Tts.setDefaultLanguage(uttr.voice);
        Tts.speak(uttr.text);
      }
    });
  }

  handleLangChange = (event) => {
    console.log('clicked');
    const key = event.target.name;
    const value = event.target.value;
    const {info} = this.state;
    this.setState({
      info: {...info, [key]: value},
    });
    console.log(`this.state.info:${this.state.info}`);
  };

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

  onChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleWordChange = (event) => {
    const key = event.target.name;
    const value = event.target.value;
    const {info, message} = this.state;
    this.setState({
      info: {...info, [key]: value},
    });
    this.setState({
      message: {
        ...message,
        [key]: Validation.formValidate(key, value),
      },
    });
  };

  render() {
    const {message} = this.state;
    const registNewWord = (
      <Form id="form" autoComplete="off">
        <View className="input-area">
          <View>
            <View>
              <View className="form-area">
                <TextInput
                  required
                  label="front"
                  name="frontWord"
                  value={this.state.info.frontWord}
                  onChangeText={this.handleWordChange}
                  className="text-field">
                  <Text>
                    {message.frontWord && (
                      <div style={{color: 'red', fontSize: 8}}>
                        {message.frontWord}
                      </div>
                    )}
                  </Text>
                </TextInput>
              </View>
              <View>
                <View>
                  <Text id="demo-simple-select-label" required>
                    Language
                  </Text>
                  <RNPickerSelect
                    onValueChange={(value) => console.log(value)}
                    items={[
                      {label: '日本語', value: 'ja-JP'},
                      {label: '中文', value: 'zh-CN'},
                      {label: 'English', value: 'en-US'},
                    ]}
                    style={styles.pickerSelectStyles}
                    placeholder={{label: 'Select a Language', value: ''}}
                    Icon={() => (
                      <Text
                        style={{
                          position: 'absolute',
                          right: 95,
                          top: 10,
                          fontSize: 18,
                          color: '#789',
                        }}>
                        ▼
                      </Text>
                    )}
                  />
                </View>
              </View>
              <View className="translate-button-area">
                <View className="translate-buttons">
                  <Image
                    className="translate-button"
                    source={{uri: 'right_arrow.svg'}}
                    disabled={!this.canTranslate()}
                    onPress={this.translate}
                  />
                  <Image
                    className="translate-button"
                    source={{uri: 'left_arrow.svg'}}
                    onPress={() => this.translate(false)}
                  />
                </View>
              </View>
              <View>
                <View>
                  <View className="form-area">
                    <TextInput
                      required
                      label="back"
                      name="backWord"
                      value={this.state.info.backWord}
                      onChangeText={this.handleWordChange}
                      className="text-field"
                    />
                    <Text>
                      {message.backWord && (
                        <div style={{color: 'red', fontSize: 8}}>
                          {message.backWord}
                        </div>
                      )}
                    </Text>
                  </View>
                </View>
                <View>
                  <View className="select-area">
                    <Text id="demo-simple-select-label" required>
                      Language
                    </Text>
                    <RNPickerSelect
                      onValueChange={(value) => console.log(value)}
                      items={[
                        {label: '日本語', value: 'ja-JP'},
                        {label: '中文', value: 'zh-CN'},
                        {label: 'English', value: 'en-US'},
                      ]}
                      style={styles.pickerSelectStyles}
                      placeholder={{label: 'Select a Language', value: ''}}
                      Icon={() => (
                        <Text
                          style={{
                            position: 'absolute',
                            right: 95,
                            top: 10,
                            fontSize: 18,
                            color: '#789',
                          }}>
                          ▼
                        </Text>
                      )}
                    />
                  </View>
                </View>
              </View>
            </View>
            <View>
              <View />
              <View item className="submit-button-area">
                {/* <Button variant="contained" color="primary" onPress={this.translate}>Transalte</Button> */}
                <Button
                  variant="contained"
                  color="primary"
                  disabled={!this.canSubmit()}
                  onPress={this.registNewWord}>
                  <Text>Send</Text>
                </Button>
              </View>
            </View>
          </View>
        </View>
      </Form>
    );
    return (
      <View>
        <Image
          className="move-button"
          source={{uri: 'backward_arrow.svg'}}
          onPress={() => this.move(false)}
        />
        <Image
          className="move-button"
          source={{uri: 'forward_arrow.svg'}}
          onPress={() => this.move()}
        />
        <Text>{registNewWord}</Text>
        {/* <div className="css-rotate css-animation">
          <div className="css-hidden css-front">ＦＲＯＮＴ</div>
          <div className="css-hidden css-back">ＢＡＣＫ</div>
        </div> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
  cardContainer: {
    width: width * 0.8,
    height: height * 0.3,
    flex: 1,
  },
  card: {
    borderRadius: 5,
    shadowColor: 'rgba(0,0,0,0.5)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.5,
    backgroundColor: '#FE474C',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardWord: {
    fontSize: 40,
  },
  cardsArea: {
    flexDirection: 'row',
    flex: 1,
    marginTop: height * 0.2,
  },
  pickerSelectStyles: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#789',
    borderRadius: 4,
    color: '#789',
    paddingRight: 30, // to ensure the text is never behind the icon
    width: 300,
    marginLeft: 30,
  },
});

export default AddContent;
