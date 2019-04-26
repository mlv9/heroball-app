import React from 'react';
import { Image, StyleSheet, ScrollView, FlatList, Text, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faUsers, faUser  } from '@fortawesome/free-solid-svg-icons'
import colorScheme from './Colors';
import ViewHeader from './ViewHeader';
import { ListItem } from 'react-native-elements';
import Progress from 'react-native-progress/Circle';


class Teams extends React.Component {

  subscription = null

  constructor(props) {
    super(props)

    this.state = {}
  }

  componentDidMount() {
    subscription = this.props.navigation.addListener('willFocus', this.loadGame);
  }

  componentWillUnmount() {
    subscription.remove()
  }

  loadGame = () => {
    return doRPC('https://api.heroball.app/v1/get/team/info',
        {
          TeamId: parseInt("1"),
        })
      .then((response) => response.json())
      .then((response) => {
        console.log(response)
        this.setState({
          teamInfo: response,
        })
      })
      .catch((error) => {
        console.log(error)
        Alert.alert("Error loading team.");
      });
  }

  gameTitle = (game) => {

    if (game.Result.HomeTeamPoints > game.Result.AwayTeamPoints) {
      /* hometeam wins */
      return game.HomeTeam.Name + ' (' + game.Result.HomeTeamPoints + ') defeat (' + game.Result.AwayTeamPoints + ') ' + game.AwayTeam.Name
    } else if (game.Result.HomeTeamPoints < game.Result.AwayTeamPoints) {
      /* away team wins */
      return game.HomeTeam.Name + ' (' + game.Result.HomeTeamPoints + ') defeated by (' + game.Result.AwayTeamPoints + ') ' + game.AwayTeam.Name
    }

    /* drawn */
    return game.HomeTeam.Name + ' (' + game.Result.HomeTeamPoints + ') drawn (' + game.Result.AwayTeamPoints + ') ' + game.AwayTeam.Name
  }

  gameSubtitle = (game) => {
    return new Date(game.GameTime).toLocaleDateString() + ' @ ' + game.Location.Name
  }

  render() {
    return (
      <View style={{
          backgroundColor: colorScheme.background,
          flex:1,
        }}>
        <ViewHeader name='Teams' />
        {this.state.teamInfo !== undefined && 
        <ScrollView>
          <Image style={{height:200}}
            source={{uri: `http://www-static2.spulsecdn.net/pics/00/01/54/07/1540783_1_M.jpg`}}
            indicator={Progress.Circle}
            />
          <Text style={styles.heading}>GAMES</Text>
          <FlatList
            data={this.state.teamInfo.RecentGames}
            keyExtractor = {(item, index) => item.GameId.toString()} 
            renderItem={({index, item }) =>
            (
              <ListItem
                containerStyle={{
                  borderWidth: 1,
                }}
                contentContainerStyle={{
                  alignItems: 'center'
                }}
                leftIcon={<FontAwesomeIcon icon={ faUsers } size={30}/>}
                rightIcon={<FontAwesomeIcon icon={ faUsers } size={30}/>}
                title={this.gameTitle(item)}
                subtitle={this.gameSubtitle(item)}
                subtitleStyle={{
                  color: 'grey'
                }}
              />
          )}
          />
          { this.state.teamInfo.GameIds.length > this.state.teamInfo.RecentGames.length &&
            <ListItem
              chevron
              badge={{
                value: this.state.teamInfo.GameIds.length || 0,
                badgeStyle: {
                  backgroundColor: 'grey',
                  paddingRight: 3,
                  paddingLeft: 3,
                }
              }}
              containerStyle={{
                borderWidth: 1,
              }}
              title='View All Games'
            />}
          <Text style={styles.heading}>PLAYERS</Text>
          <FlatList
            data={this.state.teamInfo.Players}
            keyExtractor = {(item, index) => item.PlayerId.toString()} 
            renderItem={({index, item }) =>
            (
              <ListItem
                chevron
                containerStyle={{
                  borderWidth: 1,
                }}
                badge={{
                  value: getAverageStats(item.Stats.TotalStats, item.Stats.Count).PointsPerGame + ' ppg',
                  badgeStyle: {
                    backgroundColor: 'grey',
                    paddingRight: 3,
                    paddingLeft: 3,
                  }
                }}
                title={item.Profile.Name}
                subtitle={item.Profile.Position.charAt(0).toUpperCase() + item.Profile.Position.slice(1)}
                leftIcon={<FontAwesomeIcon icon={ faUser } size={30}/>}
              />
          )}
          />
          <Text style={styles.heading}></Text>
          <ListItem
            chevron
            containerStyle={{
              borderWidth: 1,
            }}
            title='Team Statistics' />
          <ListItem
            chevron
            containerStyle={{
              borderWidth: 1,
            }}
            title='Competition' />
        </ScrollView>}  
      </View>
    );
  }
}

Teams.navigationOptions = ({ navigation }) => {
    return {
        tabBarVisible: true,
        tabBarIcon: ({ focused, tintColor }) => {
              return (
                  <FontAwesomeIcon icon={ faUsers } color={focused ? tintColor : '#E5E7E9'} size={45}/>
              )
        }
    }
};

export default Teams;

const styles = StyleSheet.create({
  heading: {
    textAlignVertical: "center",
    textAlign: "center",
    backgroundColor:colorScheme.secondary,
    color: "white"
  }
})