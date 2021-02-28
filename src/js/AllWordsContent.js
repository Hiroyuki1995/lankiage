import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  TextInput,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import IonIcon from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import {Button} from 'native-base';
import {Text} from 'react-native-elements';
const {width, height} = Dimensions.get('window');
import 'react-native-get-random-values';
import {Languages} from './Languages.js';
import {ScrollView} from 'react-native';
import Stars from './Stars';

class AllWordsContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      realm: this.props.route.params.realm,
      targetIds: [],
      message: '',
      modalIsVisible: false,
      searchString: '',
    };
    this.getLangName = this.getLangName.bind(this);
    this.openAddContent = this.openAddContent.bind(this);
    this.toggleCheckBox = this.toggleCheckBox.bind(this);
    this.canDelete = this.canDelete.bind(this);
    this.deleteWords = this.deleteWords.bind(this);
    this.searchWords = this.searchWords.bind(this);
  }

  searchWords(v) {
    this.setState({seachString: v, targetIds: []});
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

  canDelete() {
    if (this.state.targetIds.length > 0) {
      return false;
    }
    return true;
  }

  deleteWords() {
    try {
      console.log(this.state.targetIds);
      for (let id of this.state.targetIds) {
        this.state.realm.write(() => {
          this.state.realm.delete(
            this.state.realm.objects('Word').filtered(`id = "${id}"`),
          );
        });
      }
      const message = `Deleted ${this.state.targetIds.length} words`;
      this.setState({
        realm: this.state.realm,
        targetIds: [],
        message: message,
        modalIsVisible: false,
      });
    } catch (e) {
      console.log(e);
      this.setState({message: e});
    }
  }

  toggleCheckBox(wordId) {
    this.setState((prevState) => {
      let targetIds = prevState.targetIds;
      const index = targetIds.indexOf(wordId);
      if (index === -1) {
        targetIds.push(wordId);
      } else {
        targetIds.splice(index, 1);
      }
      console.log(JSON.stringify(targetIds));
      return {targetIds};
    });
  }

  componentDidMount() {
    this.removeListener = this.props.navigation.addListener('focus', () => {
      this.props.navigation.setParams({realm: this.props.route.params.realm});
    });
  }

  // componentDidUpdate() {
  //   console.log('allwords', JSON.stringify(this.state.words));
  // }

  componentWillUnmount() {
    console.log('componentWillUnmount in AllWordsContent');
    this.removeListener();
  }

  componentDidDisappear() {
    console.log('componentDidDisappear in AllWordsContent');
  }

  openAddContent(word) {
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

  render() {
    const {message, seachString, targetIds} = this.state;
    const words = this.state.realm
      .objects('Word')
      .filtered(`folderId = "${this.props.route.params.folder.id}"`);
    return (
      <ImageBackground
        style={styles.backgroundImage}
        // resizeMode="contain"
        source={require('../png/milky-way.jpg')}>
        <View style={styles.container}>
          <ScrollView style={styles.inputArea}>
            <View style={styles.seachArea}>
              <TextInput
                style={styles.searhText}
                onChangeText={this.searchWords}
                value={seachString}
              />
            </View>
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
                  danger
                  disabled={this.canDelete()}
                  variant="contained"
                  style={[styles.button, styles.submitButton]}
                  onPress={() => this.setState({modalIsVisible: true})}>
                  <Text style={styles.submitButtonText}>Delete</Text>
                </Button>
                <Button
                  block
                  light
                  variant="contained"
                  style={[styles.button, styles.resetButton]}
                  onPress={() => this.props.navigation.goBack()}>
                  <Text style={styles.resetButtonText}>Cancel</Text>
                </Button>
              </View>
            </View>
            {(() => {
              const items = [];
              for (let i = 0; i < words.length; i++) {
                let formStyle = {};
                if (words[i].isRegisterd) {
                  formStyle = [styles.inputForm, styles.inputRegisterdForm];
                } else {
                  formStyle = styles.inputForm;
                }
                items.push(
                  <View key={i} style={styles.oneCardView}>
                    <CheckBox
                      onAnimationType="fill"
                      offAnimationType="fill"
                      boxType="square"
                      style={styles.checkBox}
                      disabled={false}
                      value={targetIds.includes(words[i].id ? true : false)}
                      onValueChange={() => this.toggleCheckBox(words[i].id)}
                    />
                    <TouchableOpacity
                      style={styles.wordCard}
                      onPress={() => this.openAddContent(words[i])}>
                      <View style={{flexDirection: 'column', flex: 5}}>
                        <Stars
                          styles={styles}
                          changeLevel={this.changeLevel}
                          proficiencyLevel={words[i].proficiencyLevel}
                          value={words[i].id}
                        />
                        <Text style={styles.cardText} numberOfLines={1}>
                          {words[i].frontWord}
                        </Text>
                      </View>
                      <IonIcon
                        name="arrow-forward"
                        style={styles.folderArrowicon}
                      />
                    </TouchableOpacity>
                  </View>,
                );
              }
              return <View style={styles.cardArea}>{items}</View>;
            })()}
            <Modal
              style={styles.modal}
              visible={this.state.modalIsVisible}
              animationType={'fade'}
              backdropOpacity={0.5}
              // backdropColor="#rbga(0,0,0,0.6)"
              // tranparent={false}
              hasBackdrop={true}
              onBackdropPress={() => this.setState({modalIsVisible: false})}>
              <Text style={styles.modalText}>
                Are you sure you want to delete these words?
              </Text>
              <View style={styles.modalButtonArea}>
                <Button
                  block
                  danger
                  disabled={this.canDelete()}
                  variant="contained"
                  style={[styles.button, styles.modalSubmitButton]}
                  onPress={() => this.deleteWords()}>
                  <Text style={styles.submitButtonText}>Delete</Text>
                </Button>
                <Button
                  block
                  light
                  variant="contained"
                  style={[styles.button, styles.modalCancelButton]}
                  onPress={() => this.setState({modalIsVisible: false})}>
                  <Text style={styles.resetButtonText}>Cancel</Text>
                </Button>
              </View>
            </Modal>
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
  searhText: {
    borderRadius: 4,
    backgroundColor: '#ffffff',
    fontSize: 20,
    height: 30,
    flex: 1,
    paddingHorizontal: 10,
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
    // backgroundColor: '#2c8ef4',
    // color: 'white',
  },
  resetButton: {
    // borderColor: '#2c8ef4',
    // borderWidth: 1,
    // backgroundColor: 'white',
    // color: '#2c8ef4',
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
  },
  oneLanguageSelectArea: {
    flex: 1,
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
    fontSize: 30,
    color: '#ffffff',
  },
  wordCard: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: width * 0.7,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginVertical: 10,
  },
  cardText: {
    fontSize: 30,
    marginBottom: 10,
    flex: 5,
    textAlign: 'center',
  },
  cardArea: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
  },
  folderArrowicon: {
    fontSize: 30,
    flex: 1,
  },
  oneCardView: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkBox: {
    // flex: 1,
    width: 20,
    marginRight: 20,
  },
  modal: {
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.8,
    marginVertical: '85%',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    flex: 1,
    padding: 20,
  },
  modalText: {
    fontSize: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSubmitButton: {
    flex: 1,
  },
  modalCancelButton: {
    flex: 1,
  },
  modalButtonArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  star: {
    fontSize: 20,
    // paddingHorizontal: 10,
    color: '#ffd400',
  },
  starArea: {
    flexDirection: 'row',
  },
  seachArea: {
    marginHorizontal: 20,
  },
});

export default AllWordsContent;
