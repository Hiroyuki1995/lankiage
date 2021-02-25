import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
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
const wordSchema = {
  frontWord: '',
  backWord: '',
  isRegisterd: false,
};

class AllWordsContent extends Component {
  constructor(props) {
    super(props);
    const words = this.props.route.params.realm
      .objects('Word')
      .sorted('createdAt', true)
      .filtered(`folderId = "${this.props.route.params.folder.id}"`);
    let updatedWords = [];
    for (let word of words) {
      word.isSelected = false;
      updatedWords.push(word);
    }
    this.state = {
      realm: this.props.route.params.realm,
      words: updatedWords,
      frontLangCode: this.props.route.params.folder.frontLangCode,
      backLangCode: this.props.route.params.folder.backLangCode,
      message: '',
      modalIsVisible: false,
    };
    this.getLangName = this.getLangName.bind(this);
    this.openAddContent = this.openAddContent.bind(this);
    this.toggleCheckBox = this.toggleCheckBox.bind(this);
    this.canDelete = this.canDelete.bind(this);
    this.deleteWords = this.deleteWords.bind(this);
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
    console.log(`canDelete ${JSON.stringify(this.state.words)}`);
    for (let word of this.state.words) {
      if (word.isSelected) {
        console.log('return false');
        return false;
      }
    }
    console.log('return true');
    return true;
  }

  deleteWords() {
    let targetIds = [];
    let message;
    try {
      let updatedWords = [];
      for (let word of this.state.words) {
        if (word.isSelected === true) {
          targetIds.push(word.id);
        } else {
          updatedWords.push(word);
        }
      }
      this.setState({words: updatedWords, modalIsVisible: false}, () => {
        this.props.route.params.deleteWords(targetIds);
      });
      message = `Deleted ${targetIds.length} words`;
    } catch (e) {
      console.log(e);
      message = e;
    } finally {
      this.setState({message: message});
    }
  }

  toggleCheckBox(index) {
    this.setState((prevState) => {
      let updatedWords = [];
      prevState.words.forEach((word, key) => {
        if (index === key) {
          word.isSelected = !word.isSelected;
        }
        updatedWords.push(word);
      });
      return {words: updatedWords};
    });
  }

  componentDidMount() {
    console.log('allwords', JSON.stringify(this.state.words));
  }

  componentDidUpdate() {
    console.log('allwords', JSON.stringify(this.state.words));
  }

  componentWillUnmount() {
    console.log('componentWillUnmount in AllWordsContent');
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
                      value={words[i].isSelected}
                      onValueChange={() => this.toggleCheckBox(i)}
                    />
                    <TouchableOpacity
                      style={styles.wordCard}
                      onPress={() => this.openAddContent(words[i])}>
                      <Text style={styles.cardText} numberOfLines={1}>
                        {words[i].frontWord}
                      </Text>
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
            <View>
              <View style={{flex: 1}}>
                <View style={styles.submitButtonView}>
                  <Button
                    block
                    danger
                    disabled={this.canDelete()}
                    variant="contained"
                    style={[styles.button, styles.submitButton]}
                    onPress={() => this.setState({modalIsVisible: true})}>
                    <Text h3 style={styles.submitButtonText}>
                      Delete
                    </Text>
                  </Button>
                  <Button
                    block
                    light
                    variant="contained"
                    style={[styles.button, styles.resetButton]}
                    onPress={() => this.props.navigation.goBack()}>
                    <Text h3 style={styles.resetButtonText}>
                      Cancel
                    </Text>
                  </Button>
                </View>
              </View>
            </View>
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
                  <Text h3 style={styles.submitButtonText}>
                    Delete
                  </Text>
                </Button>
                <Button
                  block
                  light
                  variant="contained"
                  style={[styles.button, styles.modalCancelButton]}
                  onPress={() => this.setState({modalIsVisible: false})}>
                  <Text h3 style={styles.resetButtonText}>
                    Cancel
                  </Text>
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
  },
  resetButtonText: {
    color: '#ffffff',
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
    // width: '40%',
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
    margin: 10,
    flex: 5,
    textAlign: 'center',
  },
  cardArea: {
    justifyContent: 'center',
    alignItems: 'center',
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
});

export default AllWordsContent;
