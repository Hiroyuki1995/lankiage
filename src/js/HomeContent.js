import React, {Component} from 'react';
import {ScrollView, Text, View, Button} from 'react-native';
import {Navigation} from 'react-native-navigation';
const Realm = require('realm');
import {WordSchema} from './Schema.js';

class HomeContent extends Component {
  constructor(props) {
    super(props);
    this.state = {realm: null};
  }

  componentDidMount() {
    // console.log(Realm.defaultPath);
    // Realm.open({
    //   schema: [WordSchema],
    // }).then((realm) => {
    //   realm.write(() => {
    //     // realm.deleteAll();
    //     realm.create('Dog', {name: 'Rex'});
    //     realm.create('Car', {
    //       make: 'Honda',
    //       model: 'Civic',
    //       miles: 1000,
    //     });
    //   });
    //   this.setState({realm});
    // });
  }

  componentWillUnmount() {
    // Close the realm if there is one open.
    const {realm} = this.state;
    if (realm !== null && !realm.isClosed) {
      realm.close();
    }
  }

  render() {
    let info;
    if (this.state.realm) {
      info = this.state.realm.objects('Car').map((car, key) => {
        const carMake = car.make;
        return <Text key={key}>{carMake + '\n'}</Text>;
      });
    }
    return (
      <ScrollView style={styles.container}>
        <Button
        title='Push List Screen'
        color='#710ce3'
        onPress={() => {
          console.log(this.props);
          Navigation.push(this.props.componentId, {
            component: {
              name: 'List',
              options: {
                topBar: {
                  title: {
                    text: 'List'
                  }
                }
              }
            }
          });
        }} />
        <Text style={styles.welcome}>{info}</Text>
      </ScrollView>
    );
  }
}

const styles = {
  container: {
    flex: 1,
  },
  welcome: {
    flex: 1,
  },
};

export default HomeContent;
