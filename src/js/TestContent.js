import React from 'react';
import {View, Button, Text} from 'react-native';
import {FormPart} from './FormPart';

export default class TestContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: '',
    };
    // this.onChange = this.onChange.bind(this);
  }

  onChange = (name) => (value) => {
    console.log(`name ${name} value ${value}`);
    this.setState({
      [name]: value,
    });
  };

  render() {
    let onSave = () => {
      console.log(this.state.title, this.state.description);
    };

    return (
      <View>
        <FormPart
          title={this.state.title}
          description={this.state.description}
          name="testContentName"
          onChange={this.onChange}
        />
        <Button title="send" type="button" onClick={onSave}>
          <Text>Save</Text>
        </Button>
      </View>
    );
  }
}
