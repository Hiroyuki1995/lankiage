import React, {Component} from 'react';
import {
  TouchableOpacity,
  ScrollView,
  Text,
  View,
  Button,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {Navigation} from 'react-native-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import FoundationIcon from 'react-native-vector-icons/Foundation';
import FontIcon from 'react-native-vector-icons/FontAwesome';
const Realm = require('realm');
import {WordSchema} from './Schema.js';
const {width, height} = Dimensions.get('window');
import {FolderSchema} from './Schema.js';
import {v4 as uuidv4} from 'uuid';

class HomeContent extends Component {
  constructor(props) {
    super(props);
    this.state = {realm: null};
    this.realm = null;
    this.openFolderEdit = this.openFolderEdit.bind(this);
    this.openFolder = this.openFolder.bind(this);
    this.editFolder = this.editFolder.bind(this);
    this.deleteFolder = this.deleteFolder.bind(this);
    this.registerWords = this.registerWords.bind(this);
  }

  componentDidMount() {
    console.log('componentDidMount at HomeContent');
    try {
      this.realm = new Realm({
        schema: [FolderSchema, WordSchema],
        schemaVersion: 2,
      });
      const realm = this.realm;
      this.setState({realm});
      Realm.open({
        schema: [FolderSchema, WordSchema],
        deleteRealmIfMigrationNeeded: true,
      }).then((realm) => {
        this.setState({realm});
      });
    } catch (error) {
      console.log(error);
    }
  }

  componentDidUpdate() {
    console.log('componentDidUpdate at HomeContent');
    console.log(JSON.stringify(this.state.realm.objects('Word')));
  }

  componentWillUnmount() {
    // Close the realm if there is one open.
    const {realm} = this.state;
    if (realm !== null && !realm.isClosed) {
      console.log('realm will be closed at componentWillUnmount');
      realm.close();
    }
  }

  registerWords(info, folderId) {
    console.log('HomeContent' + JSON.stringify(info));
    if (!this.realm) {
      this.realm = new Realm({schema: [FolderSchema, WordSchema]});
    }
    for (let word of info.words) {
      if (word.frontWord && info.frontLang && word.backWord && info.backLang) {
        this.realm.write(() => {
          this.realm.create('Word', {
            id: uuidv4(),
            frontWord: word.frontWord,
            frontLang: info.frontLang,
            backWord: word.backWord,
            backLang: info.backLang,
            createdAt: new Date(),
            folderId: folderId,
          });
        });
      }
    }
    const realm = this.realm;
    this.setState({realm});
    Navigation.updateProps(this.props.componentId, {
      realm: realm,
    });
  }

  editFolder(object, isEditing) {
    if (!this.realm) {
      this.realm = new Realm({schema: [FolderSchema, WordSchema]});
    }
    this.realm.write(() => {
      if (isEditing) {
        this.realm.create(
          'Folder',
          {
            id: object.id,
            name: object.folderName,
            defaultFrontLang: object.frontLang,
            defaultBackLang: object.backLang,
            createdAt: new Date(),
          },
          'modified',
        );
      } else {
        this.realm.create('Folder', {
          id: uuidv4(),
          name: object.folderName,
          defaultFrontLang: object.frontLang,
          defaultBackLang: object.backLang,
          createdAt: new Date(),
        });
      }
    });
    const realm = this.realm;
    this.setState({realm});
  }

  deleteFolder(id) {
    if (!this.realm) {
      this.realm = new Realm({schema: [FolderSchema, WordSchema]});
    }
    this.realm.write(() => {
      const target = this.realm.objects('Folder').filtered(`id = "${id}"`);
      this.realm.delete(target);
      const realm = this.realm;
      this.setState({realm});
    });
  }

  openFolderEdit(folder = null) {
    Navigation.showOverlay({
      component: {
        name: 'NewFolder',
        passProps: {
          realm: this.state.realm,
          editFolder: this.editFolder,
          folder: folder,
          isEditing: folder ? true : false,
          deleteFolder: this.deleteFolder,
        },
        options: {
          layout: {
            componentBackgroundColor: 'transparent',
          },
          overlay: {
            interceptTouchOutside: true,
          },
        },
      },
    });
  }

  openFolder(folder) {
    console.log(folder);
    Navigation.push(this.props.componentId, {
      component: {
        id: 'List',
        name: 'List',
        passProps: {
          realm: this.state.realm,
          folder: folder,
          registerWords: this.registerWords,
        },
        options: {
          topBar: {
            title: {
              text: folder.name,
            },
          },
        },
      },
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
                  <Text style={styles.folderText}>{folder.name}</Text>
                  <Icon name="arrow-forward" style={styles.folderArrowicon} />
                </TouchableOpacity>
              </View>
            );
          });
      }
    }
    return (
      <ScrollView style={styles.container}>
        <View style={styles.addIconView}>
          <FoundationIcon
            style={styles.folderAddIcon}
            onPress={() => this.openFolderEdit()}
            name="folder-add"
          />
        </View>
        <View style={styles.foldersArea}>{foldersObj}</View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    margin: 20,
  },
  folderAddIcon: {
    flex: 1,
    fontSize: 60,
    color: '#ffffff',
  },
  folderIcon: {
    flex: 1,
    fontSize: 40,
    marginLeft: 20,
    color: '#4682b4',
  },
  folderIconView: {
    alignItems: 'flex-start',
  },
  penIcon: {
    fontSize: 40,
    color: '#ffffff',
  },
  editIconOpacity: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    flex: 1,
    marginRight: 20,
  },
  folderArrowicon: {
    fontSize: 30,
    flex: 1,
  },
});

export default HomeContent;
