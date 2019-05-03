import React from 'react';
import { Text, View, StyleSheet, ScrollView} from 'react-native';
import { withNavigation } from 'react-navigation';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import moment from 'moment';
import colorScheme from './Colors'

class PlayerAverageStatLine extends React.Component {
    /* 
        options:
        player = pb.PlayerInfo = the player 
        timespan = career / year / team = where the condensed stats should apply to
    */

  constructor(props) {
    super(props)

    allTimestats = getAverageStats(props.player.StatsAllTime.TotalStats, props.player.StatsAllTime.Count)

    statCategories = ['MinutesPerGame', 'PointsPerGame', 'TwoPointFGP', 'ThreePointFGP', 'ReboundsPerGame', 'AssistsPerGame', 'StealsPerGame', 'BlocksPerGame']

    tableData = []
    tableHeader = ['Stats', 'GP']

    careerData = ['Career', props.player.StatsAllTime.Count]

    for (var i in statCategories) {
      careerData.push(allTimestats[statCategories[i]])
      tableHeader.push(statAbbreviation[statCategories[i]])
    }

    var widthArr = new Array(tableHeader.length).fill(50)
    widthArr[0] = 150

    /* now for all teams too! */
    for (var i in props.player.Teams) {
      teamData = [props.player.Teams[i].Team.Name, props.player.Teams[i].Stats.Count]
      teamAverageStats = getAverageStats(props.player.Teams[i].Stats.TotalStats, props.player.Teams[i].Stats.Count)

      /* generate the table row */
      for (var i in statCategories) {
        teamData.push(teamAverageStats[statCategories[i]])
      }      
      
      /* append to the data */
      tableData.push(teamData)
    }

    /* we want it last */
    tableData.push(careerData)

    this.state = {
      tableHead: tableHeader,
      tableData: tableData,
      widthArr: widthArr,
    }
  }
  
  render() {
    const state = this.state
    return (
      <View>
        {this.props.title !== undefined && 
        <Text style={styles.heading}>{this.props.title}</Text>
        }
        <ScrollView horizontal={true}>
          <Table borderStyle={{borderWidth: 2, borderColor: 'grey'}}>
            <Row widthArr={state.widthArr} data={state.tableHead} style={styles.head} textStyle={styles.text}/>
            <Rows widthArr={state.widthArr} data={state.tableData} style={styles.rows} textStyle={styles.text}/>
          </Table>
        </ScrollView>
      </View>
    );
  }
}

export default withNavigation(PlayerAverageStatLine);

const styles = StyleSheet.create({
  head: { height: 40, backgroundColor: 'lightgrey' },
  rows: { backgroundColor: 'white' },
  text: { margin: 2 },
  heading: {
    textAlignVertical: "center",
    textAlign: "center",
    backgroundColor:colorScheme.secondary,
    color: "white"
  }
});