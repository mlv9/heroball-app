import React from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { ListItem } from 'react-native-elements';
import colorScheme from './Colors';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons'

/* a list of players
options:
- ordering = string = Leaders / jersey / rpg / apg / bpg / spg / apg = stat to order on
- count = int = 1-n = number of players to display individually
*/

export default class PlayerList extends React.Component {

  constructor(props) {

    var statsMap = {
        'PointsPerGame': ' PPG',
        'ReboundsPerGame': ' RPG',
        'AssistsPerGame': ' APG',
        'StealsPerGame': ' SPG',
        'BlocksPerGame': ' BPG',
        'TurnoversPerGame': ' TPG',
        'MinutesPerGame': ' MPG',
        'TwoPointFGP': '% 2PFG',
        'ThreePointFGP': '% 3PFG',
        'FreeThrowPercent': '% FT'
      }

    var getAverageStats =   
        function (stats, count) {
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

    if (props.playerIds === undefined) {
      props.playerIds = []
    }
    
    if (props.count === undefined) {
        props.count = 3; /* default to 3 players */
    }

    /* get top stat averages */
    playerAverages = []

    /* add Averages to all props */
    for (var i in props.players) {
        props.players[i].Averages = getAverageStats(props.players[i].Stats.TotalStats, props.players[i].Stats.Count)
    }

    playersToDisplay = []

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

        for (var i in props.players) {
            props.players[i].BadgeText = props.players[i].Averages[props.ordering] + statsMap[props.ordering]
        }

        props.players.sort(function(a, b) {return b.Averages[props.ordering] - a.Averages[props.ordering]})

        /* display all */
        playersToDisplay = props.players

        /* trim */
        if (props.count !== undefined && props.players.length > props.count) {
            playersToDisplay = props.players.slice(0, props.count)
        }

    } else if (props.ordering == 'Leaders') {
        /* this is a bit tricker, we want to show PPG, RPG, APG, SPG, BPG, in that order */
        /* we need to create a map of playerId to stats info */
        categories = ['PointsPerGame', 'ReboundsPerGame', 'AssistsPerGame', 'StealsPerGame', 'BlocksPerGame']

        /* we create a new player array to only include stat leaders */
        for (var i in categories) {
            props.players.sort(function(a, b) {return b.Averages[categories[i]] - a.Averages[categories[i]]})
            if (props.players[0].BadgeText !== undefined) {
                /* becomes an append */
                props.players[0].BadgeText +=  ', '
            } else {
                /* an init */
                props.players[0].BadgeText = ''
            }
            props.players[0].BadgeText += props.players[0].Averages[categories[i]] + statsMap[categories[i]]
        }

            
            /* display only stat leaders */
            for (var i in props.players) {
                if (props.players[i].BadgeText !== undefined) {
                    playersToDisplay.push(props.players[i])
                }
            }
        }

        super(props)
        this.state = {
            players: playersToDisplay,
        }
    }
  
    getBadgeForPlayer = (player) => {
        return {
            value: player.BadgeText,
            badgeStyle: {
                backgroundColor: 'grey',
                paddingRight: 3,
                paddingLeft: 3,
            }
        }
    }

  render() {
    return (
      <View>
        <Text style={styles.heading}>PLAYERS</Text>
        <FlatList
        data={this.state.players}
        keyExtractor = {(item, index) => item.PlayerId.toString()} 
        renderItem={({index, item }) =>
        (
            <ListItem
            chevron
            containerStyle={{
                borderWidth: 1,
            }}
            badge={this.getBadgeForPlayer(item)}
            title={item.Profile.Name}
            subtitle={item.Profile.Position.charAt(0).toUpperCase() + item.Profile.Position.slice(1)}
            leftIcon={<FontAwesomeIcon icon={ faUser } size={30}/>}
            />
        )}
        />
        { this.state.players.length < this.props.players.length &&
            <ListItem
              chevron
              badge={{
                value: this.props.players.length || 0,
                badgeStyle: {
                  backgroundColor: 'grey',
                  paddingRight: 3,
                  paddingLeft: 3,
                }
              }}
              containerStyle={{
                borderWidth: 1,
              }}
              title='View All Players'
            />}
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