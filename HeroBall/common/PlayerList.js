import React from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { ListItem } from 'react-native-elements';
import colorScheme from './Colors';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons'

/* a list of players
options:
- ordering = string = top / jersey / rpg / apg / bpg / spg / apg = stat to order on
- count = int = 1-n = number of players to display individually
*/

export default class PlayerList extends React.Component {

  statsMap = {
    'PointsPerGame': 'PPG',
    'ReboundsPerGame': 'RPG',
    'AssistsPerGame': 'APG',
    'StealsPerGame': 'SPG',
    'BlocksPerGame': 'BPG',
    'TurnoversPerGame': 'TPG',
    'MinutesPerGame': 'MPG',
    'TwoPointFGP': '2PFG%%',
    'ThreePointFGP': '3PFG%%',
    'FreeThrowPercent': 'FT%'
  }

  constructor(props) {

    if (props.playerIds === undefined) {
      props.playerIds = []
    }
    super(props)

    /* get top stat averages */
    playerAverages = []

    /* add Averages to all props */
    for (var i in props.players) {
        props.players[i].Averages = this.getAverageStats(props.players[i].Stats.TotalStats, props.players[i].Stats.Count)
    }

    /* sort on various values */
    if (props.ordering == 'PointsPerGame' ||
        props.ordering == 'ReboundsPerGame' ||
        props.ordering == 'AssistsPerGame' ||
        props.ordering == 'StealsPerGame' ||
        props.ordering == 'BlocksPerGame' ||
        props.ordering == 'TurnoversPerGame' ||
        props.ordering == 'MinutesPerGame' ||
        props.ordering == 'TwoPointFGP' ||
        props.ordering == 'ThreePointFGP' ||
        props.ordering == 'FreeThrowPercent') {
        props.players.sort(function(a, b) {return b.Averages[props.ordering] - a.Averages[props.ordering]})
    }
  }
  
  getAverageStats = (stats, count) => {
    return {
      'PointsPerGame': ((stats.TwoPointFGM * 2 + stats.ThreePointFGM * 3 + stats.FreeThrowsMade) / count).toFixed(1),
      'ReboundsPerGame': ((stats.OffensiveRebounds + stats.DefensiveRebounds) / count).toFixed(1),
      'AssistsPerGame': ((stats.Assists) / count).toFixed(1),
      'BlocksPerGame': ((stats.Blocks) / count).toFixed(1),
      'StealsPerGame': ((stats.Steals) / count).toFixed(1),
      'TurnoversPerGame': ((stats.Turnovers) / count).toFixed(1),
      'MinutesPerGame': ((stats.Minutes) / count).toFixed(1),
      'TwoPointFGP': Math.round((stats.TwoPointFGM / stats.TwoPointFGM) * 100),
      'ThreePointFGP': Math.round((stats.ThreePointFGM / stats.ThreePointFMA) * 100),
      'FreeThrowPercent': Math.round((stats.FreeThrowsMade / stats.FreeThrowsAttempted) * 100),
    }
  }

  render() {
    return (
      <View>
        <Text style={styles.heading}>PLAYERS</Text>
        <FlatList
        data={this.props.players}
        keyExtractor = {(item, index) => item.PlayerId.toString()} 
        renderItem={({index, item }) =>
        (
            <ListItem
            chevron
            containerStyle={{
                borderWidth: 1,
            }}
            badge={{
                value: this.getAverageStats(item.Stats.TotalStats, item.Stats.Count)[this.props.ordering] + ' ' + this.statsMap[this.props.ordering],
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  heading: {
    textAlignVertical: "center",
    textAlign: "center",
    backgroundColor:colorScheme.secondary,
    color: "white"
  }
})