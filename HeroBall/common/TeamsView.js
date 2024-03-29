import React from 'react';
import { RefreshControl, Alert, TouchableOpacity, ActivityIndicator, Image, StyleSheet, ScrollView,  Text, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faUsers, faList } from '@fortawesome/free-solid-svg-icons'
import colorScheme from './Colors';
import ViewHeader from './ViewHeader';
import { ListItem } from 'react-native-elements';
import Progress from 'react-native-progress/Circle';
import GamesList from './GamesList';
import PlayerList from './PlayerList';

class TeamsView extends React.Component {

  subscription = null

  constructor(props) {
    super(props)
    this.state = {
      loading: true,
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
      teamIdToLoad = 169
    }

    if (this.state.teamInfo !== undefined && teamIdToLoad == this.state.teamInfo.Team.TeamId) {
      return;
    }

    /* else set blank */
    this.setState({
      loading: true
    })

    return doRPC('v1/get/team/info',
        {
          TeamId: teamIdToLoad
        })
      .then((response) => response.json())
      .then((response) => {
        this.setState({
          teamInfo: response,
          loading: false,
        })
      })
      .catch((error) => {
        this.setState({
          loading: false
        })
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
        <ViewHeader name='Teams' 
          rightComponent={
            <TouchableOpacity style={{height: 30, justifyContent: 'flex-end', width:50, alignItems: 'center'}} onPress={this.showGameFilter}>
              <FontAwesomeIcon icon={ faList } style={{color:'white'}} size={18}/>
            </TouchableOpacity>
          }
        />
        {this.state.teamInfo === undefined && 
          <ActivityIndicator style={{marginTop: 50}} size={'large'}/>
        }
        {this.state.teamInfo !== undefined && 
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.loading}
              onRefresh={() => {this.loadTeam()}}
            />}
          >
          <Image style={{height:200}}
            source={{uri: `http://www-static2.spulsecdn.net/pics/00/01/54/07/1540783_1_M.jpg`}}
            indicator={Progress.Circle}
            />
            <Text>{this.state.teamInfo.Team.Name}</Text>
          <PlayerList
            playersCursor={this.state.teamInfo.Players}
            key={this.state.teamInfo.Team.TeamId + '_PlayerList'} />
          <GamesList 
            gamesCursor={this.state.teamInfo.RecentGames} 
            key={this.state.teamInfo.Team.TeamId + '_GamesList'} 
            showTotal={true}/>
          <Text style={styles.heading}></Text>
          <ListItem
            containerStyle={{
              borderWidth: 1,
            }}>
              <ListItem.Content>
                <ListItem.Title>
                  Team Statistics
                </ListItem.Title>
              </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
          <TouchableOpacity onPress={() => { this.props.navigation.navigate('Competitions', {competitionId: this.state.teamInfo.Competition.CompetitionId})}}>
            <ListItem
              containerStyle={{
                borderWidth: 1,
              }}>
                <ListItem.Content>
                  <ListItem.Title>
                    View Competition
                  </ListItem.Title>
                  <ListItem.Subtitle
                    containerStyle={{
                      color: 'grey'
                    }}>
                    {printCompName(this.state.teamInfo.Competition)}
                  </ListItem.Subtitle>
                </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>
          </TouchableOpacity>
        </ScrollView>}  
      </View>
    )
  }
}

TeamsView.navigationOptions = ({ navigation }) => {
    return {
        tabBarVisible: true,
        tabBarIcon: ({ focused, tintColor }) => {
              return (
                  <FontAwesomeIcon icon={ faUsers } color={focused ? tintColor : '#E5E7E9'} size={45}/>
              )
        }
    }
};

export default TeamsView;

const styles = StyleSheet.create({
  heading: {
    textAlignVertical: "center",
    textAlign: "center",
    backgroundColor:colorScheme.secondary,
    color: "white"
  }
})