import React, {Component} from 'react';
import {TextInput, View, StyleSheet, Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const {width, height} = Dimensions.get('window');
import 'react-native-get-random-values';

class EditOneCard extends Component {
  constructor(props) {
    super(props);
    this.ref = null;
  }

  componentDidUpdate() {
    if (this.props.currentFocusKey === this.props.id) {
      if (this.props.currentFocusSide) {
        this.front.focus();
      } else {
        this.back.focus();
      }
    }
  }

  render() {
    let formStyle = {};
    const word = this.props.word;
    if (word.isRegisterd) {
      formStyle = [styles.inputForm, styles.inputRegisterdForm];
    } else {
      formStyle = styles.inputForm;
    }
    return (
      <View style={styles.oneCardInputArea}>
        <View style={styles.cardRingView}>
          <Icon name="ellipse-outline" style={styles.cardRing} />
        </View>
        <View style={styles.oneSideInputArea}>
          <TextInput
            name="frontWord"
            numberOfLines={10}
            ref={(input) => (this.front = input)}
            multiline={true}
            blurOnSubmit={true}
            value={word.frontWord}
            returnKeyType="next"
            style={formStyle}
            placeholder="front word"
            // inputAccessoryViewID={this.props.inputAccessoryViewID}
            onChangeText={(value) => {
              this.props.onChange('frontWord', value, this.props.id);
            }}
            onSubmitEditing={this.props.onSubmitEditing}
            onFocus={() => this.props.onFormFocus(this.props.id, true)}
          />
        </View>
        {/* <View style={styles.cardRingView}>
          <Icon name="ellipse-outline" style={styles.cardRing} />
        </View> */}
        <View style={styles.oneSideInputArea}>
          <View>
            <TextInput
              name="backWord"
              numberOfLines={10}
              ref={(input) => (this.back = input)}
              multiline={true}
              blurOnSubmit={true}
              value={word.backWord}
              returnKeyType="next"
              style={formStyle}
              placeholder="back word"
              // inputAccessoryViewID={this.props.inputAccessoryViewID}
              onChangeText={(value) => {
                this.props.onChange('backWord', value, this.props.id);
              }}
              onSubmitEditing={this.props.onSubmitEditing}
              onFocus={() => this.props.onFormFocus(this.props.id, false)}
            />
          </View>
        </View>
        {/* <View style={styles.cardRingView}>
          <Icon name="ellipse-outline" style={styles.cardRing} />
        </View> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  inputArea: {
    flexDirection: 'column',
    marginTop: height * 0.06,
    marginLeft: width * 0.02,
    marginRight: width * 0.02,
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  oneCardInputArea: {
    flexDirection: 'row',
    flex: 1,
    marginBottom: 10,
    marginTop: 10,
  },
  oneSideInputArea: {
    width: '50%',
    paddingLeft: 10,
    paddingRight: 10,
    flex: 1,
    // zIndex: 0,
  },
  inputForm: {
    // flex: 1,
    maxHeight: 100,
    minHeight: 40,
    fontSize: 24,
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
    paddingHorizontal: 10,
    // position: 'absolute',
    width: '100%',
    // height: 100,
  },
  inputRegisterdForm: {
    backgroundColor: '#87cefa',
  },
  languageSelect: {
    flex: 1,
    alignItems: 'flex-end',
    width: '40%',
  },
  button: {
    padding: 10,
    margin: 10,
  },
  submitButton: {
    backgroundColor: '#2c8ef4',
    color: 'white',
  },
  resetButton: {
    borderColor: '#2c8ef4',
    borderWidth: 1,
    backgroundColor: 'white',
    color: '#2c8ef4',
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
    color: 'white',
  },
  resetButtonText: {
    color: '#2c8ef4',
  },
  messageView: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flex: 1,
    // margin: 10,
  },
  messageText: {
    color: 'red',
    fontSize: 20,
    // padding: 10,
  },
  translationButton: {
    width: 30,
    height: 30,
  },
  buttonArea: {
    flexDirection: 'column',
  },
  languageSelectArea: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardRing: {
    fontSize: 40,
    right: 20,
    color: '#6e6efa',
    // zIndex: 100,
    transform: [{rotateX: '45deg'}],
  },
  cardRingView: {
    position: 'absolute',
    left: '50%',
    zIndex: 1,
    // transform: [{rotateX: '45deg'}],
  },
});

export default EditOneCard;
