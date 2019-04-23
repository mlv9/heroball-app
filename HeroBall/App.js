import './common/global.js'
import LoadingScreen from './common/Loading'
import LandingScreen from './common/Landing'
import {
  createBottomTabNavigator,
  createSwitchNavigator,
  createAppContainer
  } from 'react-navigation';
import { StatusBar } from 'react-native';

import colorScheme from './common/Colors'

StatusBar.setBarStyle('light-content', true);

const MainNavigator = createBottomTabNavigator(
  {
    Landing: { screen: LandingScreen },
  },{
    tabBarOptions: {
      style: {
        backgroundColor: colorScheme.primary,
        height:100,
        paddingBottom: 30
      },
      activeTintColor: colorScheme.buttons,
      labelStyle: {
        fontSize: 12,
      },
    },
  }
);

const RootStack = createSwitchNavigator(
  {
    LoadingScreen: LoadingScreen,
    App: MainNavigator,
  },
  {
    initialRouteName: 'LoadingScreen'
  });

const App = createAppContainer(RootStack);

export default App;
