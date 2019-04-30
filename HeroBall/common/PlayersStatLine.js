import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Text, View, FlatList } from 'react-native';
import { ListItem } from 'react-native-elements';
import { withNavigation } from 'react-navigation';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';

class PlayersStatLine extends React.Component {
    /* 
        options:
        players = array of pb.PlayerGameStats to be displayed
        rowHeader = name / gameInfo = what will be placed in the first row for each stat line
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

    mappedHeadings.unshift('Name')

    /* now get values */
    tableData = []

    for (var i in players) {
      statLine = Object.values(players[i].Stats)
      statLine.unshift(players[i].Player.Name)
      tableData.push(statLine)
    }

    this.state = {
      tableHead: mappedHeadings,
      tableData: tableData
    }
  }
  
  render() {
  
    const state = this.state
    var widthArr = new Array(state.tableHead.length).fill(50)
    widthArr[0] = 100 /* increase the width of the name column */

    return (
      <ScrollView horizontal={true}>
        <Table borderStyle={{borderWidth: 2, borderColor: 'grey'}}>
          <Row widthArr={widthArr} data={state.tableHead} style={styles.head} textStyle={styles.text}/>
          <Rows widthArr={widthArr} data={state.tableData} textStyle={styles.text}/>
        </Table>
      </ScrollView>
    );
  }
}

export default withNavigation(PlayersStatLine);

const styles = StyleSheet.create({
  head: { height: 40, backgroundColor: 'lightgrey' },
  text: { margin: 2 }
});