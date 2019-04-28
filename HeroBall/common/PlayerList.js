import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View, FlatList } from 'react-native';
import { ListItem } from 'react-native-elements';
import colorScheme from './Colors';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { withNavigation } from 'react-navigation';

/* a list of players
options:
- ordering = string = Leaders / jersey / rpg / apg / bpg / spg / apg = stat to order on
- count = int = 1-n = number of players to display individually
*/

class PlayerList extends React.Component {

  constructor(props) {
    super(props)
    this.state = {}
    if (this.props.players !== undefined) {
        this.updatePlayerList(this.props.players, this.props.ordering, this.props.count)
    }
  }

  statsMap = {
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

  updatePlayerList = (players, ordering, count) => {

    this.state.players = undefined

    /* add averages to all players */
    for (var i in players) {
        players[i].Averages = getAverageStats(players[i].StatsAllTime.TotalStats, players[i].StatsAllTime.Count)
    }

    playersToDisplay = []

    /* sort on various values */
    if (ordering == 'PointsPerGame' ||
        ordering == 'ReboundsPerGame' ||
        ordering == 'AssistsPerGame' ||
        ordering == 'StealsPerGame' ||
        ordering == 'BlocksPerGame' ||
        ordering == 'TurnoversPerGame' ||
        ordering == 'MinutesPerGame' ||
        ordering == 'TwoPointFGP' ||
        ordering == 'ThreePointFGP' ||
        ordering == 'FreeThrowPercent') {

        for (var i in players) {
            players[i].BadgeText = players[i].Averages[ordering] + this.statsMap[ordering]
        }

        players.sort(function(a, b) {return b.Averages[ordering] - a.Averages[ordering]})

        /* display all by default */
        playersToDisplay = players

        /* trim */
        if (count !== undefined && players.length > count) {
            playersToDisplay = players.slice(0, count)
        }

    } else if (ordering == 'Leaders') {
        /* this is a bit tricker, we want to show PPG, RPG, APG, SPG, BPG, in that order */
        /* we need to create a map of playerId to stats info */
        categories = ['PointsPerGame', 'ReboundsPerGame', 'AssistsPerGame', 'StealsPerGame', 'BlocksPerGame']

        /* we create a new player array to only include stat leaders */
        for (var i in categories) {
            players.sort(function(a, b) {return b.Averages[categories[i]] - a.Averages[categories[i]]})
            if (players[0].BadgeText !== undefined) {
                /* becomes an append */
                players[0].BadgeText +=  ', '
            } else {
                /* an init */
                players[0].BadgeText = ''
            }
            players[0].BadgeText += players[0].Averages[categories[i]] + this.statsMap[categories[i]]
        }

            
            /* display only stat leaders */
            for (var i in players) {
                if (players[i].BadgeText !== undefined) {
                    playersToDisplay.push(players[i])
                }
            }
        }

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
          {this.state.players !== undefined &&
            <View>
                <Text style={styles.heading}>PLAYERS</Text>
                <FlatList
                data={this.state.players}
                keyExtractor = {(item, index) => item.PlayerId.toString()} 
                renderItem={({index, item }) =>
                (
                    <TouchableOpacity onPress={() => { this.props.navigation.navigate('Players', {playerId: item.PlayerId}) }}>
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
                    </TouchableOpacity>
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
            </View>}
      </View>
    );
  }
}

export default withNavigation(PlayerList);

const styles = StyleSheet.create({
  heading: {
    textAlignVertical: "center",
    textAlign: "center",
    backgroundColor:colorScheme.secondary,
    color: "white"
  }
})