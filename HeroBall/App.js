import './common/global.js'
import LoadingScreen from './common/Loading'
import LandingScreen from './common/Teams'
import Competitions from './common/Competitions'
import Players from './common/Players'
import Statistics from './common/Statistics'
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
    Players: { screen: Players },
    Competitions: { screen: Competitions },
    Teams: { screen: LandingScreen },
    Statistics: { screen: Statistics },
  },{
    initialRouteName: 'Competitions',
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
