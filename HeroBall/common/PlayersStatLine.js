import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Text, View, FlatList } from 'react-native';
import { ListItem } from 'react-native-elements';
import { withNavigation } from 'react-navigation';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';

class PlayersStatLine extends React.Component {
    /* 
        options:
        players = array of pb.PlayerGameStats to be displayed
    */

  constructor(props) {
    super(props)

    headings = Object.keys(this.props.players[0].Stats)
    headings.unshift('Name')

    /* now get values */
    tableData = []

    for (var i in this.props.players) {
      statLine = Object.values(this.props.players[i].Stats)
      statLine.unshift(this.props.players[i].Player.Name)
      tableData.push(statLine)
    }

    this.state = {
      tableHead: headings,
      tableData: tableData
    }
  }
  
  render() {
    const state = this.state
    return (
      <ScrollView horizontal={true}>
        <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
          <Row data={state.tableHead} style={styles.head} textStyle={styles.text}/>
          <Rows data={state.tableData} textStyle={styles.text}/>
        </Table>
      </ScrollView>
    );
  }
}

export default withNavigation(PlayersStatLine);

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  head: { height: 40, backgroundColor: '#f1f8ff' },
  text: { margin: 6 }
});