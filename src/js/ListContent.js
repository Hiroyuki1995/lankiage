import React, {Component} from 'react';
import {
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Item,
  Modal,
  ImageBackground,
} from 'react-native';
import {Text} from 'native-base';
import {Navigation} from 'react-native-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import FoundationIcon from 'react-native-vector-icons/Foundation';
// import AntIcon from 'react-native-vector-icons/AntDesign';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import CardFlip from 'react-native-card-flip';
import Tts from 'react-native-tts';
import Slider from '@react-native-community/slider';
import 'react-native-get-random-values';
const {width, height} = Dimensions.get('window');
const Realm = require('realm');
import {WordSchema} from './Schema.js';
import {FolderSchema} from './Schema.js';
import AddContent from './AddContent.js';
import { defaultPath } from 'realm';

class ListContent extends Component {
  constructor(props) {
    super(props);
    this.card = [];
    this.isFront = true;
    this.state = {
      words: [],
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
      currentPage: 0,
      isSliding: false,
      sortCondition: '1',
      defalutSortPattern: '1',
      isAutoPlaying: false,
      editModalIsVisible: false,
    };
    this.ScrollView = React.createRef();
    this.clickCard = this.clickCard.bind(this);
    this.editWord = this.editWord.bind(this);
    this.playback = this.playback.bind(this);
    this.stopPlaying = this.stopPlaying.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.scrollCardView = this.scrollCardView.bind(this);
    this.shuffle = this.shuffle.bind(this);
    this.openAddContent = this.openAddContent.bind(this);
  }

  componentDidMount() {
    console.log('componentDidMount');
    console.log(Realm.defaultPath);
    const realm = this.props.realm;
    if (this.state.defalutSortPattern === '1') {
      this.setState(() => {
        const defalutWords = realm
          .objects('Word')
          .sorted('createdAt', true);
        return {
          realm,
          words: defalutWords,
        };
      });
    }
    // try {
    //   Realm.open({
    //     schema: [WordSchema],
    //     deleteRealmIfMigrationNeeded: true,
    //   }).then((realm) => {
    //     if (this.state.defalutSortPattern === '1') {
    //       this.setState(() => {
    //         const defalutWords = realm
    //           .objects('Word')
    //           .sorted('createdAt', true);
    //         return {
    //           realm,
    //           words: defalutWords,
    //         };
    //       });
    //     }
    //   });
    // } catch (error) {
    //   console.log(error);
    // }
  }

