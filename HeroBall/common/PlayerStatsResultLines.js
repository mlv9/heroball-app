import React from 'react';
import { Text, View, StyleSheet, ScrollView} from 'react-native';
import { withNavigation } from 'react-navigation';
import AverageStatLines from './AverageStatLines'
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
    tableHead = ['GP']
    for (var i in statCategories) {
      tableHead.push(statAbbreviation[statCategories[i]])
    }
    widthArr = new Array(tableHead.length).fill(50)
  }
  
  render() {
    const state = this.state
    return (
      <View>
        {this.props.title !== undefined && 
        <Text style={styles.heading}>{this.props.title}</Text>
        }
        <AverageStatLines
          firstColumnTitle={'Players'}
          tableHead={tableHead}
          tableData={tableData}
          widthArr={widthArr}
          firstColumnData={firstColumnData}
          />
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