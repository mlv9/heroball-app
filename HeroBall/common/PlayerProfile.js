import React from 'react';
import { TouchableOpacity, StyleSheet, Image, ScrollView, ActivityIndicator, Text, View } from 'react-native';
import { ListItem } from 'react-native-elements';
import colorScheme from './Colors';
import ViewHeader from './ViewHeader';
import Progress from 'react-native-progress/Circle';
import GamesList from './GamesList'
import PlayerTeamsList from './PlayerTeamsList'
import PlayersStatLine from './PlayersStatLine'
import PlayerAveragesStatLines from './PlayerAveragesStatLines'
import { withNavigation } from 'react-navigation';

class PlayerProfile extends React.Component {

  /* this takes a playerId navigation prop */

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

    return doRPC('v1/get/player/info',
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
            <Text style={styles.heading}>BIO</Text>
            <View style={{backgroundColor: 'white', padding: 5}}>
              <Text style={{fontSize: 26}}>{this.state.playerInfo.Profile.Name}</Text>
              <Text style={{fontSize: 20}}>{'A ' + this.state.playerInfo.Profile.Position + ' of ' + this.state.playerInfo.AggregateStats.Stats.GameCount + ' recorded games'}</Text>
           </View>
          <PlayerAveragesStatLines
            player={this.state.playerInfo.Player}
            teams={this.state.playerInfo.Teams}
            career={this.state.playerInfo.AggregateStats}
            title={'ALL STATS'}
            />
          <PlayersStatLine
            title={'RECENT GAME STATS'}
            rowHeader={'games'}
            players={this.state.playerInfo.RecentStats}
            games={this.state.playerInfo.RecentGames.Games}
            />
          {this.state.playerInfo.AggregateStats != undefined && this.state.playerInfo.AggregateStats.Stats.GameCount > this.state.playerInfo.RecentGames.Games.length && 
          <TouchableOpacity onPress={() => {
            this.props.navigation.navigate("PlayerGameStatResults", {playerId: this.state.playerInfo.PlayerId, againstMd: {}})

          }}>
            <ListItem
              chevron
              badge={{
                value: this.state.playerInfo.AggregateStats.Stats.GameCount,
                badgeStyle: {
                  backgroundColor: 'lightsteelblue',
                  paddingRight: 3,
                  paddingLeft: 3,
                }
              }}
              titleStyle={{
                fontSize: 14,
              }}
              containerStyle={{
                borderWidth: 1,
                paddingTop: 5,
                paddingBottom: 5,
                paddingLeft: 3,
              }}
              title='View All Game Stats'
            />
            </TouchableOpacity>}
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

const styles = StyleSheet.create({
  heading: {
    textAlignVertical: "center",
    textAlign: "center",
    backgroundColor:colorScheme.secondary,
    color: "white"
  }
});