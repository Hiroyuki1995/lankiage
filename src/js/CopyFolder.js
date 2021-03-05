import React, {Component} from 'react';
import {TextInput, Text, View, StyleSheet, Dimensions} from 'react-native';
import RadioForm from 'react-native-simple-radio-button';
import {Button} from 'native-base';
import LanguageSelect from './LanguageSelect';
import FolderSelect from './FolderSelect';
const {width, height} = Dimensions.get('window');
import {Languages} from './Languages.js';
import translate from 'translate-google-api';
import {v4 as uuidv4} from 'uuid';

class CopyFolder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      baseFolderId: '',
      folderName: '',
      frontLangCode: '',
      isBaseWordFront: true,
      realm: this.props.realm,
      message: null,
      focusForm: '',
      value: '',
    };
    this.onChange = this.onChange.bind(this);
    this.copyFolder = this.copyFolder.bind(this);
    this.getFolders = this.getFolders.bind(this);
    this.getLang = this.getLang.bind(this);
    this.getLangName = this.getLangName.bind(this);
    this.translate = this.translate.bind(this);
  }

  componentDidMount() {
    console.log('componentDidMount');
  }

  onChange(v, label) {
    this.setState({[label]: v});
  }

  getFolders() {
    const folders = this.state.realm.objects('Folder').map((folder) => {
      return {
        label: folder.name,
        value: folder.id,
      };
    });
    return folders;
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

  getLang() {
    const folder = this.state.realm
      .objects('Folder')
      .filtered(`id="${this.state.baseFolderId}"`)[0];
    if (folder) {
      return [
        {
          label: `Front: ${this.getLangName(folder.frontLangCode)}`,
          value: true,
        },
        {
          label: `Back: ${this.getLangName(folder.backLangCode)}`,
          value: false,
        },
      ];
    } else {
      return [
        {
          label: 'Front:',
          value: true,
        },
        {
          label: 'Back:',
          value: false,
        },
      ];
    }
  }

  getLangCodeFromFolder(folderId, isBaseWordFront) {
    const folder = this.state.realm
      .objects('Folder')
      .filtered(`id="${folderId}"`)[0];
    if (isBaseWordFront === true) {
      return folder.frontLangCode;
    } else {
      return folder.backLangCode;
    }
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

  async translate(words, fromLang, toLang) {
    let message = '';
    if (!(words && fromLang && toLang)) {
      message = 'An expected error has occured';
      this.setState({message: message});
      return;
    } else {
      console.log(words, fromLang, toLang);
      try {
        const result = await translate(words, {
          from: fromLang,
          tld: 'com',
          to: toLang,
        });
        console.log('result in translate', result);
        return result;
      } catch (e) {
        this.setState({message: e.message});
      }
    }
  }

  async copyFolder() {
    const {
      folderName,
      baseFolderId,
      frontLangCode,
      isBaseWordFront,
    } = this.state;
    console.log(folderName, baseFolderId, frontLangCode, isBaseWordFront);
    if (!(folderName && baseFolderId && frontLangCode)) {
      this.setState({message: 'Please fill out all the fields'});
    } else {
      const backLangCode = await this.getLangCodeFromFolder(
        baseFolderId,
        isBaseWordFront,
      );
      if (!backLangCode) {
        this.setState({message: 'a Please fill out all the fields'});
      }
      console.log('backLangCode', backLangCode);
      try {
        const folderId = uuidv4();
        this.state.realm.write(() => {
          // create a folder
          this.state.realm.create('Folder', {
            id: folderId,
            name: folderName,
            frontLangCode: frontLangCode,
            backLangCode: backLangCode,
            displayStarFrom: 1,
            displayStarTo: 3,
            createdAt: new Date(),
          });
        });

        const wordsObj = this.state.realm
          .objects('Word')
          .filtered(`folderId="${baseFolderId}"`);
        let baseWords = [];
        if (isBaseWordFront) {
          baseWords = wordsObj.map((wordObj) => {
            return wordObj.frontWord;
          });
        } else {
          baseWords = wordsObj.map((wordObj) => {
            return wordObj.backWord;
          });
        }
        // translation all of the words
        this.translate(
          baseWords,
          this.getLangTranslateCode(backLangCode),
          this.getLangTranslateCode(frontLangCode),
        ).then((results) => {
          console.log('result in copyFolder', results);

          this.state.realm.write(() => {
            let i = 1;
            for (let result of results) {
              this.state.realm.create('Word', {
                id: uuidv4(),
                folderId: folderId,
                frontWord: result,
                backWord: baseWords[i - 1],
                proficiencyLevel: 1,
                order: i,
                createdAt: new Date(),
              });
              i++;
              console.log('i', i);
            }
          });
        });
        this.props.goBack();
      } catch (e) {
        console.log(e);
        this.setState({message: e});
      }
    }
  }

  render() {
    const {folderName, baseFolderId, frontLangCode} = this.state;
    let messageArea = null;
    if (this.state.message) {
      messageArea = (
        <View style={styles.messageView}>
          <Text style={styles.messageText}>{this.state.message}</Text>
        </View>
      );
    }
    return (
      <View style={styles.view}>
        {messageArea}
        <View style={styles.OneLanguageArea}>
          <Text style={styles.labelText}>New Folder Name</Text>
          <TextInput
            label="folderName"
            style={styles.inputForm}
            onChangeText={(_v) => {
              this.onChange(_v, 'folderName');
            }}
            value={folderName}
            returnKeyType="next"
            onSubmitEditing={() => {
              this.setState({focusForm: 'baseFolderId'});
            }}
            onFocus={() => this.setState({focusForm: 'folderName'})}
          />
        </View>
        <View style={styles.OneLanguageArea}>
          <Text style={styles.labelText}>Translation Base Folder</Text>
          <FolderSelect
            items={this.getFolders()}
            focusForm={this.state.focusForm}
            label="baseFolderId"
            style={styles.languageSelect}
            value={baseFolderId}
            onValueChange={(v) => this.onChange(v, 'baseFolderId')}
            // onDonePress={() => this.setState({focusForm: 'backLangCode'})}
          />
        </View>
        <View style={styles.radioButtonArea}>
          <Text style={styles.labelText}>Translation Base Words</Text>
          <RadioForm
            radio_props={this.getLang()}
            onPress={(value) => {
              this.setState({isBaseWordFront: value});
            }}
          />
        </View>
        <View style={styles.OneLanguageArea}>
          <Text style={styles.labelText}>Front Language</Text>
          <LanguageSelect
            focusForm={this.state.focusForm}
            label="frontLangCode"
            style={styles.languageSelect}
            value={frontLangCode}
            onValueChange={(v) => this.onChange(v, 'frontLangCode')}
          />
        </View>
        <View style={styles.buttonArea}>
          <Button
            block
            primary
            style={styles.dissmissButton}
            onPress={() => {
              this.copyFolder();
            }}>
            <Text style={styles.buttonText}>Create &</Text>
            <Text style={styles.buttonText}>Translate</Text>
          </Button>
          <Button
            block
            light
            style={styles.dissmissButton}
            onPress={() => {
              this.props.goBack();
            }}>
            <Text style={styles.buttonText}>Cancel</Text>
          </Button>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  dissmissButton: {
    flex: 1,
    marginHorizontal: 10,
    flexDirection: 'column',
  },
  buttonText: {
    fontSize: 20,
    color: '#ffffff',
  },
  view: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: '#ffffff',
    width: 330,
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 10,
    height: 480,
  },
  text: {
    fontSize: 20,
  },
  OneLanguageArea: {
    // flexDirection: 'column',
    marginVertical: 10,
    // justifyContent: 'center',
  },
  messageView: {
    marginVertical: 10,
    justifyContent: 'center',
  },
  messageText: {
    fontSize: 18,
    color: '#dc143c',
  },
  labelView: {
    // alignItems: 'flex-start',
    // flex: 1,
    // width: width * 0.2,
    // justifyContent: 'center',
  },
  languageSelect: {
    // alignItems: 'center',
    // flex: 1,
    // width: width * 0.4,
    height: 30,
  },
  inputForm: {
    height: 40,
    borderColor: '#cccccc',
    borderWidth: 1,
    // width: width * 0.4,
    fontSize: 22,
    borderRadius: 4,
    padding: 5,
    backgroundColor: '#ffffff',
    width: 270,
    // fontSize: 40,
    // width: width * 0.8,
  },
  inputView: {
    width: width * 0.4,
  },
  buttonArea: {
    flexDirection: 'row',
    marginTop: 10,
  },
  labelText: {
    fontSize: 18,
  },
  confirmationModal: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    left: -20,
    bottom: -20,
    width: '100%',
  },
  confirmationView: {
    backgroundColor: '#ffffff',
    width: 300,
    height: 200,
    flexDirection: 'column',
    padding: 30,
    borderRadius: 10,
  },
  confirmationButtonArea: {
    flexDirection: 'row',
    marginTop: 20,
  },
  modalText: {
    fontSize: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonArea: {
    // alignItems: 'flex-start',
    // justifyContent: 'flex-start',
    // flex: 1,
    marginVertical: 10,
  },
});

export default CopyFolder;
