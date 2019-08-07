import React from 'react';
import { Text, View, StyleSheet, ScrollView} from 'react-native';
import { withNavigation } from 'react-navigation';
import { Table, Row} from 'react-native-table-component';
import colorScheme from './Colors'

class PlayerStatsResultLines extends React.Component {
    /* 
        options:
        players = required = []*pb.PlayerAggregateStats
    */

  constructor(props) {
    super(props)

    tableData = []
    firstColumnData = []

    /* build the lines for each player */
    for (var h in props.players) {

        playerAverages = getAverageStats(props.players[h].Stats)

        statCategories = ['MinutesPerGame', 'PointsPerGame', 'TwoPointFGP', 'ThreePointFGP', 'ReboundsPerGame', 'AssistsPerGame', 'StealsPerGame', 'BlocksPerGame']

        playerLine = [props.players[h].Stats.GameCount]

        for (var i in statCategories) {
            playerLine.push(playerAverages[statCategories[i]])
        }


        /* we want career data last */
        tableData.push(playerLine)
        firstColumnData.push([props.players[h].Player.Name])
    }

    /* lets build the table header */
    tableHeader = ['GP']
    for (var i in statCategories) {
        tableHeader.push(statAbbreviation[statCategories[i]])
    }
    var widthArr = new Array(tableHeader.length).fill(50)

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
            <Row widthArr={[150]} data={['Players']} style={styles.head} textStyle={styles.text}/>
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

export default withNavigation(PlayerStatsResultLines);

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