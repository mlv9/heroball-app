import React from 'react';
import { Text, View, StyleSheet} from 'react-native';
import { withNavigation } from 'react-navigation';
import StatLines from './StatLines'
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

    statCategories = [
      'MPG', 
      'PPG', 
      '2PFG', 
      '3PFG',
      'FT',
      'RPG', 
      'APG', 
      'SPG', 
      'BPG',
      'TPG'
    ]

    tableData = []
    firstColumnData = []
    tableHead = ['GP']

    careerData = [props.career.Stats.GameCount]

    for (var i in statCategories) {
      careerData.push(allTimestats[statCategories[i]])
      tableHead.push(statCategories[i])
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
        <StatLines
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
  heading: {
    textAlignVertical: "center",
    textAlign: "center",
    backgroundColor:colorScheme.secondary,
    color: "white"
  }
});