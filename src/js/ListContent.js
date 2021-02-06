import React, {Component} from 'react';
import {
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Item,
} from 'react-native';
import {Text} from 'native-base';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import CardFlip from 'react-native-card-flip';
import Tts from 'react-native-tts';
// import Validation from './Validation';
import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';
const {width, height} = Dimensions.get('window');
const Realm = require('realm');
import {WordSchema} from './Schema.js';
let pageNumber = 1;

class ListContent extends Component {
  constructor(props) {
    super(props);
    this.card = [];
    this.state = {
      words: [],
      isFront: true,
      // info: {
      //   frontWord: '',
      //   backWord: '',
      //   frontLang: '',
      //   backLang: '',
      // },
      message: {
        frontWord: '',
        backWord: '',
        frontLang: '',
        backLang: '',
      },
      loading: false,
      realm: null,
      currentCardId: '',
      horizontalScroll: 0,
      // pageNumber: 0,
    };
    this.ScrollView = React.createRef();
    this.handleClick = this.handleClick.bind(this);
    this.clickCard = this.clickCard.bind(this);
    // this.handleWordChange = this.handleWordChange.bind(this);
    this.handleLangChange = this.handleLangChange.bind(this);
    this.move = this.move.bind(this);
    this.editWord = this.editWord.bind(this);
    this.playback = this.playback.bind(this);
  }

