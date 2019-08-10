import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View, FlatList } from 'react-native';
import { ListItem } from 'react-native-elements';
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
    return averages.PPG + ' PPG' + averages.RPG + ' RPG, ' + averages.APG + ' APG'
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
                <ListItem
                  chevron
                  leftIcon={<FontAwesomeIcon icon={ faUsers } size={30}/>}
                  containerStyle={{
                    borderWidth: 1,
                  }}
                  badge={{
                    value: this.getBadgeText(item.AggregateStats.Stats, item.AggregateStats.Stats.GameCount),
                    badgeStyle: {
                      backgroundColor: 'grey',
                      paddingRight: 3,
                      paddingLeft: 3,
                    }
                  }}
                  title={item.Team.Name + ' Jersey #' + item.JerseyNumbers[0]}
                  subtitle={printCompName(item.Competition)}
                  subtitleStyle={{
                    color: 'grey'
                }} 
                />
              </TouchableOpacity>
            )}
          />
          { this.props.teams.length > this.props.count &&
            <ListItem
              chevron
              badge={{
                value: this.props.teams.length || 0,
                badgeStyle: {
                  backgroundColor: 'grey',
                  paddingRight: 3,
                  paddingLeft: 3,
                }
              }}
              containerStyle={{
                borderWidth: 1,
              }}
              title='View All Teams'
            />}
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