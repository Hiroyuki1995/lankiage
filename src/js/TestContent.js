import React, {Component} from 'react';
import {View} from 'react-native';
import {Text} from 'native-base';

class TestContent extends Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {}

  render() {
    return (
      <View>
        <Text>TEST</Text>
      </View>
    );
  }
}

export default TestContent;
