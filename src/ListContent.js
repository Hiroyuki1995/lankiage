import React, {Component} from 'react';
import {
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {Text} from 'native-base';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import CardFlip from 'react-native-card-flip';
import Tts from 'react-native-tts';
import Validation from './Validation';
const {width, height} = Dimensions.get('window');

class ListContent extends Component {
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
    this.handleClick2 = this.handleClick2.bind(this);
    this.handleWordChange = this.handleWordChange.bind(this);
    this.handleLangChange = this.handleLangChange.bind(this);
    this.move = this.move.bind(this);
  }

  async componentDidMount() {
    const response = await fetch('http://localhost:8080/api/words');
    const json = await response.json();
    // console.log(`json:${JSON.stringify(json)}`);
    this.setState({
      words: json,
    });
  }

  move(isForward = true) {
    const movingDistance = 240;
    // if (isForward) {
    //   Scroll.scroller.scrollTo('words-area', {
    //     duration: 1500,
    //     delay: 100,
    //     smooth: true,
    //     // containerId: 'ContainerElementID',
    //     offset: 50,
    //   });
    //   // document.getElementById("words-area").scrollBy(movingDistance,0);
    // } else {
    //   document.getElementById("words-area").scrollBy(-movingDistance,0);
    // }
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

  handleClick2(word, ref) {
    ref.flip();
    this.setState((prevState) => {
      const updatedWords = prevState.words.map((prevWord) => {
        if (prevWord.id === word.id) {
          // console.log(ref);
          prevWord.isFront = !prevWord.isFront;
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
        return prevWord;
      });
      return {
        words: updatedWords,
      };
    });
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
    const wordCards = this.state.words.map((word, key) => {
      return (
        <View key={word.id} className="oneCard">
          <CardFlip
            style={styles.cardContainer}
            key={key}
            ref={(card) => (this.card[key] = card)}>
            <TouchableOpacity
              className="card"
              style={styles.card}
              onPress={() => {
                this.handleClick2(word, this.card[key]);
              }}>
              <TouchableOpacity className="wordCard">
                <Text style={styles.cardWord}>{word.frontWord}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.handleSoundButtonPress(word)}>
                <Image
                  style={styles.image}
                  // source={require('./sound.svg')}
                />
              </TouchableOpacity>
            </TouchableOpacity>

            <TouchableOpacity
              className="card"
              onPress={() => {
                this.handleClick2(word, this.card[key]);
              }}
              style={styles.card}>
              <TouchableOpacity className="wordCard">
                <Text style={styles.cardWord}>{word.backWord}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.handleSoundButtonPress(word)}>
                <Image
                  style={styles.image}
                  // source={require('./sound.svg')}
                />
              </TouchableOpacity>
            </TouchableOpacity>
          </CardFlip>
        </View>
        // <WordCard key={word.id} word={word} handleClick={this.handleClick} isFront={this.state.isFront}/>
      );
    });
    return (
      <View>
        <ScrollView
          horizontal={true}
          id="words-area"
          name="words-area"
          className="words-area"
          style={styles.cardsArea}>
          {wordCards}
        </ScrollView>
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
    // paddingLeft: '10%',
    // paddingRight: '10%',
    // borderRadius: 5,
    // shadowColor: 'rgba(0,0,0,0.5)',
    // shadowOffset: {
    //   width: 0,
    //   height: 1,
    // },
    // shadowOpacity: 0.5,
    // backgroundColor: '#FE474C',
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

export default ListContent;
