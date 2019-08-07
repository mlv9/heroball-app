import React from 'react';
import { Text, View, StyleSheet} from 'react-native';
import { withNavigation } from 'react-navigation';
import StatLines from './StatLines';
import moment from 'moment';
import colorScheme from './Colors'

class PlayersStatLine extends React.Component {
    /* 
        options:
        players = array of pb.PlayerGameStats to be displayed
        rowHeader = names / games = what will be placed in the first row for each stat line
        games = pb.Game = array of games (only used when rowHeader = games) for header info
        title = string = value to place as a header to stats (e.g. Team name)
    */

   headingsMap = {
    TwoPointFGM: '2PM',
    TwoPointFGA : '2PA',
    ThreePointFGM: '3PA',
    ThreePointFGA: '3PM',
    FreeThrowsAttempted: 'FTA',
    FreeThrowsMade: 'FTM',
    OffensiveRebounds: 'OREB',
    DefensiveRebounds: 'DREB',
    Assists: 'AST',
    Blocks: 'BLK',
    Steals: 'STL',
    Turnovers: 'TOV',
    RegularFoulsForced: 'PFF',
    RegularFoulsCommitted: 'PFC',
    TechnicalFoulsCommitted: 'TFC',
    MinutesPlayed: 'MIN',
    Efficiency: 'EFF',
    Points: 'PTS',
    Rebounds: 'REB'
  }

  constructor(props) {
    super(props)

    if (props.header === undefined) {
      props.header = 'names'
    }

    players = []
    
    for (var i in this.props.players) {
      player = this.props.players[i]
      player.Stats = expandStats(player.Stats)
      players.push(player)
    }

    headings = Object.keys(players[0].Stats)

    tableHead = []
    for (var i in headings) {
      title = this.headingsMap[headings[i]]

      if (title !== undefined || title !== '') {
        tableHead.push(title)
      } else {
        tableHead.push(headings[i])
      }
    }
    widthArr = new Array(tableHead.length).fill(50)

    /* set up the table based on the first column choice */
    firstColumnWidth = 100
    firstColumnData = []

    if (props.rowHeader == 'names') {
      firstColumnData.push(['Name'])
    } else if (props.rowHeader == 'games') {
      firstColumnData.push(['Game'])
      firstColumnWidth = 150
    }

    /* now get values */
    tableData = []

    var runningTotals = null

    for (var i in players) {
      statLine = Object.values(players[i].Stats)

      /* append to running totals */
      if (runningTotals == null) {
        runningTotals = statLine.slice(0)
      } else {
        for (var j in statLine) {
          runningTotals[j] += statLine[j]
        }
      }

      if (props.rowHeader == 'names') {
        firstColumnData.push([players[i].Player.Name])
      } else if (props.rowHeader == 'games') {
        /* find the matching game */
        playersTeamId = players[i].Team.TeamId
        game = null

        for (var j in props.games.Games) {
          if (players[i].GameId == props.games.Games[j].GameId) {
            game = props.games.Games[j]
          }
        }
        
        if (game == null) {
          console.log("Could not find game for stats")
          continue
        }

        /* check if this player is on the home or away team */
        if (playersTeamId === game.HomeTeam.TeamId) {
          seperator = 'vs'
          opposingTeam = game.AwayTeam.Name
        } else {
          seperator = '@'
          opposingTeam = game.HomeTeam.Name
        }

        gameHeader = moment(game.GameTime).format("DD/MM/YY") + ' ' + seperator + ' ' + opposingTeam
        firstColumnData.push([gameHeader])
      }
      
      tableData.push(statLine)
    }

    /* also totals if requested */
    if (props.showTotals !== undefined && props.showTotals == true) {
      firstColumnData.push(['Totals'])
      tableData.push(runningTotals)
    }
  }
  
  render() {
  
    /* to address data binding performance */
    const state = this.state

    return (
      <View>
        {this.props.title !== undefined && 
        <Text style={styles.heading}>{this.props.title}</Text>
        }
        <StatLines
          firstColumnTitle={firstColumnData[0]}
          tableHead={tableHead}
          tableData={tableData}
          widthArr={widthArr}
          firstColumnData={firstColumnData.slice(1)}
          />
      </View>
    );
  }
}

export default withNavigation(PlayersStatLine);

const styles = StyleSheet.create({
  heading: {
    textAlignVertical: "center",
    textAlign: "center",
    backgroundColor:colorScheme.secondary,
    color: "white"
  }
});