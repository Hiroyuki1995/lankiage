import React, {Component} from 'react';
import {TextInput, Text, View, StyleSheet, Dimensions} from 'react-native';
import {Button} from 'native-base';
import {Navigation} from 'react-native-navigation';
import LanguageSelect from './LanguageSelect';
const {width, height} = Dimensions.get('window');
import {FolderSchema} from './Schema.js';
import {v4 as uuidv4} from 'uuid';

class AddNewFolder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.folder ? this.props.folder.id : '',
      folderName: this.props.folder ? this.props.folder.name : '',
      frontLangCode: this.props.folder.frontLangCode,
      backLangCode: this.props.folder.backLangCode,
      realm: null,
    };
    this.onChange = this.onChange.bind(this);
    this.editFolder = this.editFolder.bind(this);
    this.deleteFolder = this.deleteFolder.bind(this);
    this.getLangName = this.getLangName.bins(this);
  }

  componentDidMount() {
    console.log('componentDidMount');
    const realm = this.props.realm;
  }

  onChange(v, label) {
    this.setState({[label]: v});
  }

  editFolder() {
    const {folderName, frontLangCode, backLangCode} = this.state;
    // console.log(this.props.realm.isClosed);
    if (folderName && frontLangCode && backLangCode) {
      this.props.editFolder(this.state, this.props.isEditing);
      // Navigation.dismissOverlay(this.props.componentId);
      this.props.goBack();
    } else {
      console.log('入力してください');
    }
  }

  deleteFolder() {
    console.log('削除します');
    const {id} = this.state;
    if (id) {
      this.props.deleteFolder(id);
      this.props.goBack();
    }
  }

  render() {
    const {folderName, frontLangCode, backLangCode} = this.state;
    console.log(`isEditing ${this.props.isEditing}`);
    return (
      <View style={styles.view}>
        <View style={styles.OneLanguageArea}>
          <View style={styles.labelView}>
            <Text>Folder Name</Text>
          </View>
          <TextInput
            style={styles.inputForm}
            onChangeText={(_v) => {
              this.onChange(_v, 'folderName');
            }}
            value={folderName}
          />
        </View>
        <View style={styles.OneLanguageArea}>
          <View style={styles.labelView}>
            <Text>Front Language</Text>
          </View>
          <View style={styles.inputView}>
            <LanguageSelect
              label="frontLangCode"
              style={styles.languageSelect}
              value={frontLangCode}
              onValueChange={(v) => this.onChange(v, 'frontLangCode')}
            />
          </View>
        </View>
        <View style={styles.OneLanguageArea}>
          <View style={styles.labelView}>
            <Text>Back Language</Text>
          </View>
          <View style={styles.inputView}>
            <LanguageSelect
              label="backLangCode"
              style={styles.languageSelect}
              value={backLangCode}
              onValueChange={(v) => this.onChange(v, 'backLangCode')}
            />
          </View>
        </View>
        <View style={styles.OneLanguageArea}>
          {(() => {
            if (this.props.isEditing) {
              return (
                <Button
                  block
                  danger
                  style={styles.dissmissButton}
                  onPress={() => {
                    this.deleteFolder();
                  }}>
                  <Text style={styles.buttonText}>Delete</Text>
                </Button>
              );
            }
          })()}
          <Button
            block
            primary
            style={styles.dissmissButton}
            onPress={() => {
              this.editFolder();
            }}>
            <Text style={styles.buttonText}>
              {(() => {
                return this.props.isEditing ? 'Update' : 'Create';
              })()}
            </Text>
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
    // width: 50,
    // height: 50,
  },
  buttonText: {
    fontSize: 20,
    color: '#ffffff',
  },
  view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    width: width * 0.8,
    // height: height * 0.6,
    // opacity: 0.98,
    // height: '50%',
    // elevation: 4,
    padding: 16,
    borderRadius: 10,
    marginVertical: '77%',
  },
  text: {
    fontSize: 20,
  },
  OneLanguageArea: {
    flexDirection: 'row',
    marginVertical: 10,
    justifyContent: 'center',
  },
  labelView: {
    alignItems: 'flex-start',
    flex: 1,
    width: width * 0.2,
    justifyContent: 'center',
  },
  languageSelect: {
    // alignItems: 'center',
    // flex: 1,
    // width: width * 0.4,
    height: 30,
  },
  inputForm: {
    height: 30,
    borderColor: '#cccccc',
    borderWidth: 1,
    width: width * 0.4,
    fontSize: 18,
    borderRadius: 4,
    padding: 5,
    backgroundColor: '#ffffff',
    // fontSize: 40,
    // width: width * 0.8,
  },
  inputView: {
    width: width * 0.4,
  },
});

export default AddNewFolder;