  componentDidMount() {
    // const response = await fetch('http://localhost:8080/api/words');
    // const json = await response.json();
    // // console.log(`json:${JSON.stringify(json)}`);
    // this.setState({
    //   words: json,
    // });
    console.log(Realm.defaultPath);
    console.log(this.state.realm);
    Realm.open({
      schema: [WordSchema],
      deleteRealmIfMigrationNeeded: true,
    }).then((realm) => {
      // console.log(this.state.realm.objects('Word'));
      // realm.write(() => {
      //   realm.create('Word', {
      //     id: uuidv4(),
      //     frontWord: '下雨',
      //     frontLang: 'zh-CN',
      //     backWord: '雨が降る',
      //     backLang: 'ja-JP',
      //   });
      // });
      this.setState({realm});
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    pageNumber = Math.floor(prevState.horizontalScroll / width) + 1;
    console.log(`prevState.horizontalScroll ${prevState.horizontalScroll}`);
    console.log(`pageNumber in update ${pageNumber}`);
  }

  componentWillUnmount() {
    // Close the realm if there is one open.
    const {realm} = this.state;
    if (realm !== null && !realm.isClosed) {
      realm.close();
    }
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

  speakWord(word, speakFrontWord) {
    let uttr = {};
    if (speakFrontWord) {
      uttr.text = word.frontWord;
      uttr.voice = word.frontLang;
    } else {
      uttr.text = word.backWord;
      uttr.voice = word.backLang;
    }
    Tts.setDefaultLanguage(uttr.voice);
    Tts.speak(uttr.text);
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

  clickCard(word, ref, speakFrontWord) {
    ref.flip();
    this.speakWord(word, speakFrontWord);
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

  // handleWordChange = (event) => {
  //   const key = event.target.name;
  //   const value = event.target.value;
  //   const {info, message} = this.state;
  //   this.setState({
  //     info: {...info, [key]: value},
  //   });
  //   this.setState({
  //     message: {
  //       ...message,
  //       [key]: Validation.formValidate(key, value),
  //     },
  //   });
  // };
  editWord(word) {
    console.log('単語を編集します');
  }

  playback() {
    console.log('単語を自動で再生します');
    this.autoScroll();
    this.autoScroll();
  }

  autoScroll() {
    // X use for horizontal
    // let horizontalScroll = this.state.horizontalScroll;
    this.ScrollView.scrollTo({
      x: this.state.horizontalScroll + width,
      animated: true,
    });
  }

  render() {
    console.log(`horizontalScroll ${JSON.stringify(this.state)}`);
    console.log(`pageNumber in render: ${pageNumber}`);
    let wordCards;
    if (!this.state.realm) {
      wordCards = <Text style={styles.message}>Loading...</Text>;
    } else if (this.state.realm.objects('Word').length === 0) {
      wordCards = (
        <Text style={styles.message}>No words have been registered yet</Text>
      );
    } else {
      wordCards = this.state.realm
        .objects('Word')
        .sorted('createdAt', true) // true->DESC
        .map((word, key) => {
          // console.log('id:' + word.id);
          return (
            <View key={word.id} className="oneCard">
              <CardFlip
                style={styles.cardContainer}
                flipDirection="x"
                key={word.id}
                ref={(card) => (this.card[key] = card)}>
                <TouchableOpacity
                  key={word.id}
                  className="card"
                  style={styles.card}
                  onPress={() => {
                    this.clickCard(word, this.card[key], false);
                  }}>
                  <Text style={styles.cardWord}>{word.frontWord}</Text>
                  <TouchableOpacity
                    onPress={() => this.speakWord(word, true)}
                    style={styles.soundOpacity}>
                    <Image
                      style={styles.soundImage}
                      resizeMode="contain"
                      source={require('../png/sound.png')}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => this.editWord(word)}
                    style={styles.penOpacity}>
                    <Image
                      style={styles.penImage}
                      resizeMode="contain"
                      source={require('../png/pen.png')}
                    />
                  </TouchableOpacity>
                </TouchableOpacity>

                <TouchableOpacity
                  className="card"
                  key={word.id}
                  onPress={() => {
                    this.clickCard(word, this.card[key], true);
                  }}
                  style={[styles.card, styles.backCard]}>
                  <Text style={styles.cardWord}>{word.backWord}</Text>
                  <TouchableOpacity
                    onPress={() => this.speakWord(word, false)}
                    style={styles.soundOpacity}>
                    <Image
                      style={styles.soundImage}
                      resizeMode="contain"
                      source={require('../png/sound.png')}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => this.editWord(word)}
                    style={styles.penOpacity}>
                    <Image
                      style={styles.penImage}
                      resizeMode="contain"
                      source={require('../png/pen.png')}
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
              </CardFlip>
            </View>
            // <WordCard key={word.id} word={word} handleClick={this.handleClick} isFront={this.state.isFront}/>
          );
        });
    }
    return (
      <View>
        <ScrollView
          horizontal={true}
          id="words-area"
          name="words-area"
          className="words-area"
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          style={styles.cardsArea}
          ref={(ref) => (this.ScrollView = ref)}
          onScroll={
            (event) =>
              this.setState({
                horizontalScroll:
                  // this.state.horizontalScroll +
                  event.nativeEvent.contentOffset.x,
              })
            // this.setState({
            //   horizontalScroll: event.nativeEvent.contentOffset.x,
            // })
            // this.setState((prevState) => {
            // console.log(event.nativeEvent.contentOffset.x);
            // const currentPageNumber = prevState.pageNumber;
            // let pageAdd = 1;
            // if (event.nativeEvent.contentOffset.x < 0) {
            //   pageAdd = -1;
            // } else {
            //   pageAdd = 1;
            // }
            // return {
            //   // ...prevState,
            //   pageNumber: currentPageNumber + pageAdd,
            //   // horizontalScroll: event.nativeEvent.contentOffset.x,
            // };
            // })
          }>
          {wordCards}
        </ScrollView>
        <View style={styles.settingArea}>
          <View style={styles.settingCard}>
            <TouchableOpacity
              onPress={() => this.playback()}
              style={styles.playbackOpacity}>
              <Image
                style={styles.playbackButton}
                source={require('../png/playback.png')}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>
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
    width: width * 0.9,
    height: height * 0.3,
    flex: 1,
    marginLeft: width * 0.05,
    marginRight: width * 0.05,
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
    // shadowColor: '#ccc',
    // shadowOffset: {
    //   width: 0,
    //   height: 100,
    // },
    // shadowRadius: 0,
    // shadowOpacity: 1,
  },
  card: {
    borderRadius: 10,
    shadowColor: '#ccc',
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowRadius: 0,
    shadowOpacity: 1,
    backgroundColor: '#ffffff',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backCard: {
    backgroundColor: '#fff0f5',
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
  message: {
    textAlign: 'right',
    width: '100%',
    paddingLeft: 10,
    fontSize: 18,
  },
  soundOpacity: {
    position: 'absolute',
    left: width * 0.05,
    bottom: 0,
  },
  penOpacity: {
    position: 'absolute',
    right: width * 0.05,
    bottom: height * 0.005,
  },
  soundImage: {
    width: 40,
    height: 40,
  },
  penImage: {
    width: 30,
    height: 30,
    transform: [{scaleX: -1}],
  },
  settingArea: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginVertical: 20,
  },
  settingCard: {
    backgroundColor: '#ffffff',
    width: width * 0.9,
    height: height * 0.2,
    borderRadius: 10,
  },
  playbackButton: {
    width: 30,
    height: 30,
  },
  playbackOpacity: {
    position: 'absolute',
    left: width * 0.05,
    top: height * 0.005,
  },
});

export default ListContent;
