import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View, FlatList } from 'react-native';
import GameResult from './GameResult';
import { ListItem } from 'react-native-elements';
import colorScheme from './Colors';
import { withNavigation } from 'react-navigation';

class GamesList extends React.Component {

  constructor(props) {
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
              <TouchableOpacity onPress={ () => { this.props.navigation.navigate('GameDetailedView', {gameId: item.GameId}) }}>
                <GameResult game={item} />
              </TouchableOpacity>
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

export default withNavigation(GamesList);

const styles = StyleSheet.create({
  heading: {
    textAlignVertical: "center",
    textAlign: "center",
    backgroundColor:colorScheme.secondary,
    color: "white"
  }
})