  openAddContent() {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'Add',
        options: {
          topBar: {
            title: {
              text: 'Add'
            }
          }
        }
      }
    });
  }

  scrollCardView(event) {
    if (!this.state.isSliding) {
      let newPageNum = parseInt(event.nativeEvent.contentOffset.x / width, 10);
      this.setState({
        currentPage: newPageNum,
      });
    }
  }

  shuffle() {
    if (this.state.words) {
      let temp = this.state.words.slice();
      for (var i = temp.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        [temp[i], temp[j]] = [temp[j], temp[i]];
      }
      this.setState({words: temp, currentPage: 0});
    }
  }

  // componentDidUpdate(prevProps, prevState, snapshot) {
  // }

  sortWords(data) {
    // if (this.state.sortCondition === '1') {
    //   return data.sorted('createdAt', true);
    // }
    return data;
  }

  onPageChange(pageNumber) {
    this.setState({currentPage: pageNumber, isSliding: false});
    this.autoScroll(pageNumber);
  }

  componentWillUnmount() {
    // Close the realm if there is one open.
    // console.log('componentWillUnmount at ListContent');
    // const {realm} = this.state;
    // if (realm !== null && !realm.isClosed) {
    //   realm.close();
    // }
  }

  speakWord(
    pageNumber = this.state.currentPage,
    speakFrontWord = this.isFront,
  ) {
    const word = this.state.words[pageNumber];
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

  clickCard(pageNumber, ref, speakFrontWord) {
    ref.flip();
    this.isFront = !this.isFront;
    // this.speakWord(pageNumber, speakFrontWord);
  }

  editWord(word) {
    console.log('単語を編集します');
    this.setState({editModalIsVisible: true});
  }

  // setIntervalを使う方法
  sleep(waitSec, callbackFunc) {
    // 経過時間（秒）
    var spanedSec = 0;
    // 1秒間隔で無名関数を実行
    var id = setInterval(function () {
      spanedSec++;
      // 経過時間 >= 待機時間の場合、待機終了。
      if (spanedSec >= waitSec) {
        // タイマー停止
        clearInterval(id);
        // 完了時、コールバック関数を実行
        if (callbackFunc) {
          callbackFunc();
        }
      }
    }, 100);
  }

  playback() {
    this.setState({isAutoPlaying: true});
    Tts.removeAllListeners('tts-finish');
    Tts.addEventListener('tts-finish', () => {
      this.sleep(4, () => {
        let nextWordPage;
        console.log('tts-finish');
        // 自動再生中でない場合、または最後のカードの裏の場合、自動再生を止める。
        if (
          !this.state.isAutoPlaying ||
          (this.state.currentPage === this.state.words.length - 1 &&
            !this.isFront)
        ) {
          this.setState({isAutoPlaying: false});
          return;
        } else if (this.isFront) {
          // カードが表の場合は、カードをめくる
          nextWordPage = this.state.currentPage;
          this.card[this.state.currentPage].flip();
        } else {
          // 上記以外の場合、スクロールする
          nextWordPage = this.state.currentPage + 1;
          this.autoScroll();
        }
        this.isFront = !this.isFront;
        this.speakWord(nextWordPage);
      });
    });
    this.speakWord();
  }

  stopPlaying() {
    Tts.stop();
    Tts.removeAllListeners('tts-finish');
    this.setState({isAutoPlaying: false});
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
    console.log('render method is called');
    let wordCards;
    if (!this.state.words) {
      wordCards = <Text style={styles.message}>Loading...</Text>;
    } else if (this.state.words.length === 0) {
      wordCards = (
        <Text style={styles.message}>No words have been registered yet</Text>
      );
    } else {
      wordCards = this.state.words.map((word, key) => {
        return (
          <View key={word.id} style={styles.wordCardView}>
            <CardFlip
              style={styles.cardContainer}
              flipDirection="x"
              key={word.id}
              ref={(card) => (this.card[key] = card)}>
              <TouchableOpacity
                key={word.id}
                style={styles.card}
                onPress={() => {
                  this.clickCard(key, this.card[key], false);
                }}>
                <Text style={styles.cardWord}>{word.frontWord}</Text>
                <TouchableOpacity
                  onPress={() => this.speakWord(key, true)}
                  style={styles.soundOpacity}>
                  <FoundationIcon name="sound" style={styles.soundImage} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.editWord(word)}
                  style={styles.penOpacity}>
                  <Icon name="pencil-sharp" style={styles.penIcon} />
                </TouchableOpacity>
              </TouchableOpacity>

              <TouchableOpacity
                key={word.id}
                onPress={() => {
                  this.clickCard(key, this.card[key], true);
                }}
                style={[styles.card, styles.backCard]}>
                <Text style={styles.cardWord}>{word.backWord}</Text>
                <TouchableOpacity
                  onPress={() => this.speakWord(key, false)}
                  style={styles.soundOpacity}>
                  <FoundationIcon name="sound" style={styles.soundImage} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.editWord(word)}
                  style={styles.penOpacity}>
                  <Icon name="pencil-sharp" style={styles.penIcon} />
                </TouchableOpacity>
              </TouchableOpacity>
            </CardFlip>
          </View>
        );
      });
    }
    return (
      <View style={styles.listContentView}>
        <ImageBackground
          style={styles.backgroundImage}
          // resizeMode="contain"
          source={require('../png/milky-way.jpg')}
        >
          <View style={styles.background}>
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
              onScroll={(event) => this.scrollCardView(event)}>
              {wordCards}
            </ScrollView>
            <View>
              <Slider
                onSlidingStart={() => this.setState({isSliding: true})}
                onSlidingComplete={(pageNumber) => this.onPageChange(pageNumber)}
                style={styles.sliderView}
                minimumTrackTintColor="#ffffff"
                maximumTrackTintColor="#444444"
                maximumValue={this.state.words ? this.state.words.length - 1 : 0}
                minimumValue={0}
                value={this.state.currentPage}
                disableInitialCallback={true}
                step={1}
              >
                <Text style={styles.pageText}>
                  {this.state.currentPage + 1}/
                  {this.state.words ? this.state.words.length : 0}
                </Text>
              </Slider>
            </View>
            <View style={styles.settingArea}>
              {(() => {
                if (!this.state.isAutoPlaying) {
                  return (
                    <TouchableOpacity
                      onPress={() => this.playback()}
                      style={styles.playStopOpacity}>
                      <Icon
                        name="play-circle"
                        style={styles.playStopButton}
                      />
                    </TouchableOpacity>
                  );
                } else {
                  return (
                    <TouchableOpacity
                      onPress={() => this.stopPlaying()}
                      style={styles.playStopOpacity}>
                      <Icon
                        name="stop-circle-sharp"
                        style={styles.playStopButton}
                      />
                    </TouchableOpacity>
                  );
                }
              })()}
              <View>
                <TouchableOpacity
                  onPress={() => this.shuffle()}
                  style={styles.shuffleOpacity}>
                  <Icon
                    name="shuffle"
                    style={styles.shuffleButton}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.bottomArea}>
              <TouchableOpacity
                onPress={() => this.openAddContent()}>
                <FoundationIcon
                  name="plus"
                  style={styles.plusButton}
                />
              </TouchableOpacity>
            </View>
            <Modal
            style={styles.modalView}
            visible={this.state.editModalIsVisible}
            animationType={'slide' || 'fade'}>
            <View
            // style={{
            // flex: 1,
            // justifyContent: 'center',
            // alignItems: 'center',
            // backgroundColor: '#E5ECEE'
            // }}
            >
              <AddContent style={styles.addContentView} />
              <Text>This is a Modal.</Text>
              <TouchableOpacity
                // style={styles.closeButton}
                onPress={() => {
                  this.setState({editModalIsVisible: false});
                }}>
                <Text>Close</Text>
              </TouchableOpacity>
            </View>
          </Modal>
          </View>
        </ImageBackground>
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
    display: 'flex',
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
    // shadowOffset: {
    //   width: 0,
    //   height: 20,
    // },
    shadowRadius: 0,
    // shadowOpacity: 1,
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
    marginTop: height * 0.1,
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
    fontSize: 40,
  },
  penIcon: {
    fontSize: 40,
    // transform: [{scaleX: -1}],
  },
  settingArea: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginVertical: 20,
    flexDirection: 'row',
    width: width * 0.9,
    height: height * 0.1,
  },
  playStopButton: {
    fontSize: 80,
    color: '#ffffff',
  },
  shuffleButton: {
    fontSize: 50,
    color: '#ffffff',
  },
  playStopOpacity: {
  },
  shuffleOpacity: {
  },
  sliderView: {
    // width: '100%',
    marginHorizontal: width * 0.1,
    marginTop: 20,
  },
  pageText: {
    textAlign: 'right',
    marginTop: 20,
    color: '#ffffff',
  },
  closeButton: {
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  addContentView: {
    flex: 1,
    height: '100%',
  },
  wordCardView: {
    flex: 1,
  },
  listContentView: {
    flex: 1,
    backgroundColor: '#111111',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    width: width,
    height: height,
  },
  background: {
    backgroundColor: 'rgba(0,0,0, 0.5)',
    flex: 1,
  },
  bottomArea: {
    bottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusButton: {
    fontSize: 60,
    color: "#ffffff",
  },
});

export default ListContent;
