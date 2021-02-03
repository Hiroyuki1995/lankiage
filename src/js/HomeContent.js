import React, {Component} from 'react';
import {Text, View} from 'react-native';
const Realm = require('realm');
const CarSchema = {
  name: 'Car',
  properties: {
    make: 'string',
    model: 'string',
    miles: {type: 'int', default: 0},
  },
};
const DogSchema = {
  name: 'Dog',
  properties: {name: 'string'},
};

class HomeContent extends Component {
  constructor(props) {
    super(props);
    this.state = {realm: null};
  }

  componentDidMount() {
    console.log(Realm.defaultPath);
    Realm.open({
      schema: [CarSchema, DogSchema],
    }).then((realm) => {
      realm.write(() => {
        // realm.deleteAll();
        realm.create('Dog', {name: 'Rex'});
        realm.create('Car', {
          make: 'Honda',
          model: 'Civic',
          miles: 1000,
        });
      });
      this.setState({realm});
    });
  }

  componentWillUnmount() {
    // Close the realm if there is one open.
    const {realm} = this.state;
    if (realm !== null && !realm.isClosed) {
      realm.close();
    }
  }

  render() {
    // const info = this.state.realm
    //   ? JSON.stringify(this.state.realm.objects('Car')) +
    //     JSON.stringify(this.state.realm.objects('Dog'))
    //   : 'Loading...';
    let info;
    if (this.state.realm) {
      info = this.state.realm.objects('Car').map((car, key) => {
        const carMake = car.make;
        return <Text key={key}>{carMake + '\n'}</Text>;
      });
    }
    // console.log(this.state.realm.objects('Dog'));
    // console.log(JSON.stringify(this.state.realm.objects('Dog')));
    // this.state.realm.objects('Dog').map((dog) => {
    //   console.log(JSON.stringify(dog.name));
    // });
    // const info = this.state.realm
    //   ? 'Number of dogs in this Realm: ' +
    //     this.state.realm.objects('Dog').length
    //   : 'Loading...';
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>{info}</Text>
      </View>
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
