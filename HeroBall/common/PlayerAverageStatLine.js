import React from 'react';
import { Text, View, StyleSheet, ScrollView} from 'react-native';
import { withNavigation } from 'react-navigation';
import { Table, Row} from 'react-native-table-component';
import colorScheme from './Colors'

class PlayerAverageStatLine extends React.Component {
    /* 
        options:
        player = pb.PlayerInfo = the player 
    */

  constructor(props) {
    super(props)

    allTimestats = getAverageStats(props.player.AggregateStats.Stats)

    statCategories = ['MinutesPerGame', 'PointsPerGame', 'TwoPointFGP', 'ThreePointFGP', 'ReboundsPerGame', 'AssistsPerGame', 'StealsPerGame', 'BlocksPerGame']

    tableData = []
    firstColumnData = []
    tableHeader = ['GP']

    careerData = [props.player.AggregateStats.Stats.GameCount]

    for (var i in statCategories) {
      careerData.push(allTimestats[statCategories[i]])
      tableHeader.push(statAbbreviation[statCategories[i]])
    }

    var widthArr = new Array(tableHeader.length).fill(50)

    /* now for all teams too! */
    for (var i in props.player.Teams) {
      teamData = [props.player.Teams[i].AggregateStats.Stats.GameCount]
      firstColumnData.push([props.player.Teams[i].Team.Name])
      teamAverageStats = getAverageStats(props.player.Teams[i].AggregateStats.Stats)

      /* generate the table row */
      for (var i in statCategories) {
        teamData.push(teamAverageStats[statCategories[i]])
      }      
      
      /* append to the data */
      tableData.push(teamData)
    }

    /* we want career data last */
    tableData.push(careerData)
    firstColumnData.push(['Career'])

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
        <View style={{flexDirection:'row'}}>
          <Table borderStyle={{borderWidth: 2, borderColor: 'lightsteelblue'}}>
            <Row widthArr={[150]} data={['Stats']} style={styles.head} textStyle={styles.text}/>
            {firstColumnData.map((rowData, index) => (
                    <Row
                      key={index}
                      data={rowData}
                      widthArr={[150]}
                      style={[styles.row, index%2 && {backgroundColor: 'lightsteelblue'}]}
                      textStyle={styles.text}
                    />
                  ))
            }          
          </Table>
        <ScrollView horizontal={true}>
          <Table borderStyle={{borderWidth: 2, borderColor: 'lightsteelblue'}}>
            <Row widthArr={state.widthArr} data={state.tableHead} style={styles.head} textStyle={styles.text}/>
            {tableData.map((rowData, index) => (
                    <Row
                      key={index}
                      data={rowData}
                      widthArr={state.widthArr}
                      style={[styles.row, index%2 && {backgroundColor: 'lightsteelblue'}]}
                      textStyle={styles.text}
                    />
                  ))
            }
          </Table>
        </ScrollView>
        </View>
      </View>
    );
  }
}

export default withNavigation(PlayerAverageStatLine);

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