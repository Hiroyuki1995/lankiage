import React, {Component} from 'react';
import {
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Item,
  ImageBackground,
} from 'react-native';
import {Button} from 'native-base';
import {Text} from 'native-base';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Ionicons';
import FoundationIcon from 'react-native-vector-icons/Foundation';
import CommunityICon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import CardFlip from 'react-native-card-flip';
import Tts from 'react-native-tts';
import Slider from '@react-native-community/slider';
import 'react-native-get-random-values';
const {width, height} = Dimensions.get('window');
const Realm = require('realm');
import AddContent from './AddContent.js';
import Stars from './Stars';

class ListContent extends Component {
  constructor(props) {
    super(props);
    this.card = [];
    this.isFront = true;
    this.state = {
      realm: this.props.route.params.realm,
      horizontalScroll: 0,
      currentPage: 0,
      isSliding: false,
      sortCondition: '1',
      defalutSortPattern: '1',
      isAutoPlaying: false,
      editModalIsVisible: false,
      isDeleteModalVisible: false,
      filtered: false,
      deleteTargetId: null,
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
    this.changeLevel = this.changeLevel.bind(this);
    this.changeFilterLevel = this.changeFilterLevel.bind(this);
    this.isFiltered = this.isFiltered.bind(this);
    this.deleteWord = this.deleteWord.bind(this);
    // this.removeListener = this.removeListener.bind(this);
  }

  componentDidMount() {
    console.log('componentDidMount in ListContent');
    this.removeListener = this.props.navigation.addListener('focus', () => {
      console.log('eventlistener comes out');
      this.props.navigation.setParams({realm: this.props.route.params.realm});
    });
  }

  componentWillUnmount() {
    console.log('componentWillUnmount in ListContent');
    this.removeListener();
  }

  componentDidUpdate() {
    console.log('componentDidUpdate in ListContent');
  }

  componentDidDisappear() {
    console.log('componentDidDisappear in ListContent');
  }

  getWordsFromRealm(realm) {
    const folder = realm
      .objects('Folder')
      .filtered(`id = "${this.props.route.params.folder.id}"`)[0];
    return realm
      .objects('Word')
      .sorted('order', true)
      .filtered(
        `folderId = "${folder.id}" AND proficiencyLevel >= ${folder.displayStarFrom} AND proficiencyLevel <= ${folder.displayStarTo}`,
      );
  }

  openAddContent() {
    this.props.navigation.navigate('Add', {
      folder: this.props.route.params.folder,
      registerWords: this.props.route.params.registerWords,
    });
  }

  changeLevel(level, wordId) {
    this.state.realm.write(() => {
      this.state.realm.create(
        'Word',
        {
          id: wordId,
          proficiencyLevel: level,
        },
        'modified',
      );
    });
    this.setState({realm: this.state.realm});
  }

  changeFilterLevel(level, folderId, isFrom) {
    console.log('aaa', level, folderId, isFrom);
    if (isFrom === true) {
      this.state.realm.write(() => {
        this.state.realm.create(
          'Folder',
          {
            id: folderId,
            displayStarFrom: level,
          },
          'modified',
        );
      });
    } else if (isFrom === false) {
      this.state.realm.write(() => {
        this.state.realm.create(
          'Folder',
          {
            id: folderId,
            displayStarTo: level,
          },
          'modified',
        );
      });
    }
    this.setState({realm: this.state.realm});
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
    const allWords = this.state.realm
      .objects('Word')
      .filtered(`folderId = "${this.props.route.params.folder.id}"`);
    let orderNumberArray = allWords.map((word) => {
      return word.order;
    });
    console.log('orderNumberArray', orderNumberArray);
    for (let i = orderNumberArray.length - 1; i > 0; i--) {
      // 0〜(i+1)の範囲で値を取得
      var r = Math.floor(Math.random() * (i + 1));
      // 要素の並び替えを実行
      var tmp = orderNumberArray[i];
      orderNumberArray[i] = orderNumberArray[r];
      orderNumberArray[r] = tmp;
    }
    console.log('orderNumberArray', orderNumberArray);
    let i = 0;
    for (const word of allWords) {
      this.state.realm.write(() => {
        this.state.realm.create(
          'Word',
          {
            id: word.id,
            order: orderNumberArray[i],
          },
          'modified',
        );
      });
      i++;
    }
    this.setState({
      realm: this.state.realm,
      currentPage: 0,
    });
  }

  // componentDidUpdate() {
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

  speakWord(
    pageNumber = this.state.currentPage,
    speakFrontWord = this.isFront,
  ) {
    const word = this.getWordsFromRealm(this.state.realm)[pageNumber];
    const {frontLangCode, backLangCode} = this.props.route.params.folder;
    let uttr = {};
    if (speakFrontWord) {
      uttr.text = word.frontWord;
      uttr.voice = frontLangCode;
    } else {
      uttr.text = word.backWord;
      uttr.voice = backLangCode;
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
    const wordsObj = [
      {
        id: word.id,
        frontWord: word.frontWord,
        backWord: word.backWord,
        isRegisterd: false,
      },
    ];
    this.props.navigation.navigate('Add', {
      folder: this.props.route.params.folder,
      registerWords: this.props.route.params.registerWords,
      words: wordsObj,
      numberOfWords: 1,
      isEditing: true,
    });
  }

  deleteWord() {
    this.state.realm.write(() => {
      const target = this.state.realm
        .objects('Word')
        .filtered(`id = "${this.state.deleteTargetId}"`);
      this.state.realm.delete(target);
    });
    this.setState({
      realm: this.state.realm,
      isDeleteModalVisible: false,
    });
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
          (this.state.currentPage ===
            this.getWordsFromRealm(this.state.realm).length - 1 &&
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

  isFiltered() {
    const folder = this.state.realm
      .objects('Folder')
      .filtered(`id = "${this.props.route.params.folder.id}"`)[0];
    const displayStarFrom = folder.displayStarFrom;
    const displayStarTo = folder.displayStarTo;
    if (displayStarFrom === 1 && displayStarTo === 3) {
      return false;
    }
    return true;
  }

  render() {
    console.log('render method is called');
    let wordCards;
    if (!this.getWordsFromRealm(this.state.realm)) {
      wordCards = (
        <View style={styles.messageTextView}>
          <Text style={styles.message}>Loading...</Text>
        </View>
      );
    } else if (this.getWordsFromRealm(this.state.realm).length === 0) {
      wordCards = (
        <View style={styles.messageTextView}>
          <Text style={styles.message}>No words have been registered yet</Text>
          <Text style={styles.message}>Please register words</Text>
          <Text style={styles.message}>from the PLUS button below</Text>
        </View>
      );
    } else {
      wordCards = this.getWordsFromRealm(this.state.realm).map((word, key) => {
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
                <Stars
                  styles={styles}
                  changeLevel={this.changeLevel}
                  proficiencyLevel={word.proficiencyLevel}
                  value={word.id}
                />
                <View style={styles.wordArea}>
                  <Text
                    numberOfLines={4}
                    adjustsFontSizeToFit={true}
                    style={styles.cardWord}>
                    {word.frontWord}
                  </Text>
                </View>
                <View style={styles.buttonArea}>
                  <View style={styles.deleteOpacity}>
                    <AntIcon
                      name="delete"
                      style={styles.deleteImage}
                      onPress={() => {
                        this.setState({
                          isDeleteModalVisible: true,
                          deleteTargetId: word.id,
                        });
                      }}
                    />
                  </View>
                  <View style={styles.soundOpacity}>
                    <AntIcon
                      name="sound"
                      style={styles.soundImage}
                      onPress={() => this.speakWord(key, true)}
                    />
                  </View>
                  <View style={styles.penOpacity}>
                    <Icon
                      name="pencil-sharp"
                      style={styles.penIcon}
                      onPress={() => this.editWord(word)}
                    />
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                key={word.id}
                onPress={() => {
                  this.clickCard(key, this.card[key], true);
                }}
                style={[styles.card, styles.backCard]}>
                <Stars
                  styles={styles}
                  changeLevel={this.changeLevel}
                  proficiencyLevel={word.proficiencyLevel}
                />
                <View style={styles.wordArea}>
                  <Text
                    numberOfLines={4}
                    adjustsFontSizeToFit={true}
                    style={styles.cardWord}>
                    {word.backWord}
                  </Text>
                </View>
                <View style={styles.buttonArea}>
                  <View style={styles.deleteOpacity}>
                    <AntIcon
                      name="delete"
                      style={styles.deleteImage}
                      onPress={() => {
                        this.setState({
                          isDeleteModalVisible: true,
                          deleteTargetId: word.id,
                        });
                      }}
                    />
                  </View>
                  <View style={styles.soundOpacity}>
                    <AntIcon
                      name="sound"
                      style={styles.soundImage}
                      onPress={() => this.speakWord(key, true)}
                    />
                  </View>
                  <View style={styles.penOpacity}>
                    <Icon
                      name="pencil-sharp"
                      style={styles.penIcon}
                      onPress={() => this.editWord(word)}
                    />
                  </View>
                </View>
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
          source={require('../png/milky-way.jpg')}>
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
            <Icon name="list" style={{fontSize: 30}} />
            <View>
              <Slider
                onSlidingStart={() => this.setState({isSliding: true})}
                onSlidingComplete={(pageNumber) =>
                  this.onPageChange(pageNumber)
                }
                style={styles.sliderView}
                minimumTrackTintColor="#ffffff"
                maximumTrackTintColor="#444444"
                maximumValue={
                  this.getWordsFromRealm(this.state.realm)
                    ? this.getWordsFromRealm(this.state.realm).length - 1
                    : 0
                }
                minimumValue={0}
                value={this.state.currentPage}
                disableInitialCallback={true}
                step={1}>
                <Text style={styles.pageText}>
                  {this.state.currentPage + 1}/
                  {this.getWordsFromRealm(this.state.realm)
                    ? this.getWordsFromRealm(this.state.realm).length
                    : 0}
                </Text>
              </Slider>
            </View>
            <View style={styles.settingArea}>
              <TouchableOpacity
                onPress={() => this.shuffle()}
                style={styles.shuffleOpacity}>
                <Icon name="shuffle" style={styles.shuffleButton} />
              </TouchableOpacity>
              {(() => {
                if (!this.state.isAutoPlaying) {
                  return (
                    <TouchableOpacity
                      onPress={() => this.playback()}
                      style={styles.playStopOpacity}>
                      <Icon name="play-circle" style={styles.playStopButton} />
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
              <TouchableOpacity
                onPress={() => this.setState({editModalIsVisible: true})}
                style={styles.shuffleOpacity}>
                {(() => {
                  if (this.isFiltered() === true) {
                    return (
                      <CommunityICon
                        name="filter"
                        style={styles.shuffleButton}
                      />
                    );
                  }
                  return (
                    <CommunityICon
                      name="filter-outline"
                      style={styles.shuffleButton}
                    />
                  );
                })()}
              </TouchableOpacity>
            </View>
            <View style={styles.bottomArea}>
              <TouchableOpacity onPress={() => this.openAddContent()}>
                <MaterialIcon name="playlist-add" style={styles.plusButton} />
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
        <Modal
          style={styles.modal}
          visible={this.state.editModalIsVisible}
          animationType={'fade'}
          backdropOpacity={0.5}
          hasBackdrop={true}
          onBackdropPress={() => this.setState({editModalIsVisible: false})}>
          <View style={styles.modalView}>
            <View style={styles.modalTextArea}>
              <View style={styles.modalTextInsideArea}>
                <Text style={styles.modalText}>proficiency level</Text>
              </View>
              <View style={styles.modalConditionArea}>
                <Stars
                  styles={styles}
                  changeLevel={this.changeFilterLevel}
                  proficiencyLevel={
                    this.state.realm
                      .objects('Folder')
                      .filtered(`id="${this.props.route.params.folder.id}"`)[0]
                      .displayStarFrom
                  }
                  value={this.props.route.params.folder.id}
                  isFrom={true}
                />
                <Text style={styles.modalSymbol}>〜</Text>
                <Stars
                  styles={styles}
                  changeLevel={this.changeFilterLevel}
                  proficiencyLevel={
                    this.state.realm
                      .objects('Folder')
                      .filtered(`id="${this.props.route.params.folder.id}"`)[0]
                      .displayStarTo
                  }
                  value={this.props.route.params.folder.id}
                  isFrom={false}
                />
              </View>
            </View>
            <View style={styles.buttonArea}>
              <Button
                block
                primary
                style={styles.okButton}
                onPress={() => {
                  this.setState({editModalIsVisible: false});
                }}>
                <Text style={styles.buttonText}>OK</Text>
              </Button>
            </View>
          </View>
        </Modal>
        <Modal
          style={styles.modal}
          visible={this.state.isDeleteModalVisible}
          animationType={'fade'}
          backdropOpacity={0.5}
          hasBackdrop={true}
          onBackdropPress={() => this.setState({isDeleteModalVisible: false})}>
          <View style={styles.confirmationView}>
            <Text style={styles.modalText}>
              Are you sure you want to delete these words?
            </Text>
            <View style={styles.confirmationButtonArea}>
              <Button
                block
                danger
                style={styles.dissmissButton}
                onPress={() => {
                  this.deleteWord();
                }}>
                <Text style={styles.buttonText}>Delete</Text>
              </Button>
              <Button
                block
                light
                style={styles.dissmissButton}
                onPress={() => {
                  this.setState({isDeleteModalVisible: false});
                }}>
                <Text style={styles.buttonText}>Cancel</Text>
              </Button>
            </View>
          </View>
        </Modal>
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
  },
  card: {
    borderRadius: 10,
    shadowColor: '#fff',
    padding: 10,
    shadowRadius: 10,
    shadowOpacity: 0.8,
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
    justifyContent: 'center',
  },
  cardsArea: {
    flexDirection: 'row',
    flex: 1,
    marginTop: height * 0.1,
  },
  message: {
    textAlign: 'center',
    width: '100%',
    paddingLeft: 10,
    fontSize: 18,
    color: '#ffffff',
  },
  soundOpacity: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteOpacity: {
    alignItems: 'flex-start',
    flex: 1,
    marginLeft: 20,
  },
  penOpacity: {
    flex: 1,
    alignItems: 'flex-end',
    marginRight: 20,
  },
  soundImage: {
    fontSize: 40,
  },
  penIcon: {
    fontSize: 40,
  },
  deleteImage: {
    fontSize: 40,
  },
  settingArea: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginVertical: 20,
    flexDirection: 'row',
    width: width * 0.9,
    height: height * 0.1,
    left: 20,
  },
  playStopButton: {
    fontSize: 80,
    color: '#ffffff',
    marginHorizontal: 20,
  },
  shuffleButton: {
    fontSize: 50,
    color: '#ffffff',
    marginHorizontal: 20,
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
  addContentView: {
    flex: 1,
    height: '100%',
  },
  wordCardView: {
    flex: 1,
  },
  listContentView: {
    flex: 1,
    // backgroundColor: '#111111',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
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
    color: '#ffffff',
  },
  messageTextView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordArea: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonArea: {
    flexDirection: 'row',
    flex: 1,
  },
  starArea: {
    flexDirection: 'row',
  },
  star: {
    fontSize: 36,
    paddingHorizontal: 10,
    color: '#ffd400',
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    left: -20,
    bottom: -20,
    width: '100%',
    flex: 1,
  },
  modalView: {
    // flex: 1,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    width: 330,
    padding: 16,
    borderRadius: 10,
    borderColor: '#000000',
    borderWidth: 1,
  },
  modalText: {
    fontSize: 18,
  },
  modalSymbol: {
    transform: [{rotate: '90deg'}],
  },
  modalTextArea: {
    // flex: 1,
    flexDirection: 'row',
  },
  modalTextInsideArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  modalConditionArea: {
    flexDirection: 'column',
    flex: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  okButton: {
    width: '30%',
    margin: 20,
  },
  buttonText: {
    fontSize: 22,
  },
  confirmationView: {
    backgroundColor: '#ffffff',
    width: 300,
    height: 200,
    flexDirection: 'column',
    padding: 30,
    borderColor: '#000000',
    borderWidth: 1,
    borderRadius: 10,
  },
  dissmissButton: {
    flex: 1,
    marginHorizontal: 10,
    // width: 50,
    // height: 50,
  },
  // buttonText: {
  //   fontSize: 20,
  //   color: '#ffffff',
  // },
  confirmationButtonArea: {
    flexDirection: 'row',
    marginTop: 20,
  },
});

export default ListContent;
