import React, {Component} from 'react';
import {TextInput, Text, View, StyleSheet, Dimensions} from 'react-native';
import {Button} from 'native-base';
import LanguageSelect from './LanguageSelect';
const {width, height} = Dimensions.get('window');
import Modal from 'react-native-modal';

class AddNewFolder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.folder ? this.props.folder.id : '',
      folderName: this.props.folder ? this.props.folder.name : '',
      frontLangCode: this.props.folder ? this.props.folder.frontLangCode : '',
      backLangCode: this.props.folder ? this.props.folder.backLangCode : '',
      realm: null,
      message: null,
      isConfirmarionVisible: false,
      focusForm: '',
    };
    this.onChange = this.onChange.bind(this);
    this.editFolder = this.editFolder.bind(this);
    this.deleteFolder = this.deleteFolder.bind(this);
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
      this.setState({message: 'Please fill out all the fields'});
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
          <View style={styles.labelView}>
            <Text style={styles.labelText}>Folder Name</Text>
            <TextInput
              ref={(input) => (this.text = input)}
              autoFocus={this.props.isEditing ? false : true}
              label="folderName"
              style={styles.inputForm}
              onChangeText={(_v) => {
                this.onChange(_v, 'folderName');
              }}
              value={folderName}
              returnKeyType="next"
              onSubmitEditing={() => {
                this.setState({focusForm: 'frontLangCode'});
              }}
            />
          </View>
        </View>
        <View style={styles.OneLanguageArea}>
          <View style={styles.labelView}>
            <Text style={styles.labelText}> Front Language</Text>
            <LanguageSelect
              focusForm={this.state.focusForm}
              label="frontLangCode"
              style={styles.languageSelect}
              value={frontLangCode}
              onValueChange={(v) => this.onChange(v, 'frontLangCode')}
              onDonePress={() => this.setState({focusForm: 'backLangCode'})}
              onDownArrow={() => this.setState({focusForm: 'backLangCode'})}
              onUpArrow={() => {
                this.setState({focusForm: 'folderName'});
                this.text.focus();
              }}
            />
          </View>
        </View>
        <View style={styles.OneLanguageArea}>
          <View style={styles.labelView}>
            <Text style={styles.labelText}>Back Language</Text>
            <LanguageSelect
              focusForm={this.state.focusForm}
              label="backLangCode"
              style={styles.languageSelect}
              value={backLangCode}
              onValueChange={(v) => this.onChange(v, 'backLangCode')}
              onUpArrow={() => this.setState({focusForm: 'frontLangCode'})}
              onDonePress={() => this.editFolder()}
              onDownArrow={() => this.editFolder()}
            />
          </View>
          {/* <View style={styles.inputView}>
          </View> */}
        </View>
        <View style={styles.buttonArea}>
          {(() => {
            if (this.props.isEditing) {
              return (
                <Button
                  block
                  danger
                  style={styles.dissmissButton}
                  onPress={() => {
                    // this.deleteFolder();
                    this.setState({isConfirmarionVisible: true});
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
        <Modal
          style={styles.confirmationModal}
          visible={this.state.isConfirmarionVisible}
          animationType={'fade'}
          backdropOpacity={0.5}
          hasBackdrop={true}
          onBackdropPress={() => this.setState({isConfirmarionVisible: false})}>
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
                  this.deleteFolder();
                }}>
                <Text style={styles.buttonText}>Delete</Text>
              </Button>
              <Button
                block
                light
                style={styles.dissmissButton}
                onPress={() => {
                  this.setState({isConfirmarionVisible: false});
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    width: 330,
    padding: 16,
    borderRadius: 10,
    height: 350,
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
  focusLabelText: {
    fontWeight: 'bold',
  },
  confirmationModal: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    margin: 0,
    height: height,
    width: width,
  },
  confirmationView: {
    backgroundColor: '#ffffff',
    width: 300,
    // height: 200,
    margin: 0,
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
});

export default AddNewFolder;
