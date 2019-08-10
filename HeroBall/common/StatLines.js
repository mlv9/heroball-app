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
    */
  
  render() {
    return (
        <View style={{flexDirection:'row'}}>
          <Table borderStyle={{borderWidth: 2, borderColor: 'lightsteelblue'}}>
            <Row widthArr={[150]} data={[this.props.firstColumnTitle]} style={styles.head} textStyle={styles.text}/>
            {this.props.firstColumnData.map((rowData, index) => (
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