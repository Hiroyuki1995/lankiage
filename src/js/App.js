import * as React from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import 'react-native-gesture-handler';
import {NavigationContainer, useRoute} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
const {width, height} = Dimensions.get('window');

import HomeContent from './HomeContent';
import ListContent from './ListContent';
import AddContent from './AddContent';
import AllWordsContent from './AllWordsContent';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#111111',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          cardStyle: {
            opacity: 1,
          },
        }}>
        <Stack.Screen
          name="Home"
          component={HomeContent}
          options={{title: 'Overview'}}
        />
        <Stack.Screen
          name="List"
          component={ListContent}
          options={({route, navigation}) => ({
            title: route.params.folder.name,
            headerRight: () => (
              <Icon
                name="list"
                style={styles.listIcon}
                onPress={() => {
                  navigation.navigate('AllWords', {
                    realm: route.params.realm,
                    folder: route.params.folder,
                    registerWords: route.params.registerWords,
                    deleteWords: route.params.deleteWords,
                  });
                }}
              />
            ),
          })}
        />
        <Stack.Screen
          name="Add"
          component={AddContent}
          options={({route}) => ({title: 'Edit ' + route.params.folder.name})}
        />
        <Stack.Screen
          name="AllWords"
          component={AllWordsContent}
          options={({route}) => ({title: route.params.folder.name})}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    width: width,
    height: height,
  },
  background: {
    backgroundColor: 'rgba(0,0,0, 0.5)',
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000050',
  },
  listIcon: {
    fontSize: 35,
    marginRight: 20,
    color: '#ffffff',
  },
});

// import React, {Component} from 'react';
// //ローカルインポート
// import AppNavigator from './AppNavigator';

// export default class App extends Component {
//   render() {
//     return <AppNavigator />;
//   }
// }
