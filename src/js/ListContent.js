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
import Slider from '@react-native-community/slider';
import 'react-native-get-random-values';
const {width, height} = Dimensions.get('window');
const Realm = require('realm');
import {WordSchema} from './Schema.js';

class ListContent extends Component {
  constructor(props) {
    super(props);
    this.card = [];
    this.state = {
      words: [],
      isFront: true,
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
      currentPage: 1,
      isSliding: false,
    };
    this.ScrollView = React.createRef();
    this.clickCard = this.clickCard.bind(this);
    this.editWord = this.editWord.bind(this);
    this.playback = this.playback.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.scrollCardView = this.scrollCardView.bind(this);
  }

  componentDidMount() {
    console.log(Realm.defaultPath);
    console.log(this.state.realm);
    Realm.open({
      schema: [WordSchema],
      deleteRealmIfMigrationNeeded: true,
    }).then((realm) => {
      this.setState({realm});
    });
  }

  scrollCardView(event) {
    console.log(event.nativeEvent.contentOffset.x);
    if (!this.state.isSliding) {
      let newPageNum = parseInt(
        // event.nativeEvent.contentOffset.x / width + 1,
        event.nativeEvent.contentOffset.x / width,
        10,
      );
      console.log(`newPageNum in scrollCardView: ${newPageNum}`);
      this.setState({
        currentPage: newPageNum,
      });
    }
    // newPageNum !== this.state.currentPage &&
    //   this.setState({
    //     currentPage: newPageNum,
    //   });
    // this.setState({
    //   horizontalScroll:
    //     // this.state.horizontalScroll +
    //     event.nativeEvent.contentOffset.x,
    // });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // console.log(`prevState.horizontalScroll ${prevState.horizontalScroll}`);
    // console.log(`currentPage in update ${prevState.currentPage}`);
    // this.autoScroll(prevState.currentPage);
  }

  onPageChange(pageNumber) {
    console.log(`pageNumber ${pageNumber}`);
    this.setState({currentPage: pageNumber, isSliding: false});
    // this.setState({isSliding: false});
    this.autoScroll(pageNumber);
  }

  componentWillUnmount() {
    // Close the realm if there is one open.
    const {realm} = this.state;
    if (realm !== null && !realm.isClosed) {
      realm.close();
    }
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

  clickCard(word, ref, speakFrontWord) {
    ref.flip();
    this.speakWord(word, speakFrontWord);
  }

  editWord(word) {
    console.log('単語を編集します');
  }

  playback() {
    console.log('単語を自動で再生します');
    this.autoScroll();
    // this.autoScroll();
  }

  autoScroll(pageNumber = this.state.currentPage + 1) {
    // X use for horizontal
    // let horizontalScroll = this.state.horizontalScroll;
    this.ScrollView.scrollTo({
      x: pageNumber * width,
      animated: true,
    });
  }

  render() {
    // console.log(`horizontalScroll ${JSON.stringify(this.state)}`);
    console.log(`currentPage in render: ${this.state.currentPage}`);
    console.log(`this.state.isSliding ${this.state.isSliding}`);
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
          scrollEnabled={!this.state.isSliding}
          style={styles.cardsArea}
          ref={(ref) => (this.ScrollView = ref)}
          // scrollEventThrottle={100}
          onScroll={(event) => this.scrollCardView(event)}>
          {wordCards}
        </ScrollView>
        <View>
          <Slider
            onSlidingStart={() => this.setState({isSliding: true})}
            // onSlidingComplete={() => this.setState({isSliding: false})}
            onSlidingComplete={(pageNumber) => this.onPageChange(pageNumber)}
            style={styles.sliderView}
            maximumValue={
              this.state.realm ? this.state.realm.objects('Word').length : 1
            }
            minimumValue={1}
            value={this.state.currentPage}
            disableInitialCallback={true}
            step={1}
            // onValueChange={(pageNumber) => this.onPageChange(pageNumber)}
          />
        </View>
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
  sliderView: {
    // width: '100%',
    marginHorizontal: width * 0.1,
    marginTop: 20,
  },
});

export default ListContent;
