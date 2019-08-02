import './common/global.js'
import LoadingScreen from './common/Loading'
import TeamsView from './common/TeamsView'
import CompetitionsView from './common/CompetitionsView'
import GameBoxScore from './common/GameBoxScore'
import GamesPopOver from './common/GamesPopOver'
import PlayerProfile from './common/PlayerProfile'
import GamesView from './common/GamesView'
import StatisticsView from './common/StatisticsView'
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
    Games: {screen: GamesView },
    Competitions: { screen: CompetitionsView },
    Teams: { screen: TeamsView },
    Statistics: { screen: StatisticsView }
  },{
    initialRouteName: 'Games',
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
    GameBoxScore: {screen: GameBoxScore},
    GamesPopOver: {screen: GamesPopOver},
    PlayerProfile: {screen: PlayerProfile}
  },
  {
    headerMode: 'none',
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
