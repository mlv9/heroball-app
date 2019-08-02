import React from 'react';
import { Image, ScrollView, ActivityIndicator, Text, View } from 'react-native';
import colorScheme from './Colors';
import ViewHeader from './ViewHeader';
import Progress from 'react-native-progress/Circle';
import GamesList from './GamesList'
import PlayerTeamsList from './PlayerTeamsList'
import PlayersStatLine from './PlayersStatLine'
import PlayerAverageStatLine from './PlayerAverageStatLine'
import { withNavigation } from 'react-navigation';

class PlayerProfile extends React.Component {

  subscription = null

  constructor(props) {
    super(props)
    this.state = {
    }
  }

  componentDidMount() {
    subscription = this.props.navigation.addListener('willFocus', this.loadPlayer);
  }

  componentWillUnmount() {
    subscription.remove()
  }

  loadPlayer = () => {

    playerIdToLoad = this.props.navigation.getParam("playerId", 0)

    console.log("loading player " + playerIdToLoad)

    /* for development, lets just show something */
    if (playerIdToLoad == 0) {
      playerIdToLoad = 1
    }

    if (this.state.playerInfo !== undefined && playerIdToLoad == this.state.playerInfo.PlayerId) {
      return;
    }

    /* else set blank */
    this.setState({
      playerInfo: undefined
    })

    return doRPC('https://api.heroball.app/v1/get/player/info',
        {
          PlayerId: playerIdToLoad
        })
      .then((response) => response.json())
      .then((response) => {
        this.setState({
          playerInfo: response,
        })
      })
      .catch((error) => {
        console.log(error)
        Alert.alert("Error loading player.");
      });
  }

  render() {
    return (
      <View style={{
          backgroundColor: colorScheme.background,
          flex:1,
        }}>
        <ViewHeader name='Player Profile' showBack={true} />
        {this.state.playerInfo === undefined && 
          <ActivityIndicator style={{marginTop: 50}}/>
        }
        { this.state.playerInfo !== undefined && 
         <ScrollView>
          <Image style={{height:200}}
            source={{uri: `http://www-static2.spulsecdn.net/pics/00/01/54/07/1540783_1_M.jpg`}}
            indicator={Progress.Circle}
            />
          <Text>{this.state.playerInfo.Profile.Name}</Text>
          <Text>{this.state.playerInfo.Profile.Position}</Text>
          <PlayerAverageStatLine
            player={this.state.playerInfo}
            title={'ALL STATS'}
            />
          <PlayersStatLine
            title={'RECENT STATS'}
            rowHeader={'games'}
            players={this.state.playerInfo.RecentStats}
            games={this.state.playerInfo.RecentGames}
            />
          <GamesList 
            gamesCursor={this.state.playerInfo.RecentGames}
            key={this.state.playerInfo.PlayerId+'_GamesList'} 
            showTotal={true}/>
          <PlayerTeamsList
            teams={this.state.playerInfo.Teams}
            key={this.state.playerInfo.PlayerId+'_PlayerTeamsList'}
            count={3}
            />
        </ScrollView>
        }
      </View>
    );
  }
}

export default withNavigation(PlayerProfile);