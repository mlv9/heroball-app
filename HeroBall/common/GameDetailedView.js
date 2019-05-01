import React from 'react';
import { ActivityIndicator, Text, View, StyleSheet, ScrollView } from 'react-native';
import ViewHeader from './ViewHeader'
import GameResult from './GameResult'
import PlayersStatLine from './PlayersStatLine'
import { withNavigation } from 'react-navigation';
import colorScheme from './Colors'

class GameDetailedView extends React.Component {
    /* 
        options:
        gameId = int32 = gameId of game to show
    */

   subscription = null

   constructor(props) {
     super(props)
     this.state = {
     }
   }
 
   componentDidMount() {
     subscription = this.props.navigation.addListener('willFocus', this.loadGame);
   }
 
   componentWillUnmount() {
     subscription.remove()
   }

  loadGame = () => {

    gameId = this.props.navigation.getParam("gameId", 0)

    if (this.state.gameInfo !== undefined && gameId == this.state.gameInfo.Game.GameId) {
      console.log("not loading game as already loaded")
      return;
    }

    this.state.gameInfo = undefined

    return doRPC('https://api.heroball.app/v1/get/game/info',
        {
          GameId: gameId,
        })
      .then((response) => response.json())
      .then((response) => {
        console.log('loaded game successfully')
        this.setState({
          gameInfo: response,
        })
      })
      .catch((error) => {
        console.log(error)
        Alert.alert("Error loading game.");
      });
  }

  render() {
    return (
      <View>
        <ViewHeader name='Game Stats' showBack={true}/>
          {this.state.gameInfo === undefined && (
            <ActivityIndicator style={{marginTop: 50}}/>
          )}
          {this.state.gameInfo !== undefined && 
            <View>
              <GameResult game={this.state.gameInfo.Game} />
              <ScrollView>
                <PlayersStatLine 
                  players={this.state.gameInfo.PlayerStats.filter(player => player.Team.TeamId == this.state.gameInfo.Game.HomeTeam.TeamId)} 
                  title={this.state.gameInfo.Game.HomeTeam.Name}
                  rowHeader={'names'}
                  />
                <PlayersStatLine 
                  players={this.state.gameInfo.PlayerStats.filter(player => player.Team.TeamId == this.state.gameInfo.Game.AwayTeam.TeamId)} 
                  title={this.state.gameInfo.Game.AwayTeam.Name}
                  rowHeader={'names'}
                  />
              </ScrollView>
            </View>
          }
      </View>
    );
  }
}

export default withNavigation(GameDetailedView);
