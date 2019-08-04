import React from 'react';
import { ActivityIndicator, View, ScrollView } from 'react-native';
import ViewHeader from './ViewHeader'
import GameResult from './GameResult'
import PlayersStatLine from './PlayersStatLine'
import { withNavigation } from 'react-navigation';

class GameBoxScore extends React.Component {
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
      <View  style={{flex:1}}>
        <ViewHeader name='Box Score' showBack={true}/>
          {this.state.gameInfo === undefined && (
            <ActivityIndicator style={{marginTop: 50}}/>
          )}
          {this.state.gameInfo !== undefined && 
            <View style={{flex:1}}>
              <View style={{height:104}}>
                <GameResult game={this.state.gameInfo.Game}/>
              </View>
              <ScrollView>
                <PlayersStatLine 
                  players={this.state.gameInfo.PlayerStats.filter(player => player.Team.TeamId == this.state.gameInfo.Game.HomeTeam.TeamId)} 
                  title={this.state.gameInfo.Game.HomeTeam.Name}
                  rowHeader={'names'}
                  showTotals={true}
                  />
                <PlayersStatLine 
                  players={this.state.gameInfo.PlayerStats.filter(player => player.Team.TeamId == this.state.gameInfo.Game.AwayTeam.TeamId)} 
                  title={this.state.gameInfo.Game.AwayTeam.Name}
                  rowHeader={'names'}
                  showTotals={true}
                  />
              </ScrollView>
            </View>
          }
      </View>
    );
  }
}

export default withNavigation(GameBoxScore);
