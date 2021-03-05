import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import 'react-native-get-random-values';

class Stars extends Component {
  constructor(props) {
    super(props);
    this.changeLevel = this.changeLevel.bind(this);
  }

  changeLevel(level) {
    console.log('test');
    this.props.changeLevel(level, this.props.value, this.props.isFrom);
  }

  render() {
    let name = [];
    for (let i = 1; i <= 3; i++) {
      if (this.props.proficiencyLevel >= i) {
        name.push('star');
      } else {
        name.push('star-border');
      }
    }
    if (this.props.isFrom === true) {
      console.log(name);
    }
    return (
      <View style={this.props.styles.starArea}>
        <MaterialIcon
          style={this.props.styles.star}
          name={name[0]}
          onPress={() => this.changeLevel(1)}
        />
        <MaterialIcon
          style={this.props.styles.star}
          name={name[1]}
          onPress={() => this.changeLevel(2)}
        />
        <MaterialIcon
          style={this.props.styles.star}
          name={name[2]}
          onPress={() => this.changeLevel(3)}
        />
      </View>
    );
  }
}

export default Stars;
