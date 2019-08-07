import React from 'react';
import { Text, View, StyleSheet, ScrollView} from 'react-native';
import { withNavigation } from 'react-navigation';
import AverageStatLines from './AverageStatLines'
import colorScheme from './Colors'

class PlayerAveragesStatLines extends React.Component {
    /* 
        options:
        player = required = pb.Player
        teams = optional = pb.PlayerTeam
        career = required = pb.PlayerAggregateStats
        
    */

  constructor(props) {
    super(props)

    allTimestats = getAverageStats(props.career.Stats)

    statCategories = ['MinutesPerGame', 'PointsPerGame', 'TwoPointFGP', 'ThreePointFGP', 'ReboundsPerGame', 'AssistsPerGame', 'StealsPerGame', 'BlocksPerGame']

    tableData = []
    firstColumnData = []
    tableHead = ['GP']

    careerData = [props.career.Stats.GameCount]

    for (var i in statCategories) {
      careerData.push(allTimestats[statCategories[i]])
      tableHead.push(statAbbreviation[statCategories[i]])
    }

    widthArr = new Array(tableHead.length).fill(50)

    /* now for all teams too! */
    if (props.teams !== undefined) {
      for (var i in props.teams) {
        teamData = [props.teams[i].AggregateStats.Stats.GameCount]
        firstColumnData.push([props.teams[i].Team.Name])
        teamAverageStats = getAverageStats(props.teams[i].AggregateStats.Stats)
  
        /* generate the table row */
        for (var i in statCategories) {
          teamData.push(teamAverageStats[statCategories[i]])
        }      
        
        /* append to the data */
        tableData.push(teamData)
      }
    }

    /* we want career data last */
    tableData.push(careerData)
    firstColumnData.push(['Career'])
  }
  
  render() {
    const state = this.state
    return (
      <View>
        {this.props.title !== undefined && 
        <Text style={styles.heading}>{this.props.title}</Text>
        }
        <AverageStatLines
          firstColumnTitle={'Stats'}
          tableHead={tableHead}
          tableData={tableData}
          widthArr={widthArr}
          firstColumnData={firstColumnData}
          />
      </View>
    );
  }
}

export default withNavigation(PlayerAveragesStatLines);

const styles = StyleSheet.create({
  head: { height: 40, backgroundColor: 'lightsteelblue' },
  row: {backgroundColor: 'white'},
  text: { margin: 2 },
  heading: {
    textAlignVertical: "center",
    textAlign: "center",
    backgroundColor:colorScheme.secondary,
    color: "white"
  }
});