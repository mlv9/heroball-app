import React from 'react';
import { TouchableOpacity, ActivityIndicator, Image, StyleSheet, ScrollView,  Text, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faUsers  } from '@fortawesome/free-solid-svg-icons'
import colorScheme from './Colors';
import ViewHeader from './ViewHeader';
import { ListItem } from 'react-native-elements';
import Progress from 'react-native-progress/Circle';
import GamesList from './GamesList';
import PlayerList from './PlayerList';

class Teams extends React.Component {

  subscription = null

  constructor(props) {
    super(props)
    this.state = {
    }
  }

  componentDidMount() {
    subscription = this.props.navigation.addListener('willFocus', this.loadTeam);
  }

  componentWillUnmount() {
    subscription.remove()
  }

  loadTeam = () => {

    teamIdToLoad = this.props.navigation.getParam("teamId", 0)

    /* for development, lets just show something */
    if (teamIdToLoad == 0) {
      teamIdToLoad = 1
    }

    if (this.state.teamInfo !== undefined && teamIdToLoad == this.state.teamInfo.Team.TeamId) {
      return;
    }

    /* else set blank */
    this.setState({
      teamInfo: undefined
    })

    return doRPC('https://api.heroball.app/v1/get/team/info',
        {
          TeamId: teamIdToLoad
        })
      .then((response) => response.json())
      .then((response) => {
        this.setState({
          teamInfo: response,
        })
      })
      .catch((error) => {
        console.log(error)
        Alert.alert("Error loading team.");
      });
  }

  render() {
    return (
      <View style={{
          backgroundColor: colorScheme.background,
          flex:1,
        }}>
        <ViewHeader name='Teams' />
        {this.state.teamInfo === undefined && 
          <ActivityIndicator style={{marginTop: 50}}/>
        }
        {this.state.teamInfo !== undefined && 
        <ScrollView>
          <Image style={{height:200}}
            source={{uri: `http://www-static2.spulsecdn.net/pics/00/01/54/07/1540783_1_M.jpg`}}
            indicator={Progress.Circle}
            />
            <Text>{this.state.teamInfo.Team.Name}</Text>
          <GamesList 
            games={this.state.teamInfo.RecentGames} 
            gameIds={this.state.teamInfo.GameIds} />
          <PlayerList
            players={this.state.teamInfo.Players}
            count={2} 
            ordering={'PointsPerGame'}
            key={this.state.teamInfo.Team.TeamId} />
          <Text style={styles.heading}></Text>
          <ListItem
            chevron
            containerStyle={{
              borderWidth: 1,
            }}
            title='Team Statistics' />
            <TouchableOpacity onPress={() => { this.props.navigation.navigate('Competitions', {competitionId: this.state.teamInfo.Competition.CompetitionId})}}>
              <ListItem
                chevron
                containerStyle={{
                  borderWidth: 1,
                }}
                title='View Competition'
                subtitle={printCompName(this.state.teamInfo.Competition)}
                subtitleStyle={{
                    color: 'grey'
                }} />
            </TouchableOpacity>
        </ScrollView>}  
      </View>
    )
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