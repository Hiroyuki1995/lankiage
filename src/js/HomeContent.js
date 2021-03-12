import React, {Component} from 'react';
import {
  TouchableOpacity,
  ScrollView,
  Text,
  View,
  StyleSheet,
  Dimensions,
  ImageBackground,
} from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Ionicons';
import FoundationIcon from 'react-native-vector-icons/Foundation';
import FontIcon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
const Realm = require('realm');
import {WordSchema} from './Schema.js';
const {width, height} = Dimensions.get('window');
import {FolderSchema} from './Schema.js';
import {v4 as uuidv4} from 'uuid';
import AddNewFolder from './AddNewFolder.js';
import CopyFolder from './CopyFolder.js';

class HomeContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      realm: new Realm({
        schema: [FolderSchema, WordSchema],
        // schemaVersion: 1,
        deleteRealmIfMigrationNeeded: true,
      }),
      isEditorVisible: false,
      isEditor2Visible: false,
      folder: null,
      isCopyVisible: false,
    };
    // this.realm = null;
    this.openFolderEdit = this.openFolderEdit.bind(this);
    this.openFolderEdit2 = this.openFolderEdit2.bind(this);
    this.openFolder = this.openFolder.bind(this);
    this.editFolder = this.editFolder.bind(this);
    this.copyFolder = this.copyFolder.bind(this);
    this.deleteFolder = this.deleteFolder.bind(this);
    this.registerWords = this.registerWords.bind(this);
    this.showAllCards = this.showAllCards.bind(this);
    this.deleteWords = this.deleteWords.bind(this);
  }

  componentDidMount() {
    const route = this.props.navigation;
    console.log(`route ${route}`);
    console.log(Realm.defaultPath);
    console.log('componentDidMount at HomeContent');
    // try {
    //   this.setState({
    //     realm: new Realm({
    //       schema: [FolderSchema, WordSchema],
    //       // schemaVersion: 1,
    //       deleteRealmIfMigrationNeeded: true,
    //     }),
    //   });
    //   Realm.open({
    //     schema: [FolderSchema, WordSchema],
    //     deleteRealmIfMigrationNeeded: true,
    //   }).then((realm) => {
    //     this.setState({realm});
    //   });
    // } catch (error) {
    //   console.log(error);
    // }
  }

  // componentDidUpdate() {
  //   console.log('componentDidUpdate at HomeContent');
  //   console.log(JSON.stringify(this.state.realm.objects('Word')));
  // }

  componentWillUnmount() {
    // Close the realm if there is one open.
    const {realm} = this.state;
    if (realm !== null && !realm.isClosed) {
      console.log('realm will be closed at componentWillUnmount');
      realm.close();
    }
  }

  showAllCards() {
    console.log('aaa');
  }

  deleteWords(targetIds) {
    let realm = this.state.realm;
    console.log('HomeContent' + JSON.stringify(targetIds));
    for (let id of targetIds) {
      realm.write(() => {
        const target = realm.objects('Word').filtered(`id = "${id}"`);
        realm.delete(target);
      });
    }
    this.setState({realm});
  }

  registerWords(info, folderId, isEditing) {
    console.log('HomeContent' + JSON.stringify(info));
    // if (!this.realm) {
    //   this.realm = new Realm({schema: [FolderSchema, WordSchema]});
    // }
    let realm = this.state.realm;
    const numOfWords = realm.objects('Word').filtered(`folderId="${folderId}"`)
      .length;
    let i = 1;
    for (let word of info.words) {
      if (word.frontWord && word.backWord) {
        if (!isEditing) {
          realm.write(() => {
            realm.create('Word', {
              id: uuidv4(),
              folderId: folderId,
              frontWord: word.frontWord,
              backWord: word.backWord,
              proficiencyLevel: 1,
              order:
                numOfWords === 0
                  ? i
                  : realm
                      .objects('Word')
                      .sorted('order', true)
                      .filtered(`folderId="${folderId}"`)[0].order + 1,
              createdAt: new Date(),
            });
          });
          i++;
        } else {
          realm.write(() => {
            realm.create(
              'Word',
              {
                id: word.id,
                frontWord: word.frontWord,
                backWord: word.backWord,
              },
              'modified',
            );
          });
        }
      }
    }
    // console.log(
    //   JSON.stringify(this.realm.objects('Word').sorted('createdAt', true)),
    // );
    // const realm = this.realm;
    this.setState({realm});
    // Navigation.updateProps(this.props.componentId, {
    //   realm: realm,
    // });
  }

  editFolder(object, isEditing) {
    let realm = this.state.realm;
    realm.write(() => {
      if (isEditing) {
        realm.create(
          'Folder',
          {
            id: object.id,
            name: object.folderName,
            frontLangCode: object.frontLangCode,
            backLangCode: object.backLangCode,
          },
          'modified',
        );
      } else {
        realm.create('Folder', {
          id: uuidv4(),
          name: object.folderName,
          frontLangCode: object.frontLangCode,
          backLangCode: object.backLangCode,
          displayStarFrom: 1,
          displayStarTo: 3,
          createdAt: new Date(),
        });
      }
    });
    this.setState({realm});
  }

  deleteFolder(id) {
    let realm = this.state.realm;
    realm.write(() => {
      const target = realm.objects('Folder').filtered(`id = "${id}"`);
      realm.delete(target);
    });
    this.setState({realm});
  }

  openFolderEdit(folder = null) {
    this.setState({
      isEditorVisible: true,
      folder: folder,
    });
  }

  copyFolder() {
    this.setState({
      isCopyVisible: true,
    });
  }

  openFolderEdit2() {
    this.setState({
      isEditor2Visible: true,
    });
  }

  openFolder(folder) {
    this.props.navigation.navigate('List', {
      realm: this.state.realm,
      folder: folder,
      registerWords: this.registerWords,
      showAllCards: this.showAllCards,
      deleteWords: this.deleteWords,
    });
  }

  render() {
    let foldersObj;
    if (this.state.realm) {
      if (this.state.realm.objects('Folder')) {
        foldersObj = this.state.realm
          .objects('Folder')
          .sorted('createdAt', false)
          .map((folder, key) => {
            return (
              <View key={key} style={{flexDirection: "row"}}>
                <TouchableOpacity>
                  <TouchableOpacity
                    style={styles.editIconOpacity}
                    onPress={() => this.openFolderEdit(folder)}>
                    <Icon name="pencil-sharp" style={styles.penIcon} />
                  </TouchableOpacity>
                </TouchableOpacity>
                <TouchableOpacity
                  key={key}
                  style={styles.folderCard}
                  onPress={() => this.openFolder(folder)}>
                  <FontIcon name="folder" style={styles.folderIcon} />
                  <Text style={styles.folderText} numberOfLines={1}>
                    {folder.name}
                  </Text>
                  <Icon name="arrow-forward" style={styles.folderArrowicon} />
                </TouchableOpacity>
              </View>
            );
          });
      }
    }
    return (
      <ScrollView style={styles.container} keyboardShouldPersistTaps="always">
        <View style={styles.buttonArea}>
          <View style={styles.addIconView}>
            <MaterialIcon
              name="folder-multiple"
              style={styles.folderCopyIcon}
              onPress={() => this.copyFolder()}
            />
            <Text style={styles.iconText}>Copy</Text>
          </View>
          <View style={styles.addIconView}>
            <FoundationIcon
              style={styles.folderAddIcon}
              onPress={() => this.openFolderEdit()}
              name="folder-add"
            />
            <Text style={styles.iconText}>Create</Text>
          </View>
        </View>
        <View style={styles.foldersArea}>{foldersObj}</View>
        <Modal
          transparent={true}
          coverScreen={true}
          // presentationStyle="fullScreen"
          style={styles.modal}
          visible={this.state.isEditorVisible}
          animationType={'fade'}
          onBackdropPress={() => this.setState({isEditorVisible: false})}>
          <AddNewFolder
            realm={this.state.realm}
            editFolder={this.editFolder}
            folder={this.state.folder}
            isEditing={this.state.folder ? true : false}
            deleteFolder={this.deleteFolder}
            goBack={() => this.setState({isEditorVisible: false})}
          />
        </Modal>
        <Modal
          transparent={true}
          statusBarTranslucent={true}
          // presentationStyle="fullScreen"
          coverScreen={false}
          style={styles.modal}
          visible={this.state.isEditor2Visible}
          animationType={'fade'}
          onBackdropPress={() => this.setState({isEditor2Visible: false})}>
          <AddNewFolder
            realm={this.state.realm}
            createFolder={this.createFolder}
            goBack={() => this.setState({isEditor2Visible: false})}
          />
        </Modal>
        <Modal
          coverScreen={true}
          style={styles.modal}
          visible={this.state.isCopyVisible}
          animationType={'fade'}
          onBackdropPress={() => this.setState({isCopyVisible: false})}>
          <CopyFolder
            realm={this.state.realm}
            goBack={() => this.setState({isCopyVisible: false})}
          />
        </Modal>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // position: 'absolute',
    // backgroundColor: 'rgba(0,0,0, 0.5)',
    // opacity: 0.5,
    // backgroundColor: '#000000',
  },
  foldersArea: {
    marginTop: 20,
    marginHorizontal: 20,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  folderCard: {
    marginVertical: 10,
    width: width * 0.8,
    height: height * 0.1,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    flexDirection: 'row',
  },
  folderText: {
    flex: 4,
    fontSize: 24,
    right: 0,
    textAlign: 'left',
  },
  addIconView: {
    // flex: 1,
    // alignItems: 'flex-end',
    justifyContent: 'center',
    margin: 20,
  },
  buttonArea: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    flex: 1,
  },
  folderAddIcon: {
    flex: 1,
    fontSize: 60,
    color: '#ffffff',
  },
  folderCopyIcon: {
    fontSize: 55,
    color: '#ffffff',
  },
  folderIcon: {
    flex: 1,
    // fontSize: 40,
    fontSize: height * 0.05,
    marginLeft: 20,
    color: '#4682b4',
  },
  folderIconView: {
    alignItems: 'flex-start',
  },
  penIcon: {
    // fontSize: 40,
    fontSize: height * 0.05,
    color: '#ffffff',
  },
  editIconOpacity: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    flex: 1,
    marginRight: 20,
  },
  folderArrowicon: {
    fontSize: height * 0.03,
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    // resizeMode: 'cover',
    justifyContent: 'center',
    // width: width,
    // height: height,
  },
  modal: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: width,
    height: height,
    margin: 0,
  },
  iconText: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
  },
});

export default HomeContent;
