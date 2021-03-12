import * as React from 'react';
import {View, ImageBackground, StyleSheet, Animated} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import HomeContent from './HomeContent';
import ListContent from './ListContent';
import AddContent from './AddContent';
import AllWordsContent from './AllWordsContent';

const Stack = createStackNavigator();

function App() {
  return (
    <ImageBackground
      style={styles.backgroundImage}
      source={require('../png/milky-way.jpg')}>
      <View style={styles.viewInImage}>
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
                // opacity: 1,
                backgroundColor: 'transparent',
              },
            }}>
            <Stack.Screen
              name="Home"
              component={HomeContent}
              options={{
                title: 'Home',
                cardStyleInterpolator: forSlide,
              }}
            />
            <Stack.Screen
              name="List"
              component={ListContent}
              options={({route, navigation}) => ({
                title: route.params.folder.name,
                cardStyleInterpolator: forSlide,
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
              options={({route}) => ({
                title: 'Edit ' + route.params.folder.name,
                cardStyleInterpolator: forSlide,
              })}
            />
            <Stack.Screen
              name="AllWords"
              component={AllWordsContent}
              options={({route}) => ({
                title: route.params.folder.name,
                cardStyleInterpolator: forSlide,
              })}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </ImageBackground>
  );
}

export default App;

const forSlide = ({current, next, inverted, layouts: {screen}}) => {
  const progress = Animated.add(
    current.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    }),
    next
      ? next.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
          extrapolate: 'clamp',
        })
      : 0,
  );

  return {
    cardStyle: {
      transform: [
        {
          translateX: Animated.multiply(
            progress.interpolate({
              inputRange: [0, 1, 2],
              outputRange: [
                screen.width,
                0,
                screen.width * -1, // change the coefficient here
              ],
              extrapolate: 'clamp',
            }),
            inverted,
          ),
        },
      ],
    },
  };
};

const styles = StyleSheet.create({
  listIcon: {
    fontSize: 35,
    marginRight: 20,
    color: '#ffffff',
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
  },
  viewInImage: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
