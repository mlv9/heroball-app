import React from 'react';
import { StyleSheet, ScrollView} from 'react-native';
import { withNavigation } from 'react-navigation';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import moment from 'moment';

class PlayersStatLine extends React.Component {
    /* 
        options:
        players = array of pb.PlayerGameStats to be displayed
        rowHeader = names / games = what will be placed in the first row for each stat line
        games = pb.Game = array of games (only used when rowHeader = games)
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

    mappedHeadings = []
    for (var i in headings) {
      title = this.headingsMap[headings[i]]

      if (title !== undefined || title !== '') {
        mappedHeadings.push(title)
      } else {
        mappedHeadings.push(headings[i])
      }
    }

    if (props.rowHeader == 'names') {
      mappedHeadings.unshift('Name')
    } else if (props.rowHeader == 'games') {
      mappedHeadings.unshift('Game')
    }

    /* now get values */
    tableData = []

    var widthArr = new Array(mappedHeadings.length).fill(50)

    for (var i in players) {
      statLine = Object.values(players[i].Stats)

      if (props.rowHeader == 'names') {
        statLine.unshift(players[i].Player.Name)
        widthArr[0] = 100 /* increase the width of the name column */
      } else if (props.rowHeader == 'games') {
        /* find the matching game */
        teamId = players[i].Team.TeamId
        game = null

        for (var j in props.games) {
          if (players[i].GameId == props.games[j].GameId) {
            game = props.games[j]
          }
        }
        
        if (game == null) {
          console.log("Could not find game for stats")
          continue
        }

        /* check if home team */
        if (teamId == game.HomeTeam.TeamId) {
          seperator = 'vs'
        } else {
          seperator = '@'
        }

        gameHeader = moment(game.GameTime).format("DD/MM/YY") + ' ' + seperator + ' ' + game.AwayTeam.Name

        // 30/4 @ Raptors
        // 24/4 vs Raptors
        statLine.unshift(gameHeader)
        widthArr[0] = 150 /* increase the width of the game column */
      }
      
      tableData.push(statLine)
    }

    this.state = {
      tableHead: mappedHeadings,
      tableData: tableData,
      widthArr: widthArr
    }
  }
  
  render() {
  
    const state = this.state

    return (
      <ScrollView horizontal={true}>
        <Table borderStyle={{borderWidth: 2, borderColor: 'grey'}}>
          <Row widthArr={state.widthArr} data={state.tableHead} style={styles.head} textStyle={styles.text}/>
          <Rows widthArr={state.widthArr} data={state.tableData} style={styles.rows} textStyle={styles.text}/>
        </Table>
      </ScrollView>
    );
  }
}

export default withNavigation(PlayersStatLine);

const styles = StyleSheet.create({
  head: { height: 40, backgroundColor: 'lightgrey' },
  rows: {backgroundColor: 'white'},
  text: { margin: 2 }
});