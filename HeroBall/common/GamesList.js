import React from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import GameResult from './GameResult';
import { ListItem } from 'react-native-elements';
import colorScheme from './Colors';

export default class GamesList extends React.Component {

  constructor(props) {

    if (props.gameIds === undefined) {
      props.gameIds = []
    }
    super(props)

    this.state = {}
  }
  
  render() {
    return (
      <View>
        <Text style={styles.heading}>GAMES</Text>
          <FlatList
            data={this.props.games}
            keyExtractor = {(item, index) => item.GameId.toString()} 
            renderItem={({index, item }) =>
            (
              <GameResult game={item} />
            )}
          />
          { this.props.games.length < this.props.gameIds.length &&
            <ListItem
              chevron
              badge={{
                value: this.props.gameIds.length || 0,
                badgeStyle: {
                  backgroundColor: 'grey',
                  paddingRight: 3,
                  paddingLeft: 3,
                }
              }}
              containerStyle={{
                borderWidth: 1,
              }}
              title='View All Games'
            />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  heading: {
    textAlignVertical: "center",
    textAlign: "center",
    backgroundColor:colorScheme.secondary,
    color: "white"
  }
})