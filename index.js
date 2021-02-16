import React from 'react';
import {Navigation} from 'react-native-navigation';
import HomeContent from './src/js/HomeContent';
import ListContent from './src/js/ListContent';
import AddContent from './src/js/AddContent';

const HomeScreen = (props) => {
  return (
    <HomeContent {...props}/>
  );
};

const ListScreen = (props) => {
  return (
    <ListContent {...props}/>
  );
};

const AddScreen = (props) => {
  return (
    <AddContent />
  );
};

Navigation.registerComponent('Home', () => HomeScreen);
Navigation.registerComponent('List', () => ListScreen);
Navigation.registerComponent('Add', () => AddScreen);

Navigation.events().registerAppLaunchedListener(async () => {
  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: 'Home'
            }
          }
        ]
      }
    }
  });
});
