import React from 'react';
import { View, StyleSheet, ScrollView} from 'react-native';
import { withNavigation } from 'react-navigation';
import { Table, Row} from 'react-native-table-component';

class StatLines extends React.Component {
    /* 
        options:
        firstColumnTitle={'Players'}
        tableHead={tableHead} = array of top row
        tableData={tableData} = array of remaining rows
        widthArr={widthArr} = int array for column width
        firstColumnData={firstColumnData} = array for first column (so it doesnt scroll)
        showRanking = bool = optional = list the number next to each row
        startingRank= int = optional = starting number for above
    */
    headerWidthArr = [150]
    firstColumnTitles = []

    constructor(props) {
      super(props)

      this.firstColumnTitles.push(props.firstColumnTitle)

      if (this.props.showRanking) {
        this.headerWidthArr.unshift(35)
        this.firstColumnTitles.unshift('#')
      }
    }

  render() {

    return (
        <View style={{flexDirection:'row'}}>
          <Table borderStyle={{borderWidth: 2, borderColor: 'lightsteelblue'}}>
            <Row widthArr={this.headerWidthArr} data={this.firstColumnTitles} style={styles.head} textStyle={styles.text}/>
            {this.props.firstColumnData.map((rowData, index) => {
              
              if (this.props.showRanking === true) {
                ranking = this.props.startingRank + index
                rowData.unshift(ranking)
              }
                return (
                        <Row
                          key={index}
                          data={rowData}
                          widthArr={this.headerWidthArr}
                          style={[styles.row, index%2 && {backgroundColor: 'lightsteelblue'}]}
                          textStyle={styles.text}
                        />
                      )})}
          </Table>
        <ScrollView horizontal={true}>
          <Table borderStyle={{borderWidth: 2, borderColor: 'lightsteelblue'}}>
            <Row widthArr={this.props.widthArr} data={this.props.tableHead} style={styles.head} textStyle={styles.text}/>
            {this.props.tableData.map((rowData, index) => (
                    <Row
                      key={index}
                      data={rowData}
                      widthArr={this.props.widthArr}
                      style={[styles.row, index%2 && {backgroundColor: 'lightsteelblue'}]}
                      textStyle={styles.text}
                    />
                  ))
            }
          </Table>
        </ScrollView>
        </View>
    );
  }
}

export default withNavigation(StatLines);

const styles = StyleSheet.create({
  head: { height: 40, backgroundColor: 'lightsteelblue' },
  row: {backgroundColor: 'white'},
  text: { margin: 2 },
});