import {AppRegistry} from 'react-native';
import App from './src/js/App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);

// import React from 'react';
// import {ImageBackground, StyleSheet, View, Dimensions} from 'react-native';
// import {Navigation} from 'react-native-navigation';
// import HomeContent from './src/js/HomeContent';
// import ListContent from './src/js/ListContent';
// import AddContent from './src/js/AddContent';
// import AddNewFolder from './src/js/AddNewFolder';
// import backGroundImage from './src/png/milky-way.jpg';
// const {width, height} = Dimensions.get('window');

// const HomeScreen = (props) => {
//   return (
//     <View style={styles.root}>
//       <ImageBackground style={styles.backgroundImage} source={backGroundImage}>
//         <View style={styles.background}>
//           <HomeContent {...props} />
//         </View>
//       </ImageBackground>
//     </View>
//   );
// };

// const AddNewFolderOverlay = (props) => {
//   return (
//     <View style={styles.overlay}>
//       <AddNewFolder {...props} />
//     </View>
//   );
// };

// const ListScreen = (props) => {
//   return (
//     <View style={styles.root}>
//       <ImageBackground style={styles.backgroundImage} source={backGroundImage}>
//         <ListContent {...props} />
//       </ImageBackground>
//     </View>
//   );
// };

// const AddScreen = (props) => {
//   return (
//     <View style={styles.root}>
//       <ImageBackground style={styles.backgroundImage} source={backGroundImage}>
//         <AddContent {...props} />
//       </ImageBackground>
//     </View>
//   );
// };

// Navigation.registerComponent('Home', () => HomeScreen);
// Navigation.registerComponent('List', () => ListScreen);
// Navigation.registerComponent('Add', () => AddScreen);
// Navigation.registerComponent('NewFolder', () => AddNewFolderOverlay);

// Navigation.events().registerAppLaunchedListener(async () => {
//   Navigation.setRoot({
//     root: {
//       stack: {
//         children: [
//           {
//             component: {
//               name: 'Home',
//               options: {
//                 topBar: {
//                   title: {
//                     text: 'Home',
//                   },
//                 },
//               },
//             },
//           },
//         ],
//       },
//     },
//   });
// });

// const styles = StyleSheet.create({
//   root: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#000000',
//   },
//   backgroundImage: {
//     flex: 1,
//     resizeMode: 'cover',
//     justifyContent: 'center',
//     width: width,
//     height: height,
//   },
//   background: {
//     backgroundColor: 'rgba(0,0,0, 0.5)',
//     flex: 1,
//   },
//   overlay: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#00000050',
//   },
// });

// Navigation.setDefaultOptions({
//   statusBar: {
//     backgroundColor: '#000000',
//   },
//   topBar: {
//     title: {
//       color: 'white',
//     },
//     backButton: {
//       color: 'white',
//     },
//     background: {
//       color: '#111111',
//     },
//   },
// });
