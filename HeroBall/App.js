import './common/global.js'
import LoadingScreen from './common/Loading'
import Teams from './common/Teams'
import Competitions from './common/Competitions'
import GameModal from './common/GameModal'
import Players from './common/Players'
import Statistics from './common/Statistics'
import {
  createBottomTabNavigator,
  createSwitchNavigator,
  createAppContainer,
  createStackNavigator
  } from 'react-navigation';
import { StatusBar } from 'react-native';
import colorScheme from './common/Colors'


StatusBar.setBarStyle('light-content', true);

const MainNavigator = createBottomTabNavigator(
  {
    Players: { screen: Players },
    Competitions: { screen: Competitions },
    Teams: { screen: Teams },
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
        fontSize: 14,
      },
    },
  }
);

const AppStack = createStackNavigator(
  {
    Main: { screen: MainNavigator },
    GameModal: { screen: GameModal }
  },
  {
    mode: 'modal',
    headerMode: 'none',
    transparentCard: true,
    transitionConfig: ({ scene }) => ({
      screenInterpolator: screenProps => {
        return {}
      }
    })
  }
);

const RootStack = createSwitchNavigator(
  {
    LoadingScreen: LoadingScreen,
    App: AppStack,
  },
  {
    initialRouteName: 'LoadingScreen'
  });

const App = createAppContainer(RootStack);

export default App;
