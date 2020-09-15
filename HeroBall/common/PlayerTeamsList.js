import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View, FlatList } from 'react-native';
import { Avatar, Badge, ListItem } from 'react-native-elements';
import colorScheme from './Colors';
import { withNavigation } from 'react-navigation';
import { faUsers  } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

class PlayerTeamsList extends React.Component {

  /* options
  - teams (the list of teams)
  - count (the number to show before truncating)
  */

  constructor(props) {
    super(props)
    this.state = {}
  }

  getBadgeText = (stats, count) => {
    averages = getAverageStats(stats, count)
    return averages.PPG + ' PPG ' + averages.RPG + ' RPG, ' + averages.APG + ' APG'
  }
  
  
  render() {
    return (
      <View>
        <Text style={styles.heading}>TEAMS</Text>
          <FlatList
            data={this.props.teams}
            keyExtractor = {(item, index) => item.Team.TeamId.toString()} 
            renderItem={({index, item }) =>
            (
              <TouchableOpacity onPress={ () => { this.props.navigation.navigate('Teams', {gameId: item.Team.TeamId}) }}>
                <ListItem>
                  <Avatar>{<FontAwesomeIcon icon={ faUsers } size={30}/>}</Avatar>
                  <ListItem.Content>
                    <ListItem.Title>
                      {item.Team.Name + ' Jersey #' + item.JerseyNumbers[0]}
                    </ListItem.Title>
                    <ListItem.Subtitle
                      containerStyle={{
                        color: 'grey'
                      }}>
                    {printCompName(item.Competition)}
                    </ListItem.Subtitle>
                  </ListItem.Content>
                  <Badge 
                      value={this.getBadgeText(item.AggregateStats.Stats, item.AggregateStats.Stats.GameCount)}
                      status="primary"
                      containerStyle={{
                        paddingRight: 3,
                        paddingLeft: 3,
                      }}
                      />
                </ListItem>
              </TouchableOpacity>
            )}
          />
          { this.props.teams.length > this.props.count &&
            <ListItem
              containerStyle={{
                borderWidth: 1,
              }}>
              <ListItem.Content>
                <ListItem.Title>
                  View All Teams
                </ListItem.Title>
              </ListItem.Content>
              <Badge 
                value={this.props.teams.length || 0}
                status="primary"
                containerStyle={{
                  paddingRight: 3,
                  paddingLeft: 3,
                }}/> 
              <ListItem.Chevron />
            </ListItem>}
      </View>
    );
  }
}

export default withNavigation(PlayerTeamsList);

const styles = StyleSheet.create({
  heading: {
    textAlignVertical: "center",
    textAlign: "center",
    backgroundColor:colorScheme.secondary,
    color: "white"
  }
})